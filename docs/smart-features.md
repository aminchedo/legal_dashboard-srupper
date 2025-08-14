# Smart Rating, Categorization, and Cursor Pagination

This document mirrors frontend/docs/smart-features.md and is provided at repo root for convenience.

## API Endpoints

- GET /documents/cursor?limit=25&cursor=BASE64&query=&category=&source=&status=&dateFrom=&dateTo=&tags=&sortBy=&sortOrder=
  - Response:
  { "items": [/* Document[] */], "next_cursor": "BASE64", "has_more": true }

- POST /documents/:id/rating { score: number(0..1) }
- GET /documents/:id/categorization/suggestions -> { suggestions: string[] }
- POST /documents/:id/categorization { category: string }
- GET /documents/analytics/smart -> { total: number, avgScore: number, categories: [{ name, count }] }

See frontend/docs/smart-features.md for more details.