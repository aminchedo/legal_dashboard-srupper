from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Legal Dashboard API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legal Dashboard API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Legal Dashboard API"}

# Export the app for Vercel serverless functions
handler = app