from motor.motor_asyncio import AsyncIOMotorClient
import asyncio

MONGO_URL = "mongodb://localhost:27017"  # Replace with your MongoDB URL
DB_NAME = "taskmanager"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
users_collection = db["users"]
tasks_collection = db["tasks"]
