from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from bson import ObjectId
import os
import logging
from pathlib import Path
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============= MODELS =============

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    email: EmailStr
    name: str
    role: str = "user"  # admin, business, user
    business_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

class UserInDB(User):
    password_hash: str

# Category Models
class CategoryCreate(BaseModel):
    name: str
    description: str
    image_base64: str
    order: int = 0

class Category(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    description: str
    image_base64: str
    business_count: int = 0
    order: int = 0

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Business Models
class BusinessCreate(BaseModel):
    name: str
    category_id: str
    description: str
    address: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    images_base64: List[str] = []
    owner_email: EmailStr
    owner_password: str
    owner_name: str

class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    images_base64: Optional[List[str]] = None

class Business(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    category_id: str
    description: str
    address: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    rating: float = 0.0
    review_count: int = 0
    images_base64: List[str] = []
    owner_user_id: str
    is_featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Review Models
class ReviewCreate(BaseModel):
    business_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

class Review(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    user_name: str
    business_id: str
    rating: int
    comment: str
    approved: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Contact Models
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactMessageInDB(ContactMessage):
    id: Optional[str] = Field(None, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Site Contact Info
class SiteContactInfo(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    phone: str = "+56 9 1234 5678"
    email: EmailStr = "contacto@uniautomarket.cl"
    address: str = "Santiago, Chile"
    whatsapp: str = "+56912345678"
    facebook: str = "https://facebook.com/uniautomarket"
    instagram: str = "https://instagram.com/uniautomarket"
    twitter: str = "https://twitter.com/uniautomarket"

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}

# Stats Model
class Stats(BaseModel):
    business_count: int
    product_count: int
    user_count: int
    avg_rating: float

# Token Model
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# ============= HELPER FUNCTIONS =============

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user_data = await db.users.find_one({"email": email})
    if user_data is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    user_data["_id"] = str(user_data["_id"])
    if user_data.get("business_id"):
        user_data["business_id"] = str(user_data["business_id"])
    return User(**user_data)

async def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admin access required.")
    return current_user

# ============= AUTH ENDPOINTS =============

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_dict = {
        "email": user_data.email,
        "name": user_data.name,
        "password_hash": get_password_hash(user_data.password),
        "role": "user",
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    # Create token
    access_token = create_access_token(data={"sub": user_data.email})
    user = User(**user_dict)
    
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    user["_id"] = str(user["_id"])
    if user.get("business_id"):
        user["business_id"] = str(user["business_id"])
    
    access_token = create_access_token(data={"sub": user_data.email})
    user_obj = User(**user)
    
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ============= CATEGORY ENDPOINTS =============

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find().sort("order", 1).to_list(100)
    for cat in categories:
        cat_id = str(cat["_id"])
        cat["_id"] = cat_id
        cat["id"] = cat_id  # Add id field for frontend
    return categories

@api_router.get("/categories/{category_id}", response_model=Category)
async def get_category(category_id: str):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    category = await db.categories.find_one({"_id": ObjectId(category_id)})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category["_id"] = str(category["_id"])
    return category

@api_router.post("/categories", response_model=Category)
async def create_category(category: CategoryCreate, admin: User = Depends(get_admin_user)):
    category_dict = category.dict()
    category_dict["business_count"] = 0
    
    result = await db.categories.insert_one(category_dict)
    category_dict["_id"] = str(result.inserted_id)
    
    return Category(**category_dict)

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category: CategoryCreate, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    result = await db.categories.update_one(
        {"_id": ObjectId(category_id)},
        {"$set": category.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    updated_category = await db.categories.find_one({"_id": ObjectId(category_id)})
    updated_category["_id"] = str(updated_category["_id"])
    
    return Category(**updated_category)

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(category_id):
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    result = await db.categories.delete_one({"_id": ObjectId(category_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

# ============= BUSINESS ENDPOINTS =============

@api_router.get("/businesses", response_model=List[Business])
async def get_businesses(category_id: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category_id:
        query["category_id"] = category_id
    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}}
        ]
    
    businesses = await db.businesses.find(query).sort("created_at", -1).to_list(100)
    for business in businesses:
        business["_id"] = str(business["_id"])
    return businesses

@api_router.get("/businesses/featured", response_model=List[Business])
async def get_featured_businesses():
    businesses = await db.businesses.find({"is_featured": True}).sort("created_at", -1).to_list(20)
    for business in businesses:
        business["_id"] = str(business["_id"])
    return businesses

@api_router.get("/businesses/{business_id}", response_model=Business)
async def get_business(business_id: str):
    if not ObjectId.is_valid(business_id):
        raise HTTPException(status_code=400, detail="Invalid business ID")
    
    business = await db.businesses.find_one({"_id": ObjectId(business_id)})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    business["_id"] = str(business["_id"])
    return business

@api_router.post("/businesses", response_model=Business)
async def create_business(business_data: BusinessCreate, admin: User = Depends(get_admin_user)):
    # Create business owner user
    existing_user = await db.users.find_one({"email": business_data.owner_email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Business owner email already registered")
    
    # First create the business
    business_dict = {
        "name": business_data.name,
        "category_id": business_data.category_id,
        "description": business_data.description,
        "address": business_data.address,
        "phone": business_data.phone,
        "email": business_data.email,
        "rating": 0.0,
        "review_count": 0,
        "images_base64": business_data.images_base64,
        "owner_user_id": "",  # Will update later
        "is_featured": False,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    business_result = await db.businesses.insert_one(business_dict)
    business_id = str(business_result.inserted_id)
    
    # Create owner user
    owner_dict = {
        "email": business_data.owner_email,
        "name": business_data.owner_name,
        "password_hash": get_password_hash(business_data.owner_password),
        "role": "business",
        "business_id": business_id,
        "created_at": datetime.utcnow()
    }
    
    owner_result = await db.users.insert_one(owner_dict)
    owner_id = str(owner_result.inserted_id)
    
    # Update business with owner_user_id
    await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {"$set": {"owner_user_id": owner_id}}
    )
    
    # Update category business count
    await db.categories.update_one(
        {"_id": ObjectId(business_data.category_id)},
        {"$inc": {"business_count": 1}}
    )
    
    business_dict["_id"] = business_id
    business_dict["owner_user_id"] = owner_id
    
    return Business(**business_dict)

@api_router.put("/businesses/{business_id}", response_model=Business)
async def update_business(business_id: str, business_data: BusinessUpdate, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(business_id):
        raise HTTPException(status_code=400, detail="Invalid business ID")
    
    # Check if user is admin or business owner
    business = await db.businesses.find_one({"_id": ObjectId(business_id)})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    if current_user.role != "admin" and business["owner_user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this business")
    
    # Update only provided fields
    update_data = {k: v for k, v in business_data.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {"$set": update_data}
    )
    
    updated_business = await db.businesses.find_one({"_id": ObjectId(business_id)})
    updated_business["_id"] = str(updated_business["_id"])
    
    return Business(**updated_business)

@api_router.delete("/businesses/{business_id}")
async def delete_business(business_id: str, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(business_id):
        raise HTTPException(status_code=400, detail="Invalid business ID")
    
    business = await db.businesses.find_one({"_id": ObjectId(business_id)})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Delete business owner user
    await db.users.delete_one({"_id": ObjectId(business["owner_user_id"])})
    
    # Delete business
    await db.businesses.delete_one({"_id": ObjectId(business_id)})
    
    # Update category business count
    await db.categories.update_one(
        {"_id": ObjectId(business["category_id"])},
        {"$inc": {"business_count": -1}}
    )
    
    return {"message": "Business deleted successfully"}

@api_router.patch("/businesses/{business_id}/featured")
async def toggle_featured(business_id: str, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(business_id):
        raise HTTPException(status_code=400, detail="Invalid business ID")
    
    business = await db.businesses.find_one({"_id": ObjectId(business_id)})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    new_featured_status = not business.get("is_featured", False)
    
    await db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {"$set": {"is_featured": new_featured_status}}
    )
    
    return {"message": f"Business featured status updated to {new_featured_status}"}

# ============= REVIEW ENDPOINTS =============

@api_router.get("/reviews/business/{business_id}", response_model=List[Review])
async def get_business_reviews(business_id: str):
    reviews = await db.reviews.find({"business_id": business_id, "approved": True}).sort("created_at", -1).to_list(100)
    for review in reviews:
        review["_id"] = str(review["_id"])
    return reviews

@api_router.get("/reviews/all", response_model=List[Review])
async def get_all_reviews(admin: User = Depends(get_admin_user)):
    reviews = await db.reviews.find().sort("created_at", -1).to_list(1000)
    for review in reviews:
        review["_id"] = str(review["_id"])
    return reviews

@api_router.post("/reviews", response_model=Review)
async def create_review(review_data: ReviewCreate, current_user: User = Depends(get_current_user)):
    # Check if business exists
    if not ObjectId.is_valid(review_data.business_id):
        raise HTTPException(status_code=400, detail="Invalid business ID")
    
    business = await db.businesses.find_one({"_id": ObjectId(review_data.business_id)})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    # Check if user already reviewed this business
    existing_review = await db.reviews.find_one({
        "user_id": current_user.id,
        "business_id": review_data.business_id
    })
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this business")
    
    # Create review
    review_dict = {
        "user_id": current_user.id,
        "user_name": current_user.name,
        "business_id": review_data.business_id,
        "rating": review_data.rating,
        "comment": review_data.comment,
        "approved": True,
        "created_at": datetime.utcnow()
    }
    
    result = await db.reviews.insert_one(review_dict)
    review_dict["_id"] = str(result.inserted_id)
    
    # Update business rating
    all_reviews = await db.reviews.find({"business_id": review_data.business_id, "approved": True}).to_list(1000)
    avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
    
    await db.businesses.update_one(
        {"_id": ObjectId(review_data.business_id)},
        {
            "$set": {"rating": round(avg_rating, 1)},
            "$inc": {"review_count": 1}
        }
    )
    
    return Review(**review_dict)

@api_router.put("/reviews/{review_id}", response_model=Review)
async def update_review(review_id: str, rating: int, comment: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(review_id):
        raise HTTPException(status_code=400, detail="Invalid review ID")
    
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if user is admin or review owner
    if current_user.role != "admin" and review["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this review")
    
    await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": {"rating": rating, "comment": comment}}
    )
    
    # Recalculate business rating
    business_id = review["business_id"]
    all_reviews = await db.reviews.find({"business_id": business_id, "approved": True}).to_list(1000)
    if all_reviews:
        avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"rating": round(avg_rating, 1), "review_count": len(all_reviews)}}
        )
    
    updated_review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    updated_review["_id"] = str(updated_review["_id"])
    
    return Review(**updated_review)

@api_router.delete("/reviews/{review_id}")
async def delete_review(review_id: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(review_id):
        raise HTTPException(status_code=400, detail="Invalid review ID")
    
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Check if user is admin or review owner
    if current_user.role != "admin" and review["user_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this review")
    
    business_id = review["business_id"]
    
    await db.reviews.delete_one({"_id": ObjectId(review_id)})
    
    # Recalculate business rating
    all_reviews = await db.reviews.find({"business_id": business_id, "approved": True}).to_list(1000)
    if all_reviews:
        avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"rating": round(avg_rating, 1), "review_count": len(all_reviews)}}
        )
    else:
        await db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"rating": 0.0, "review_count": 0}}
        )
    
    return {"message": "Review deleted successfully"}

@api_router.patch("/reviews/{review_id}/approve")
async def approve_review(review_id: str, approved: bool, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(review_id):
        raise HTTPException(status_code=400, detail="Invalid review ID")
    
    result = await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": {"approved": approved}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Recalculate business rating
    review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    business_id = review["business_id"]
    all_reviews = await db.reviews.find({"business_id": business_id, "approved": True}).to_list(1000)
    if all_reviews:
        avg_rating = sum(r["rating"] for r in all_reviews) / len(all_reviews)
        await db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"rating": round(avg_rating, 1), "review_count": len(all_reviews)}}
        )
    else:
        await db.businesses.update_one(
            {"_id": ObjectId(business_id)},
            {"$set": {"rating": 0.0, "review_count": 0}}
        )
    
    return {"message": f"Review {'approved' if approved else 'disapproved'} successfully"}

# ============= CONTACT ENDPOINTS =============

@api_router.post("/contact/message")
async def create_contact_message(message: ContactMessage):
    message_dict = message.dict()
    message_dict["created_at"] = datetime.utcnow()
    message_dict["read"] = False
    
    result = await db.contact_messages.insert_one(message_dict)
    message_dict["_id"] = str(result.inserted_id)
    
    return {"message": "Message sent successfully", "id": message_dict["_id"]}

@api_router.get("/contact/messages", response_model=List[ContactMessageInDB])
async def get_contact_messages(admin: User = Depends(get_admin_user)):
    messages = await db.contact_messages.find().sort("created_at", -1).to_list(1000)
    for msg in messages:
        msg["_id"] = str(msg["_id"])
    return messages

@api_router.patch("/contact/messages/{message_id}/read")
async def mark_message_read(message_id: str, read: bool, admin: User = Depends(get_admin_user)):
    if not ObjectId.is_valid(message_id):
        raise HTTPException(status_code=400, detail="Invalid message ID")
    
    result = await db.contact_messages.update_one(
        {"_id": ObjectId(message_id)},
        {"$set": {"read": read}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return {"message": "Message status updated"}

# ============= CONTACT INFO ENDPOINTS =============

@api_router.get("/contact-info", response_model=SiteContactInfo)
async def get_contact_info():
    info = await db.site_contact_info.find_one()
    if not info:
        # Create default
        default_info = SiteContactInfo().dict()
        result = await db.site_contact_info.insert_one(default_info)
        default_info["_id"] = str(result.inserted_id)
        return SiteContactInfo(**default_info)
    
    info["_id"] = str(info["_id"])
    return SiteContactInfo(**info)

@api_router.put("/contact-info", response_model=SiteContactInfo)
async def update_contact_info(info: SiteContactInfo, admin: User = Depends(get_admin_user)):
    existing = await db.site_contact_info.find_one()
    
    info_dict = info.dict(exclude={"id"})
    
    if existing:
        await db.site_contact_info.update_one(
            {"_id": existing["_id"]},
            {"$set": info_dict}
        )
        info_dict["_id"] = str(existing["_id"])
    else:
        result = await db.site_contact_info.insert_one(info_dict)
        info_dict["_id"] = str(result.inserted_id)
    
    return SiteContactInfo(**info_dict)

# ============= STATS ENDPOINT =============

@api_router.get("/stats", response_model=Stats)
async def get_stats():
    business_count = await db.businesses.count_documents({})
    user_count = await db.users.count_documents({"role": "user"})
    
    # Calculate average rating
    businesses = await db.businesses.find({"review_count": {"$gt": 0}}).to_list(1000)
    avg_rating = 4.8
    if businesses:
        avg_rating = sum(b.get("rating", 0) for b in businesses) / len(businesses)
    
    # Estimate products (businesses * avg products per business)
    product_count = business_count * 100
    
    return Stats(
        business_count=business_count,
        product_count=product_count,
        user_count=user_count,
        avg_rating=round(avg_rating, 1)
    )

# ============= INIT ADMIN =============

@app.on_event("startup")
async def create_admin():
    # Check if admin exists
    admin = await db.users.find_one({"email": "admin@uniautomarket.cl"})
    if not admin:
        admin_dict = {
            "email": "admin@uniautomarket.cl",
            "name": "Super Admin",
            "password_hash": get_password_hash("ayleen06448989"),
            "role": "admin",
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_dict)
        logger.info("Super admin created successfully")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
