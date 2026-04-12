import sys
import os

# Add the parent directory to sys.path so we can import 'model'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router, load_resources

app = FastAPI(title="MUJ Car Rental Recommendation API")

# Enable CORS
origins = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting recommendation service...")
    success = load_resources()
    if success:
        print("Models and data loaded successfully.")
    else:
        print("Failed to load models on startup. Will retry on first request.")

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
