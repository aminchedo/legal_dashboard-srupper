from http.server import BaseHTTPRequestHandler
import json
import urllib.parse
from typing import Dict, Any, Optional

# Utility function for safe Persian text handling
def safe_persian_decode(text: str) -> str:
    """Safely decode Persian text from URL parameters"""
    try:
        return urllib.parse.unquote(text, encoding='utf-8')
    except Exception:
        return text

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests"""
        try:
            # Parse the request path
            path = self.path.split('?')[0]  # Remove query parameters from path
            
            # Handle different endpoints
            if path == "/" or path == "":
                response_data = {"status": "ok", "message": "Legal Dashboard API is running"}
            elif path == "/health":
                response_data = {"status": "healthy", "service": "Legal Dashboard API"}
            elif path.startswith("/documents"):
                response_data = self.handle_documents_endpoint()
            elif path.startswith("/analytics"):
                response_data = self.handle_analytics_endpoint()
            elif path.startswith("/scraping"):
                response_data = self.handle_scraping_endpoint()
            else:
                self.send_error(404, "Endpoint not found")
                return
            
            # Send successful response
            self.send_response(200)
            self.send_header('Content-type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.end_headers()
            
            response_json = json.dumps(response_data, ensure_ascii=False)
            self.wfile.write(response_json.encode('utf-8'))
            
        except Exception as e:
            self.send_error(500, f'Server Error: {str(e)}')
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
    
    def handle_documents_endpoint(self):
        """Handle document-related endpoints"""
        path = self.path.split('?')[0]
        query_params = self.parse_query_params()
        
        if path == "/documents":
            return self.get_documents(query_params)
        elif path == "/documents/search":
            return self.search_documents(query_params)
        elif path == "/documents/categories":
            return self.get_categories(query_params)
        elif path == "/documents/statistics":
            return self.get_statistics(query_params)
        elif path == "/documents/tags":
            return self.get_tags(query_params)
        else:
            return {"error": "Document endpoint not found", "path": path}
    
    def handle_analytics_endpoint(self):
        """Handle analytics endpoints"""
        path = self.path.split('?')[0]
        
        if path == "/analytics":
            return self.get_analytics()
        else:
            return {"error": "Analytics endpoint not found", "path": path}
    
    def handle_scraping_endpoint(self):
        """Handle scraping endpoints"""
        path = self.path.split('?')[0]
        
        if path == "/scraping/stats":
            return self.get_scraping_stats()
        else:
            return {"error": "Scraping endpoint not found", "path": path}
    
    def parse_query_params(self):
        """Parse query parameters from URL"""
        parsed_url = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_url.query)
        
        # Convert lists to single values
        params = {}
        for key, value in query_params.items():
            if value:
                params[key] = safe_persian_decode(value[0])
            else:
                params[key] = ""
        
        return params
    
    def get_documents(self, params):
        """Get documents with filtering and pagination"""
        try:
            page = int(params.get("page", 1))
            limit = int(params.get("limit", 20))
            category = params.get("category", "")
            status = params.get("status", "")
            search = params.get("search", "")
            
            # Mock response for now - replace with actual database query
            mock_documents = {
                "items": [
                    {
                        "id": "1",
                        "title": "قانون کار - اصلاحیه ۱۴۰۳",
                        "domain": "dastour.ir",
                        "status": "completed",
                        "category": "حقوقی",
                        "created_at": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": "2", 
                        "title": "آیین‌نامه تجارت الکترونیک",
                        "domain": "majles.ir",
                        "status": "completed",
                        "category": "اقتصادی",
                        "created_at": "2024-01-14T15:45:00Z"
                    }
                ],
                "total": 12450,
                "page": page,
                "limit": limit,
                "total_pages": 623
            }
            
            return mock_documents
        except Exception as e:
            return {"error": "خطای سرور", "message": str(e)}
    
    def search_documents(self, params):
        """Search documents with Persian text support"""
        try:
            query = params.get("query", "")
            category = params.get("category", "")
            source = params.get("source", "")
            status = params.get("status", "")
            
            # Mock search results
            mock_results = {
                "items": [
                    {
                        "id": "1",
                        "title": "قانون تجارت الکترونیکی",
                        "content": "متن کامل قانون تجارت الکترونیکی جمهوری اسلامی ایران",
                        "category": "قانون تجارت",
                        "source": "majles.ir",
                        "status": "completed",
                        "score": 0.95,
                        "tags": ["تجارت", "الکترونیک", "قانون"],
                        "createdAt": "2024-01-15T10:30:00Z",
                        "updatedAt": "2024-01-15T10:30:00Z"
                    },
                    {
                        "id": "2",
                        "title": "آیین‌نامه اجرایی قانون کار",
                        "content": "آیین‌نامه اجرایی قانون کار و تأمین اجتماعی",
                        "category": "قانون کار",
                        "source": "ilo.ir",
                        "status": "completed",
                        "score": 0.88,
                        "tags": ["کار", "تأمین اجتماعی", "آیین‌نامه"],
                        "createdAt": "2024-01-14T14:20:00Z",
                        "updatedAt": "2024-01-14T14:20:00Z"
                    }
                ],
                "total": 12450,
                "page": 1,
                "limit": 20,
                "filters": {
                    "query": query,
                    "category": category,
                    "source": source,
                    "status": status
                }
            }
            
            return mock_results
        except Exception as e:
            return {"error": "خطای جستجو", "message": str(e)}
    
    def get_categories(self, params):
        """Get document categories"""
        try:
            mock_categories = [
                {"id": "1", "name": "قانون تجارت", "count": 2340, "color": "#3B82F6"},
                {"id": "2", "name": "قانون کار", "count": 1890, "color": "#10B981"},
                {"id": "3", "name": "قانون مدنی", "count": 1560, "color": "#F59E0B"},
                {"id": "4", "name": "قانون مجازات", "count": 1230, "color": "#EF4444"},
                {"id": "5", "name": "آیین‌نامه‌ها", "count": 890, "color": "#8B5CF6"}
            ]
            return {"categories": mock_categories}
        except Exception as e:
            return {"error": "خطای دسته‌بندی", "message": str(e)}
    
    def get_statistics(self, params):
        """Get document statistics"""
        try:
            mock_stats = {
                "totalDocuments": 12450,
                "totalCategories": 15,
                "totalSources": 8,
                "recentUploads": 234,
                "processingJobs": 12,
                "completedJobs": 89,
                "failedJobs": 3,
                "successRate": 96.7
            }
            return mock_stats
        except Exception as e:
            return {"error": "خطای آمار", "message": str(e)}
    
    def get_tags(self, params):
        """Get document tags"""
        try:
            mock_tags = [
                {"id": "1", "name": "تجارت", "count": 890, "color": "#3B82F6"},
                {"id": "2", "name": "کار", "count": 670, "color": "#10B981"},
                {"id": "3", "name": "مالیات", "count": 450, "color": "#F59E0B"},
                {"id": "4", "name": "حقوق", "count": 380, "color": "#EF4444"},
                {"id": "5", "name": "قانون", "count": 320, "color": "#8B5CF6"}
            ]
            return {"tags": mock_tags}
        except Exception as e:
            return {"error": "خطای برچسب‌ها", "message": str(e)}
    
    def get_analytics(self):
        """Get analytics data"""
        try:
            mock_analytics = {
                "total_documents": 12450,
                "total_categories": 15,
                "total_sources": 8,
                "recent_uploads": 234,
                "processing_jobs": 12,
                "completed_jobs": 89,
                "failed_jobs": 3,
                "success_rate": 96.7,
                "categories": [
                    {"name": "قراردادها", "count": 45, "percentage": 30.0},
                    {"name": "آراء قضایی", "count": 62, "percentage": 41.3},
                    {"name": "قوانین", "count": 43, "percentage": 28.7}
                ],
                "trends": [
                    {"date": "2024-01-01", "documents": 120, "growth": 5.2},
                    {"date": "2024-01-02", "documents": 135, "growth": 12.5},
                    {"date": "2024-01-03", "documents": 142, "growth": 5.2},
                    {"date": "2024-01-04", "documents": 158, "growth": 11.3},
                    {"date": "2024-01-05", "documents": 168, "growth": 6.3}
                ],
                "sources": [
                    {"name": "majles.ir", "count": 45, "status": "active"},
                    {"name": "dastour.ir", "count": 38, "status": "active"},
                    {"name": "ilo.ir", "count": 22, "status": "active"},
                    {"name": "consumer.ir", "count": 15, "status": "inactive"}
                ]
            }
            return mock_analytics
        except Exception as e:
            return {"error": "خطای تحلیل", "message": str(e)}
    
    def get_scraping_stats(self):
        """Get scraping statistics"""
        try:
            mock_stats = {
                "totalSources": 12,
                "activeSources": 8,
                "recentlyScraped": 45,
                "successRate": 94.1,
                "failedJobs": 3,
                "queuedJobs": 7
            }
            return mock_stats
        except Exception as e:
            return {"error": "خطای آمار", "message": str(e)}
 