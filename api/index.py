import json
import urllib.parse
import sys
import traceback
from datetime import datetime
from typing import Dict, Any, Optional
from http.server import HTTPStatus
from analytics import handle_analytics_request

# Simple logging for serverless environment
def log_error(message: str, error: Exception = None, context: Dict[str, Any] = None):
    """Log errors with context for debugging"""
    timestamp = datetime.utcnow().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "level": "ERROR",
        "message": message,
        "error": str(error) if error else None,
        "traceback": traceback.format_exc() if error else None,
        "context": context or {}
    }
    
    # Print to stderr for Vercel logs
    print(json.dumps(log_entry, ensure_ascii=False), file=sys.stderr)

def log_info(message: str, context: Dict[str, Any] = None):
    """Log info messages"""
    timestamp = datetime.utcnow().isoformat()
    log_entry = {
        "timestamp": timestamp,
        "level": "INFO", 
        "message": message,
        "context": context or {}
    }
    
    # Print to stdout for Vercel logs
    print(json.dumps(log_entry, ensure_ascii=False))

# Utility function for safe Persian text handling
def safe_persian_decode(text: str) -> str:
    """Safely decode Persian text from URL parameters"""
    try:
        return urllib.parse.unquote(text, encoding='utf-8')
    except Exception:
        return text

def parse_query_params(query_string: str) -> Dict[str, str]:
    """Parse query parameters from URL"""
    if not query_string:
        return {}
    
    query_params = urllib.parse.parse_qs(query_string)
    
    # Convert lists to single values
    params = {}
    for key, value in query_params.items():
        if value:
            params[key] = safe_persian_decode(value[0])
        else:
            params[key] = ""
    
    return params

