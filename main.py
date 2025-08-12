from fastapi import FastAPI

app = FastAPI(title="Legal Dashboard API")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legal Dashboard API is running"}

# Vercel expects this for serverless functions
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)