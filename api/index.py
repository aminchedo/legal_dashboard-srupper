from fastapi import FastAPI

app = FastAPI(title="Legal Dashboard API")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Legal Dashboard API is running"}