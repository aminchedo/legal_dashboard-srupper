from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
import urllib.parse
from typing import Dict, Any, Optional

app = FastAPI(title="Legal Dashboard API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility function for safe Persian text handling
def safe_persian_decode(text: str) -> str:
    """Safely decode Persian text from URL parameters"""
    try:
        return urllib.parse.unquote(text, encoding='utf-8')
    except Exception:
        return text

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legal Dashboard API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "Legal Dashboard API"}

# Document management endpoints
@app.get("/documents")
async def get_documents(
    page: int = 1,
    limit: int = 20,
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None
):
    """Get documents with filtering and pagination"""
    try:
        # Handle Persian text parameters
        if category:
            category = safe_persian_decode(category)
        if search:
            search = safe_persian_decode(search)
        
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
        
        return JSONResponse(
            content=mock_documents,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "خطای سرور", "message": str(e)},
            headers={"Content-Type": "application/json; charset=utf-8"}
        )

@app.get("/documents/search")
async def search_documents(
    query: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    status: Optional[str] = None
):
    """Search documents with Persian text support"""
    try:
        # Handle Persian text parameters
        if query:
            query = safe_persian_decode(query)
        if category:
            category = safe_persian_decode(category)
        if source:
            source = safe_persian_decode(source)
        
        # Mock search results
        mock_results = {
            "items": [
                {
                    "id": "1",
                    "title": f"نتایج جستجو برای: {query or 'همه'}",
                    "domain": "dastour.ir",
                    "status": "completed",
                    "category": category or "همه",
                    "score": 0.95
                }
            ],
            "total": 1,
            "query": query,
            "filters": {
                "category": category,
                "source": source,
                "status": status
            }
        }
        
        return JSONResponse(
            content=mock_results,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "خطای جستجو", "message": str(e)},
            headers={"Content-Type": "application/json; charset=utf-8"}
        )

@app.get("/analytics")
async def get_analytics():
    """Get analytics data"""
    try:
        mock_analytics = {
            "totalDocuments": 12450,
            "activeCases": 89,
            "completionRate": 87.5,
            "totalItems": 47582,
            "recentItems": 1843,
            "categories": {
                "حقوقی": 12450,
                "اقتصادی": 8920,
                "اجتماعی": 7830,
                "فرهنگی": 6240,
                "فنی": 5100
            },
            "avgRating": 0.891,
            "todayStats": {"success_rate": 94.1},
            "weeklyTrend": [
                {"day": "شنبه", "success": 231},
                {"day": "یکشنبه", "success": 295},
                {"day": "دوشنبه", "success": 374},
                {"day": "سه‌شنبه", "success": 345},
                {"day": "چهارشنبه", "success": 396},
                {"day": "پنج‌شنبه", "success": 281},
                {"day": "جمعه", "success": 150}
            ],
            "monthlyGrowth": 18.3
        }
        
        return JSONResponse(
            content=mock_analytics,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "خطای تحلیل", "message": str(e)},
            headers={"Content-Type": "application/json; charset=utf-8"}
        )

@app.get("/scraping/stats")
async def get_scraping_stats():
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
        
        return JSONResponse(
            content=mock_stats,
            headers={"Content-Type": "application/json; charset=utf-8"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "خطای آمار", "message": str(e)},
            headers={"Content-Type": "application/json; charset=utf-8"}
        )

# Vercel serverless function handler
async def handler(request: Request) -> Response:
    """Main handler for Vercel serverless function"""
    try:
        # Parse the request path
        path = request.url.path
        method = request.method
        
        # Handle different endpoints
        if path == "/" and method == "GET":
            return JSONResponse(content={"status": "ok", "message": "Legal Dashboard API is running"})
        elif path == "/health" and method == "GET":
            return JSONResponse(content={"status": "healthy", "service": "Legal Dashboard API"})
        elif path.startswith("/documents"):
            # Route document requests to appropriate handlers
            if path == "/documents" and method == "GET":
                # Extract query parameters
                params = dict(request.query_params)
                page = int(params.get("page", 1))
                limit = int(params.get("limit", 20))
                category = params.get("category")
                status = params.get("status")
                search = params.get("search")
                return await get_documents(page=page, limit=limit, category=category, status=status, search=search)
            elif path == "/documents/search" and method == "GET":
                params = dict(request.query_params)
                return await search_documents(
                    query=params.get("query"),
                    category=params.get("category"),
                    source=params.get("source"),
                    status=params.get("status")
                )
            else:
                return JSONResponse(
                    status_code=404,
                    content={"error": "Document endpoint not found", "path": path}
                )
        elif path.startswith("/analytics"):
            if path == "/analytics" and method == "GET":
                return await get_analytics()
            else:
                return JSONResponse(
                    status_code=404,
                    content={"error": "Analytics endpoint not found", "path": path}
                )
        elif path.startswith("/scraping"):
            if path == "/scraping/stats" and method == "GET":
                return await get_scraping_stats()
            else:
                return JSONResponse(
                    status_code=404,
                    content={"error": "Scraping endpoint not found", "path": path}
                )
        else:
            return JSONResponse(
                status_code=404,
                content={"error": "Endpoint not found", "path": path}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error", "message": str(e)}
        )

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
 