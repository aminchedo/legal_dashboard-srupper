from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import json
from datetime import datetime, timedelta

router = APIRouter()

# Model برای POST request
class AnalyticsRequest(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    category: Optional[str] = None
    source: Optional[str] = None
    status: Optional[str] = None
    limit: Optional[int] = 50

# قبل (فقط GET):
@router.get("/analytics")
async def get_analytics():
    """دریافت آمار کلی بدون فیلتر"""
    try:
        # منطق analytics پایه
        analytics_data = await get_analytics_data({})
        
        return {
            "status": "success",
            "message": "آمار کلی با موفقیت دریافت شد",
            "data": analytics_data,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در دریافت آمار: {str(e)}"
        )

# بعد (هم GET هم POST):
@router.get("/analytics/advanced")
async def get_analytics_advanced(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    source: Optional[str] = None,
    status: Optional[str] = None,
    limit: Optional[int] = 50
):
    """دریافت آمار با پارامترهای GET"""
    try:
        # منطق analytics با پارامترها
        filters = {
            "start_date": start_date,
            "end_date": end_date, 
            "category": category,
            "source": source,
            "status": status,
            "limit": limit
        }
        
        # حذف None values
        filters = {k: v for k, v in filters.items() if v is not None}
        
        # اعتبارسنجی تاریخ‌ها
        if start_date and end_date:
            try:
                datetime.fromisoformat(start_date.replace('Z', '+00:00'))
                datetime.fromisoformat(end_date.replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail="فرمت تاریخ نامعتبر است. از فرمت ISO استفاده کنید."
                )
        
        # منطق آمارگیری
        analytics_data = await get_analytics_data(filters)
        
        return {
            "status": "success",
            "message": "آمار با فیلترهای اعمال شده دریافت شد",
            "data": analytics_data,
            "filters": filters,
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در دریافت آمار: {str(e)}"
        )

@router.post("/analytics")
async def post_analytics(request: AnalyticsRequest):
    """دریافت آمار با پارامترهای POST"""
    try:
        filters = request.dict(exclude_none=True)
        
        # اعتبارسنجی تاریخ‌ها
        if filters.get("start_date") and filters.get("end_date"):
            try:
                datetime.fromisoformat(filters["start_date"].replace('Z', '+00:00'))
                datetime.fromisoformat(filters["end_date"].replace('Z', '+00:00'))
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail="فرمت تاریخ نامعتبر است. از فرمت ISO استفاده کنید."
                )
        
        # منطق آمارگیری
        analytics_data = await get_analytics_data(filters)
        
        return {
            "status": "success",
            "message": "آمار با درخواست POST دریافت شد",
            "data": analytics_data,
            "filters": filters,
            "timestamp": datetime.now().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در دریافت آمار: {str(e)}"
        )

@router.get("/analytics/categories")
async def get_analytics_categories():
    """دریافت دسته‌بندی‌های موجود برای فیلتر"""
    try:
        categories = await get_available_categories()
        
        return {
            "status": "success",
            "message": "دسته‌بندی‌های موجود دریافت شد",
            "data": categories,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در دریافت دسته‌بندی‌ها: {str(e)}"
        )

@router.get("/analytics/sources")
async def get_analytics_sources():
    """دریافت منابع موجود برای فیلتر"""
    try:
        sources = await get_available_sources()
        
        return {
            "status": "success",
            "message": "منابع موجود دریافت شد",
            "data": sources,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"خطا در دریافت منابع: {str(e)}"
        )

async def get_analytics_data(filters: Dict[str, Any]) -> Dict[str, Any]:
    """منطق اصلی آمارگیری"""
    try:
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
            "summary": base_data,
            "categories": categories,
            "trends": trends,
            "sources": sources,
            "applied_filters": filters,
            "generated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise Exception(f"خطا در پردازش داده‌های آمارگیری: {str(e)}")

async def get_available_categories() -> List[Dict[str, Any]]:
    """دریافت دسته‌بندی‌های موجود"""
    return [
        {"id": "contracts", "name": "قراردادها", "count": 2340},
        {"id": "judgments", "name": "آراء قضایی", "count": 1890},
        {"id": "laws", "name": "قوانین", "count": 1560},
        {"id": "regulations", "name": "آیین‌نامه‌ها", "count": 1230},
        {"id": "standards", "name": "استانداردها", "count": 890}
    ]

async def get_available_sources() -> List[Dict[str, Any]]:
    """دریافت منابع موجود"""
    return [
        {"id": "majles", "name": "majles.ir", "status": "active", "count": 45},
        {"id": "dastour", "name": "dastour.ir", "status": "active", "count": 38},
        {"id": "ilo", "name": "ilo.ir", "status": "active", "count": 22},
        {"id": "consumer", "name": "consumer.ir", "status": "inactive", "count": 15}
    ]