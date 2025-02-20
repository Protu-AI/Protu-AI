from fastapi import FastAPI, APIRouter

base_router = APIRouter(
    prefix="/protu/ai",
)

@base_router.get("/")
async def welcome():
    return {
        "message": "Welcome to the Protu AI!"
    }