def create_response(data: Any, status_code: int = 200) -> Dict[str, Any]:
    """Create a properly formatted response for Vercel"""
    headers = {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
    
    return {
        'statusCode': status_code,
        'headers': headers,
        'body': json.dumps(data, ensure_ascii=False)
    }

def handle_documents_endpoint(path: str, params: Dict[str, str]) -> Dict[str, Any]:
    """Handle document-related endpoints"""
    if path == "/documents":
        return get_documents(params)
    elif path == "/documents/search":
        return search_documents(params)
    elif path == "/documents/categories":
        return get_categories(params)
    elif path == "/documents/statistics":
        return get_statistics(params)
    elif path == "/documents/tags":
        return get_tags(params)
    else:
        return {"error": "Document endpoint not found", "path": path}

def handle_scraping_endpoint(path: str) -> Dict[str, Any]:
    """Handle scraping endpoints"""
    if path == "/scraping/stats":
        return get_scraping_stats()
    else:
        return {"error": "Scraping endpoint not found", "path": path}

def get_documents(params: Dict[str, str]) -> Dict[str, Any]:
    """Get documents with filtering and pagination"""
    try:
        page = int(params.get("page", "1"))
        limit = int(params.get("limit", "20"))
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

def search_documents(params: Dict[str, str]) -> Dict[str, Any]:
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

def get_categories(params: Dict[str, str]) -> Dict[str, Any]:
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

def get_statistics(params: Dict[str, str]) -> Dict[str, Any]:
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

def get_tags(params: Dict[str, str]) -> Dict[str, Any]:
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

def get_scraping_stats() -> Dict[str, Any]:
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

def handler(request):
    """Main Vercel serverless handler - Vercel compatible format"""
    try:
        # Extract request data - Vercel request format
        method = request.get('httpMethod', request.get('method', 'GET')).upper()
        path = request.get('path', request.get('rawPath', '/'))
        query_string = request.get('queryStringParameters') or request.get('query', '')
        headers = request.get('headers', {})
        body = request.get('body', '')
        
        # Handle query string parameters
        if isinstance(query_string, dict):
            # Convert dict to query string format
            query_parts = []
            for key, value in query_string.items():
                if value is not None:
                    query_parts.append(f"{key}={urllib.parse.quote(str(value))}")
            query_string = "&".join(query_parts)
        elif not query_string:
            query_string = ""
        
        # Log incoming request
        log_info("Incoming request", {
            "method": method,
            "path": path,
            "query": query_string,
            "headers": {k: v for k, v in headers.items() if k.lower() not in ['authorization', 'cookie']},
            "body_length": len(body) if body else 0
        })
        
        # Parse path to remove query parameters
        clean_path = path.split('?')[0]
        
        # Parse query parameters
        params = parse_query_params(query_string)
        
        # Handle OPTIONS requests (CORS preflight)
        if method == 'OPTIONS':
            log_info("CORS preflight request handled")
            return create_response({"message": "OK"}, 200)
        
        # Route requests based on path
        if clean_path == "/" or clean_path == "/api" or clean_path == "":
            response_data = {
                "status": "ok", 
                "message": "Legal Dashboard API is running",
                "version": "1.0.0",
                "timestamp": datetime.utcnow().isoformat()
            }
        elif clean_path == "/api/health" or clean_path == "/health":
            response_data = {
                "status": "healthy", 
                "service": "Legal Dashboard API",
                "timestamp": datetime.utcnow().isoformat(),
                "uptime": "healthy"
            }
        elif clean_path.startswith("/api/documents") or clean_path.startswith("/documents"):
            # Remove /api prefix if present
            endpoint_path = clean_path.replace("/api", "")
            log_info(f"Processing documents endpoint: {endpoint_path}")
            response_data = handle_documents_endpoint(endpoint_path, params)
        elif clean_path.startswith("/api/analytics") or clean_path.startswith("/analytics"):
            # Remove /api prefix if present
            endpoint_path = clean_path.replace("/api", "")
            log_info(f"Processing analytics endpoint: {endpoint_path}")
            if method == "GET":
                response_data = handle_analytics_request(endpoint_path, "GET")
            elif method == "POST":
                response_data = handle_analytics_request(endpoint_path, "POST", body)
            else:
                response_data = {"error": "Method not allowed", "method": method}
        elif clean_path.startswith("/api/scraping") or clean_path.startswith("/scraping"):
            # Remove /api prefix if present  
            endpoint_path = clean_path.replace("/api", "")
            log_info(f"Processing scraping endpoint: {endpoint_path}")
            response_data = handle_scraping_endpoint(endpoint_path)
        else:
            log_info(f"Endpoint not found: {clean_path}")
            response_data = {
                "error": "Endpoint not found", 
                "path": clean_path,
                "available_endpoints": [
                    "/api/health",
                    "/api/documents",
                    "/api/documents/search", 
                    "/api/documents/categories",
                    "/api/documents/statistics",
                    "/api/documents/tags",
                    "/api/analytics",
                    "/api/analytics/categories",
                    "/api/analytics/sources", 
                    "/api/scraping/stats"
                ]
            }
            return create_response(response_data, 404)
        
        log_info("Request processed successfully", {"path": clean_path, "method": method})
        return create_response(response_data, 200)
        
    except Exception as e:
        log_error("Server error in main handler", e, {
            "path": request.get('path', request.get('rawPath', '/')),
            "method": request.get('httpMethod', request.get('method', 'GET')),
            "query": str(request.get('queryStringParameters', request.get('query', ''))),
            "body_length": len(request.get('body', '')) if request.get('body') else 0
        })
        
        error_response = {
            "error": "Internal Server Error",
            "message": str(e),
            "path": request.get('path', request.get('rawPath', '/')),
            "method": request.get('httpMethod', request.get('method', 'GET')),
            "timestamp": datetime.utcnow().isoformat(),
            "request_id": request.get('requestId', 'unknown')
        }
        return create_response(error_response, 500)

# Make the handler function available as the main export for Vercel
# This is the entry point that Vercel will call
def main(request):
    """Main entry point for Vercel - wrapper around handler"""
    return handler(request)
 