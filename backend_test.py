#!/usr/bin/env python3
"""
Universal AutoMarket Backend API Tests
Comprehensive testing suite for all backend endpoints.
"""

import asyncio
import requests
import json
from datetime import datetime
import os
import sys

# Test Configuration
BACKEND_URL = "https://auto-market-mobile.preview.emergentagent.com/api"
ADMIN_EMAIL = "admin@uniautomarket.cl"
ADMIN_PASSWORD = "ayleen06448989"

class APITester:
    def __init__(self):
        self.admin_token = None
        self.user_token = None
        self.test_user_email = f"testuser_{int(datetime.now().timestamp())}@test.com"
        self.test_business_id = None
        self.test_category_id = None
        self.test_review_id = None
        self.test_contact_message_id = None
        self.results = {
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log(self, message, status="INFO"):
        print(f"[{status}] {message}")
        
    def test_failed(self, test_name, error):
        self.results["failed"] += 1
        self.results["errors"].append(f"{test_name}: {error}")
        self.log(f"❌ {test_name}: {error}", "FAIL")
        
    def test_passed(self, test_name):
        self.results["passed"] += 1
        self.log(f"✅ {test_name}", "PASS")
        
    def make_request(self, method, endpoint, data=None, headers=None, files=None):
        """Make HTTP request to API"""
        url = f"{BACKEND_URL}{endpoint}"
        
        try:
            if method == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method == "POST":
                if files:
                    response = requests.post(url, data=data, headers=headers, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == "PATCH":
                response = requests.patch(url, json=data, headers=headers, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
            
        except requests.exceptions.RequestException as e:
            self.log(f"Network error for {method} {url}: {str(e)}", "ERROR")
            return None

    def test_auth_admin_login(self):
        """Test admin login"""
        data = {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        }
        
        response = self.make_request("POST", "/auth/login", data)
        
        if not response:
            self.test_failed("Auth - Admin Login", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "access_token" in result and "user" in result:
                self.admin_token = result["access_token"]
                if result["user"]["role"] == "admin":
                    self.test_passed("Auth - Admin Login")
                    return True
                else:
                    self.test_failed("Auth - Admin Login", f"Invalid role: {result['user']['role']}")
            else:
                self.test_failed("Auth - Admin Login", "Missing token or user in response")
        else:
            self.test_failed("Auth - Admin Login", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_auth_user_register(self):
        """Test user registration"""
        data = {
            "email": self.test_user_email,
            "password": "testpass123",
            "name": "Test User"
        }
        
        response = self.make_request("POST", "/auth/register", data)
        
        if not response:
            self.test_failed("Auth - User Register", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "access_token" in result and "user" in result:
                self.user_token = result["access_token"]
                if result["user"]["role"] == "user":
                    self.test_passed("Auth - User Register")
                    return True
                else:
                    self.test_failed("Auth - User Register", f"Invalid role: {result['user']['role']}")
            else:
                self.test_failed("Auth - User Register", "Missing token or user in response")
        else:
            self.test_failed("Auth - User Register", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_auth_me(self):
        """Test /auth/me endpoint with user token"""
        if not self.user_token:
            self.test_failed("Auth - Me", "No user token available")
            return False
            
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = self.make_request("GET", "/auth/me", headers=headers)
        
        if not response:
            self.test_failed("Auth - Me", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "email" in result and result["email"] == self.test_user_email:
                self.test_passed("Auth - Me")
                return True
            else:
                self.test_failed("Auth - Me", f"Invalid user data: {result}")
        else:
            self.test_failed("Auth - Me", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_categories_list(self):
        """Test GET /categories"""
        response = self.make_request("GET", "/categories")
        
        if not response:
            self.test_failed("Categories - List", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) >= 9:
                # Store first category ID for later tests
                if result:
                    self.test_category_id = result[0]["_id"]
                self.test_passed("Categories - List")
                return True
            else:
                self.test_failed("Categories - List", f"Expected 9+ categories, got: {len(result) if isinstance(result, list) else 'non-list'}")
        else:
            self.test_failed("Categories - List", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_categories_get_specific(self):
        """Test GET /categories/{id}"""
        if not self.test_category_id:
            self.test_failed("Categories - Get Specific", "No category ID available")
            return False
            
        response = self.make_request("GET", f"/categories/{self.test_category_id}")
        
        if not response:
            self.test_failed("Categories - Get Specific", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "id" in result or "_id" in result:
                self.test_passed("Categories - Get Specific")
                return True
            else:
                self.test_failed("Categories - Get Specific", f"Invalid category data: {result}")
        else:
            self.test_failed("Categories - Get Specific", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_businesses_list(self):
        """Test GET /businesses"""
        response = self.make_request("GET", "/businesses")
        
        if not response:
            self.test_failed("Businesses - List", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list) and len(result) >= 9:
                # Store first business ID for later tests
                if result:
                    self.test_business_id = result[0]["_id"]
                self.test_passed("Businesses - List")
                return True
            else:
                self.test_failed("Businesses - List", f"Expected 9+ businesses, got: {len(result) if isinstance(result, list) else 'non-list'}")
        else:
            self.test_failed("Businesses - List", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_businesses_featured(self):
        """Test GET /businesses/featured"""
        response = self.make_request("GET", "/businesses/featured")
        
        if not response:
            self.test_failed("Businesses - Featured", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list):
                self.test_passed("Businesses - Featured")
                return True
            else:
                self.test_failed("Businesses - Featured", f"Expected list, got: {type(result)}")
        else:
            self.test_failed("Businesses - Featured", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_businesses_get_specific(self):
        """Test GET /businesses/{id}"""
        if not self.test_business_id:
            self.test_failed("Businesses - Get Specific", "No business ID available")
            return False
            
        response = self.make_request("GET", f"/businesses/{self.test_business_id}")
        
        if not response:
            self.test_failed("Businesses - Get Specific", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if ("id" in result or "_id" in result) and "name" in result:
                self.test_passed("Businesses - Get Specific")
                return True
            else:
                self.test_failed("Businesses - Get Specific", f"Invalid business data: {result}")
        else:
            self.test_failed("Businesses - Get Specific", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_businesses_create_admin(self):
        """Test POST /businesses (admin only)"""
        if not self.admin_token or not self.test_category_id:
            self.test_failed("Businesses - Create (Admin)", "Missing admin token or category ID")
            return False
            
        data = {
            "name": "Test Auto Shop",
            "category_id": self.test_category_id,
            "description": "Test automotive business for API testing",
            "address": "123 Test Street, Santiago, Chile",
            "phone": "+56912345678",
            "email": "testshop@example.com",
            "images_base64": [],
            "owner_email": f"owner_{int(datetime.now().timestamp())}@test.com",
            "owner_password": "ownerpass123",
            "owner_name": "Test Business Owner"
        }
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = self.make_request("POST", "/businesses", data, headers)
        
        if not response:
            self.test_failed("Businesses - Create (Admin)", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if ("id" in result or "_id" in result) and "name" in result:
                self.test_passed("Businesses - Create (Admin)")
                return True
            else:
                self.test_failed("Businesses - Create (Admin)", f"Invalid response data: {result}")
        else:
            self.test_failed("Businesses - Create (Admin)", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_businesses_toggle_featured(self):
        """Test PATCH /businesses/{id}/featured (admin only)"""
        if not self.admin_token or not self.test_business_id:
            self.test_failed("Businesses - Toggle Featured", "Missing admin token or business ID")
            return False
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = self.make_request("PATCH", f"/businesses/{self.test_business_id}/featured", headers=headers)
        
        if not response:
            self.test_failed("Businesses - Toggle Featured", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "message" in result:
                self.test_passed("Businesses - Toggle Featured")
                return True
            else:
                self.test_failed("Businesses - Toggle Featured", f"Invalid response: {result}")
        else:
            self.test_failed("Businesses - Toggle Featured", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_reviews_get_business_reviews(self):
        """Test GET /reviews/business/{business_id}"""
        if not self.test_business_id:
            self.test_failed("Reviews - Get Business Reviews", "No business ID available")
            return False
            
        response = self.make_request("GET", f"/reviews/business/{self.test_business_id}")
        
        if not response:
            self.test_failed("Reviews - Get Business Reviews", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list):
                self.test_passed("Reviews - Get Business Reviews")
                return True
            else:
                self.test_failed("Reviews - Get Business Reviews", f"Expected list, got: {type(result)}")
        else:
            self.test_failed("Reviews - Get Business Reviews", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_reviews_create(self):
        """Test POST /reviews (requires authenticated user)"""
        if not self.user_token or not self.test_business_id:
            self.test_failed("Reviews - Create", "Missing user token or business ID")
            return False
            
        data = {
            "business_id": self.test_business_id,
            "rating": 5,
            "comment": "Excellent service! Great auto shop with professional staff."
        }
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = self.make_request("POST", "/reviews", data, headers)
        
        if not response:
            self.test_failed("Reviews - Create", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if ("id" in result or "_id" in result) and "rating" in result:
                self.test_review_id = result.get("_id") or result.get("id")
                self.test_passed("Reviews - Create")
                return True
            else:
                self.test_failed("Reviews - Create", f"Invalid response data: {result}")
        else:
            self.test_failed("Reviews - Create", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_contact_message_create(self):
        """Test POST /contact/message"""
        data = {
            "name": "Carlos Mendoza",
            "email": "carlos.mendoza@example.com",
            "phone": "+56987654321",
            "message": "Hola, me interesa conocer más sobre los servicios automotrices disponibles en la plataforma."
        }
        
        response = self.make_request("POST", "/contact/message", data)
        
        if not response:
            self.test_failed("Contact - Create Message", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if "message" in result and "id" in result:
                self.test_contact_message_id = result["id"]
                self.test_passed("Contact - Create Message")
                return True
            else:
                self.test_failed("Contact - Create Message", f"Invalid response: {result}")
        else:
            self.test_failed("Contact - Create Message", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_contact_messages_get_admin(self):
        """Test GET /contact/messages (admin only)"""
        if not self.admin_token:
            self.test_failed("Contact - Get Messages (Admin)", "No admin token available")
            return False
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = self.make_request("GET", "/contact/messages", headers=headers)
        
        if not response:
            self.test_failed("Contact - Get Messages (Admin)", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            if isinstance(result, list):
                self.test_passed("Contact - Get Messages (Admin)")
                return True
            else:
                self.test_failed("Contact - Get Messages (Admin)", f"Expected list, got: {type(result)}")
        else:
            self.test_failed("Contact - Get Messages (Admin)", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_stats(self):
        """Test GET /stats"""
        response = self.make_request("GET", "/stats")
        
        if not response:
            self.test_failed("Stats - Get Stats", "Network error")
            return False
            
        if response.status_code == 200:
            result = response.json()
            required_fields = ["business_count", "product_count", "user_count", "avg_rating"]
            if all(field in result for field in required_fields):
                self.test_passed("Stats - Get Stats")
                return True
            else:
                missing = [f for f in required_fields if f not in result]
                self.test_failed("Stats - Get Stats", f"Missing fields: {missing}")
        else:
            self.test_failed("Stats - Get Stats", f"Status: {response.status_code}, Response: {response.text}")
        
        return False
    
    def test_unauthorized_access(self):
        """Test that admin endpoints require proper authorization"""
        # Try to create business without admin token
        data = {
            "name": "Unauthorized Test",
            "category_id": self.test_category_id or "test",
            "description": "Should fail",
            "address": "Test",
            "owner_email": "test@test.com",
            "owner_password": "test123",
            "owner_name": "Test"
        }
        
        response = self.make_request("POST", "/businesses", data)
        
        if not response:
            self.test_failed("Security - Unauthorized Access", "Network error")
            return False
            
        if response.status_code == 401 or response.status_code == 403:
            self.test_passed("Security - Unauthorized Access")
            return True
        else:
            self.test_failed("Security - Unauthorized Access", f"Expected 401/403, got: {response.status_code}")
        
        return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("=" * 60)
        print("UNIVERSAL AUTOMARKET BACKEND API TEST SUITE")
        print("=" * 60)
        print(f"Testing Backend URL: {BACKEND_URL}")
        print(f"Admin Credentials: {ADMIN_EMAIL}")
        print("-" * 60)
        
        # Authentication Tests
        print("\n🔐 AUTHENTICATION TESTS")
        self.test_auth_admin_login()
        self.test_auth_user_register()
        self.test_auth_me()
        
        # Categories Tests
        print("\n📂 CATEGORIES TESTS")
        self.test_categories_list()
        self.test_categories_get_specific()
        
        # Businesses Tests
        print("\n🏢 BUSINESSES TESTS")
        self.test_businesses_list()
        self.test_businesses_featured()
        self.test_businesses_get_specific()
        self.test_businesses_create_admin()
        self.test_businesses_toggle_featured()
        
        # Reviews Tests
        print("\n⭐ REVIEWS TESTS")
        self.test_reviews_get_business_reviews()
        self.test_reviews_create()
        
        # Contact Tests
        print("\n📧 CONTACT TESTS")
        self.test_contact_message_create()
        self.test_contact_messages_get_admin()
        
        # Stats Tests
        print("\n📊 STATS TESTS")
        self.test_stats()
        
        # Security Tests
        print("\n🔒 SECURITY TESTS")
        self.test_unauthorized_access()
        
        # Final Report
        print("\n" + "=" * 60)
        print("TEST RESULTS SUMMARY")
        print("=" * 60)
        print(f"✅ Passed: {self.results['passed']}")
        print(f"❌ Failed: {self.results['failed']}")
        print(f"📊 Total: {self.results['passed'] + self.results['failed']}")
        
        if self.results['errors']:
            print("\n🚨 FAILED TESTS:")
            for error in self.results['errors']:
                print(f"  - {error}")
        
        success_rate = (self.results['passed'] / (self.results['passed'] + self.results['failed'])) * 100
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        if success_rate >= 90:
            print("🎉 EXCELLENT: Backend API is working very well!")
        elif success_rate >= 75:
            print("✅ GOOD: Backend API is mostly working with minor issues")
        elif success_rate >= 50:
            print("⚠️  MODERATE: Backend API has some issues that need attention")
        else:
            print("🚨 CRITICAL: Backend API has major issues that need immediate attention")
        
        return self.results


if __name__ == "__main__":
    tester = APITester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results['failed'] > 0:
        sys.exit(1)
    else:
        sys.exit(0)