# Smart Rating, Categorization, and Cursor Pagination

## API Endpoints

- GET /documents/cursor?limit=25&cursor=BASE64&query=&category=&source=&status=&dateFrom=&dateTo=&tags=&sortBy=&sortOrder=
  - Response:
  ```json
  { "items": [/* Document[] */], "next_cursor": "BASE64", "has_more": true }
  ```
  - Cursor: base64-encoded unique indexed field(s), recommended composite: `${updatedAt}-${id}`
  - Limit+1: backend should fetch `limit+1` to set `has_more` and compute `next_cursor`

- POST /documents/:id/rating { score: number(0..1) }
- GET /documents/:id/categorization/suggestions -> { suggestions: string[] }
- POST /documents/:id/categorization { category: string }
- GET /documents/analytics/smart -> { total: number, avgScore: number, categories: [{ name, count }] }

## Cursor Logic

- Use a deterministic, indexed cursor (e.g., `updated_at` + `id`).
- Encode cursor string with Base64.
- On fetch: request `limit+1` rows.
  - If `rows.length > limit`: set `has_more=true`, `next_cursor` from last item of `limit`.
  - Else: `has_more=false`, `next_cursor` omitted.
- Support composite cursor by joining values with a delimiter.

## Developer Guide

### Components
- SmartRating.tsx: star-based rating UI; calls POST rating endpoint.
- SmartCategorization.tsx: fetches AI suggestions and applies selected category.
- SmartAnalytics.tsx: shows compact metrics; auto-refreshes.

### Hooks
- useDocumentsCursor: encapsulates cursor pagination; exposes `items`, `hasMore`, `loadNext()`.

### Integration
- `EnhancedDocumentsPage` uses cursor pagination and displays SmartAnalytics.
- `DocumentPreview` embeds SmartRating and SmartCategorization panels.

### RTL & Persian
- All components render in RTL with Persian labels and percentages.

## Error Handling & Retry
- Frontend surfaces minimal messages; backend should return 4xx/5xx with JSON message.
- Retry policy can be configured with React Query if needed; currently off by default for mutations.