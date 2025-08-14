import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional

def get_analytics_data(filters: Dict[str, Any] = None) -> Dict[str, Any]:
    """Get analytics data with optional filters"""
    try:
        if filters is None:
            filters = {}
            
        # شبیه‌سازی داده‌های آمارگیری
        base_data = {
            "total_documents": 12450,
            "total_categories": 15,
            "total_sources": 8,
            "recent_uploads": 234,
            "processing_jobs": 12,
            "completed_jobs": 89,
            "failed_jobs": 3,
            "success_rate": 96.7
        }
        
        # اعمال فیلترها
        if filters.get("category"):
            base_data["filtered_documents"] = 2340  # شبیه‌سازی فیلتر
        if filters.get("source"):
            base_data["filtered_documents"] = 1890  # شبیه‌سازی فیلتر
        if filters.get("status"):
            base_data["filtered_documents"] = 5670  # شبیه‌سازی فیلتر
            
        # داده‌های دسته‌بندی
        categories = [
            {"name": "قراردادها", "count": 45, "percentage": 30.0},
            {"name": "آراء قضایی", "count": 62, "percentage": 41.3},
            {"name": "قوانین", "count": 43, "percentage": 28.7}
        ]
        
        # روند زمانی
        trends = [
            {"date": "2024-01-01", "documents": 120, "growth": 5.2},
            {"date": "2024-01-02", "documents": 135, "growth": 12.5},
            {"date": "2024-01-03", "documents": 142, "growth": 5.2},
            {"date": "2024-01-04", "documents": 158, "growth": 11.3},
            {"date": "2024-01-05", "documents": 168, "growth": 6.3}
        ]
        
        # آمار منابع
        sources = [
            {"name": "majles.ir", "count": 45, "status": "active"},
            {"name": "dastour.ir", "count": 38, "status": "active"},
            {"name": "ilo.ir", "count": 22, "status": "active"},
            {"name": "consumer.ir", "count": 15, "status": "inactive"}
        ]
        
        return {
            "status": "success",
            "message": "آمار کلی با موفقیت دریافت شد",
            "data": {
                "summary": base_data,
                "categories": categories,
                "trends": trends,
                "sources": sources,
                "applied_filters": filters,
                "generated_at": datetime.now().isoformat()
            },
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"خطا در پردازش داده‌های آمارگیری: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def get_analytics_advanced(filters: Dict[str, Any]) -> Dict[str, Any]:
    """Get advanced analytics with filters"""
    try:
        # اعتبارسنجی تاریخ‌ها
        if filters.get("start_date") and filters.get("end_date"):
            try:
                datetime.fromisoformat(filters["start_date"].replace('Z', '+00:00'))
                datetime.fromisoformat(filters["end_date"].replace('Z', '+00:00'))
            except ValueError:
                return {
                    "status": "error",
                    "message": "فرمت تاریخ نامعتبر است. از فرمت ISO استفاده کنید.",
                    "timestamp": datetime.now().isoformat()
                }
        
        # منطق آمارگیری
        analytics_data = get_analytics_data(filters)
        
        return {
            "status": "success",
            "message": "آمار با فیلترهای اعمال شده دریافت شد",
            "data": analytics_data["data"],
            "filters": filters,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"خطا در دریافت آمار: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }

def get_available_categories() -> List[Dict[str, Any]]:
    """دریافت دسته‌بندی‌های موجود"""
    return [
        {"id": "contracts", "name": "قراردادها", "count": 2340},
        {"id": "judgments", "name": "آراء قضایی", "count": 1890},
        {"id": "laws", "name": "قوانین", "count": 1560},
        {"id": "regulations", "name": "آیین‌نامه‌ها", "count": 1230},
        {"id": "standards", "name": "استانداردها", "count": 890}
    ]

def get_available_sources() -> List[Dict[str, Any]]:
    """دریافت منابع موجود"""
    return [
        {"id": "majles", "name": "majles.ir", "status": "active", "count": 45},
        {"id": "dastour", "name": "dastour.ir", "status": "active", "count": 38},
        {"id": "ilo", "name": "ilo.ir", "status": "active", "count": 22},
        {"id": "consumer", "name": "consumer.ir", "status": "inactive", "count": 15}
    ]

def handle_analytics_request(path: str, method: str = "GET", body: str = None) -> Dict[str, Any]:
    """Handle analytics requests based on path and method"""
    try:
        if path == "/analytics" and method == "GET":
            return get_analytics_data()
        elif path == "/analytics/advanced" and method == "GET":
            # Parse query parameters (simplified)
            filters = {}
            return get_analytics_advanced(filters)
        elif path == "/analytics" and method == "POST":
            # Parse JSON body
            if body:
                try:
                    request_data = json.loads(body)
                    filters = {k: v for k, v in request_data.items() if v is not None}
                    return get_analytics_advanced(filters)
                except json.JSONDecodeError:
                    return {
                        "status": "error",
                        "message": "فرمت JSON نامعتبر است",
                        "timestamp": datetime.now().isoformat()
                    }
            return get_analytics_data()
        elif path == "/analytics/categories":
            return {
                "status": "success",
                "message": "دسته‌بندی‌های موجود دریافت شد",
                "data": get_available_categories(),
                "timestamp": datetime.now().isoformat()
            }
        elif path == "/analytics/sources":
            return {
                "status": "success",
                "message": "منابع موجود دریافت شد",
                "data": get_available_sources(),
                "timestamp": datetime.now().isoformat()
            }
        else:
            return {
                "status": "error",
                "message": "Analytics endpoint not found",
                "path": path,
                "timestamp": datetime.now().isoformat()
            }
    except Exception as e:
        return {
            "status": "error",
            "message": f"خطا در پردازش درخواست analytics: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }