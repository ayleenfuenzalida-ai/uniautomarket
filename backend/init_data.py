import asyncio
import json
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Load images
with open('/tmp/images_base64.json', 'r') as f:
    images = json.load(f)

async def init_database():
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Inicializando base de datos...")
    
    # Clear existing data (except users)
    await db.categories.delete_many({})
    await db.businesses.delete_many({})
    
    # Delete business users only
    await db.users.delete_many({"role": "business"})
    
    print("Datos anteriores eliminados")
    
    # Categories with their data
    categories_data = [
        {
            "name": "Desarmadurías",
            "description": "Encuentra repuestos usados y piezas de vehículos desarmados",
            "image_key": "desarmaduria",
            "order": 1
        },
        {
            "name": "Talleres Mecánicos",
            "description": "Servicios de reparación, mantención y diagnóstico vehicular",
            "image_key": "taller",
            "order": 2
        },
        {
            "name": "Herramientas",
            "description": "Venta de herramientas especializadas para el rubro automotriz",
            "image_key": "herramientas",
            "order": 3
        },
        {
            "name": "Repuestos",
            "description": "Venta de repuestos nuevos originales y alternativos",
            "image_key": "repuestos",
            "order": 4
        },
        {
            "name": "Grúas",
            "description": "Servicios de remolque y traslado de vehículos",
            "image_key": "gruas",
            "order": 5
        },
        {
            "name": "Pintura y Desabolladura",
            "description": "Reparación de carrocería, pintura y desabolladura profesional",
            "image_key": "pintura",
            "order": 6
        },
        {
            "name": "Scanner y Diagnóstico",
            "description": "Escaneo computacional y diagnóstico electrónico de vehículos",
            "image_key": "scanner",
            "order": 7
        },
        {
            "name": "Electrónica Automotriz",
            "description": "Reparación de módulos, ECU, inyectores y sistemas electrónicos",
            "image_key": "electronica",
            "order": 8
        },
        {
            "name": "Reprogramación ECU",
            "description": "Stage 1, 2, 3. Optimización de potencia y consumo. DPF/EGR off",
            "image_key": "reprogramacion",
            "order": 9
        }
    ]
    
    # Create categories
    category_ids = {}
    for cat_data in categories_data:
        image_key = cat_data.pop("image_key")
        cat_data["image_base64"] = images["categorias"].get(image_key, "")
        cat_data["business_count"] = 0
        
        result = await db.categories.insert_one(cat_data)
        category_ids[cat_data["name"]] = str(result.inserted_id)
        print(f"Categoría creada: {cat_data['name']}")
    
    # Businesses data
    businesses_data = [
        {
            "name": "Desarmaduría El Pitazo",
            "category": "Desarmadurías",
            "description": "Especialistas en repuestos de todas las marcas. Más de 20 años de experiencia en el rubro automotriz.",
            "address": "Av. Las Torres 2856, Santiago",
            "phone": "+56 9 8765 4321",
            "email": "elpitazo@uniautomarket.cl",
            "rating": 4.5,
            "review_count": 0,
            "image_key": "desarmaduria",
            "owner_name": "Juan Pérez",
            "owner_email": "juan.perez@elpitazo.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Mecánica Express",
            "category": "Talleres Mecánicos",
            "description": "Servicio rápido de mantención y reparaciones menores. Diagnóstico computacional gratuito.",
            "address": "Av. Irarrázaval 3456, Ñuñoa",
            "phone": "+56 9 7654 3210",
            "email": "contacto@mecanicaexpress.cl",
            "rating": 4.6,
            "review_count": 0,
            "image_key": "taller_mecanico",
            "owner_name": "María González",
            "owner_email": "maria.gonzalez@mecanicaexpress.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Auto Tools Chile",
            "category": "Herramientas",
            "description": "Distribuidor oficial de las mejores marcas de herramientas. Garantía extendida en todos los productos.",
            "address": "Av. Libertador Bernardo O'Higgins 2345, Santiago",
            "phone": "+56 9 6543 2109",
            "email": "ventas@autotoolschile.cl",
            "rating": 4.7,
            "review_count": 0,
            "image_key": "herramientas",
            "owner_name": "Carlos Rodríguez",
            "owner_email": "carlos.rodriguez@autotoolschile.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Auto Partes Express",
            "category": "Repuestos",
            "description": "Repuestos originales y alternativos de calidad. Envíos a todo Chile en 24-48 horas.",
            "address": "Av. Recoleta 3456, Recoleta",
            "phone": "+56 9 5432 1098",
            "email": "info@autopartesexpress.cl",
            "rating": 4.5,
            "review_count": 0,
            "image_key": "repuestos",
            "owner_name": "Pedro Sánchez",
            "owner_email": "pedro.sanchez@autopartesexpress.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Grúas Rápidas 24H",
            "category": "Grúas",
            "description": "Servicio de grúa disponible las 24 horas. Cobertura en toda la Región Metropolitana.",
            "address": "Av. Americo Vespucio 1234, Cerrillos",
            "phone": "+56 9 4321 0987",
            "email": "emergencias@gruasrapidas.cl",
            "rating": 4.8,
            "review_count": 0,
            "image_key": "gruas",
            "owner_name": "Luis Martínez",
            "owner_email": "luis.martinez@gruasrapidas.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Carrocería Pro",
            "category": "Pintura y Desabolladura",
            "description": "Taller de pintura con cabina de pintura y horno de secado. Garantía de por vida en pintura.",
            "address": "Av. Independencia 9012, Independencia",
            "phone": "+56 9 3210 9876",
            "email": "contacto@carroceriapro.cl",
            "rating": 4.9,
            "review_count": 0,
            "image_key": "pintura",
            "owner_name": "Andrea López",
            "owner_email": "andrea.lopez@carroceriapro.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Diagnóstico Pro",
            "category": "Scanner y Diagnóstico",
            "description": "Especialistas en diagnóstico computacional multimarca. Escaneo completo de sistemas electrónicos.",
            "address": "Av. Las Condes 7890, Las Condes",
            "phone": "+56 9 2109 8765",
            "email": "scanner@diagnosticopro.cl",
            "rating": 4.9,
            "review_count": 0,
            "image_key": "scanner",
            "owner_name": "Roberto Silva",
            "owner_email": "roberto.silva@diagnosticopro.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "ECU Master Chile",
            "category": "Electrónica Automotriz",
            "description": "Reparación y reprogramación de ECU. Especialistas en electrónica de potencia.",
            "address": "Av. Vicuña Mackenna 9012, Macul",
            "phone": "+56 9 1098 7654",
            "email": "contacto@ecumaster.cl",
            "rating": 4.8,
            "review_count": 0,
            "image_key": "electronica",
            "owner_name": "Francisco Morales",
            "owner_email": "francisco.morales@ecumaster.cl",
            "owner_password": "password123",
            "is_featured": True
        },
        {
            "name": "Chip Performance Chile",
            "category": "Reprogramación ECU",
            "description": "Reprogramación de ECU Stage 1, 2 y 3. Ganas hasta +50HP en tu vehículo.",
            "address": "Av. Kennedy 5678, Las Condes",
            "phone": "+56 9 0987 6543",
            "email": "info@chipperformance.cl",
            "rating": 4.9,
            "review_count": 0,
            "image_key": "electronica",  # Use electronica image as fallback
            "owner_name": "Diego Torres",
            "owner_email": "diego.torres@chipperformance.cl",
            "owner_password": "password123",
            "is_featured": True
        }
    ]
    
    # Create businesses and their owners
    for biz_data in businesses_data:
        category_name = biz_data.pop("category")
        category_id = category_ids[category_name]
        image_key = biz_data.pop("image_key")
        owner_name = biz_data.pop("owner_name")
        owner_email = biz_data.pop("owner_email")
        owner_password = biz_data.pop("owner_password")
        
        # Create business first
        business_dict = {
            "name": biz_data["name"],
            "category_id": category_id,
            "description": biz_data["description"],
            "address": biz_data["address"],
            "phone": biz_data["phone"],
            "email": biz_data["email"],
            "rating": biz_data["rating"],
            "review_count": biz_data["review_count"],
            "images_base64": [images["negocios"].get(image_key, "")],
            "owner_user_id": "",  # Will update
            "is_featured": biz_data.get("is_featured", False),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        business_result = await db.businesses.insert_one(business_dict)
        business_id = str(business_result.inserted_id)
        
        # Create owner user
        owner_dict = {
            "email": owner_email,
            "name": owner_name,
            "password_hash": pwd_context.hash(owner_password),
            "role": "business",
            "business_id": business_id,
            "created_at": datetime.utcnow()
        }
        
        owner_result = await db.users.insert_one(owner_dict)
        owner_id = str(owner_result.inserted_id)
        
        # Update business with owner_user_id
        await db.businesses.update_one(
            {"_id": business_result.inserted_id},
            {"$set": {"owner_user_id": owner_id}}
        )
        
        # Update category business count
        await db.categories.update_one(
            {"_id": category_id},
            {"$inc": {"business_count": 1}}
        )
        
        print(f"Negocio creado: {biz_data['name']}")
    
    # Create default contact info
    contact_info = {
        "phone": "+56 9 1234 5678",
        "email": "admin@uniautomarket.cl",
        "address": "Santiago, Chile",
        "whatsapp": "+56912345678",
        "facebook": "https://facebook.com/uniautomarket",
        "instagram": "https://instagram.com/uniautomarket",
        "twitter": "https://twitter.com/uniautomarket"
    }
    
    await db.site_contact_info.delete_many({})
    await db.site_contact_info.insert_one(contact_info)
    print("Información de contacto creada")
    
    client.close()
    print("\n✅ Base de datos inicializada correctamente!")
    print(f"   - {len(categories_data)} categorías creadas")
    print(f"   - {len(businesses_data)} negocios creados")
    print(f"   - {len(businesses_data)} usuarios de negocios creados")

if __name__ == "__main__":
    asyncio.run(init_database())
