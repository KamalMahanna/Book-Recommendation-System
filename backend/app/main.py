from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import recommendations

app = FastAPI(
    title="Book Recommendation API",
    description="API for getting book recommendations based on different algorithms",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, in production specify actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(recommendations.router, prefix="/api", tags=["recommendations"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to Book Recommendation API",
        "docs": "/docs",
        "redoc": "/redoc"
    }
