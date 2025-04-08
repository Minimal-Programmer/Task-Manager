from fastapi import APIRouter, HTTPException, Depends
from database import users_collection
from schemas import UserCreate, Token
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/register")
async def register_user(user: UserCreate):
    existing_user = await users_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Assign "superuser" role only if no superuser exists
    is_superuser = await users_collection.find_one({"role": "superuser"}) is None
    role = "superuser" if is_superuser else "user"

    hashed_password = hash_password(user.password)
    user_dict = {"username": user.username, "password": hashed_password, "role": role}
    await users_collection.insert_one(user_dict)
    
    return {"message": f"User registered successfully as {role}"}


@router.post("/login")
async def login_user(user: UserCreate):
    db_user = await users_collection.find_one({"username": user.username})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    role = db_user.get("role", "user")  # Ensure role exists, default to "user"
    access_token = create_access_token(data={"sub": user.username, "role": role})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": role  # Explicitly returning role in response
    }

@router.get("/me")
async def get_user_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.get("/", tags=["Users"])
async def get_all_users():
    users = await users_collection.find({}, {"_id": 0, "username": 1, "role": 1}).to_list(None)
    
    return users  # Returns only username and role
