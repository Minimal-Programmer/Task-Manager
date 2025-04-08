from fastapi import FastAPI, Request, HTTPException, Security
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader
from routes import users, tasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.models import APIKey
from fastapi.openapi.utils import get_openapi
import logging
from auth import get_current_user


app = FastAPI()
# Allow frontend to communicate with backend
origins = ["http://localhost:5174",
           "http://localhost:5173",
           "http://localhost:5175"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change this if the frontend is deployed in other ports
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/login") 

# Use API Key authentication instead of OAuth2
api_key_header = APIKeyHeader(name="Authorization", auto_error=True)

def get_api_key(api_key: str = Security(api_key_header)):
    if not api_key.startswith("Bearer "):
        raise HTTPException(status_code=403, detail="Invalid token format")
    token = api_key.split("Bearer ")[-1]
    return get_current_user(token)

app.include_router(users.router)
app.include_router(tasks.router) 

# Configure logging
logging.basicConfig(level=logging.INFO)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"➡️ {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"⬅️ Response Status: {response.status_code}")
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.get("/")
async def root():
    return {"message": "Task Management API"}


# Manually configure Swagger authentication
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Task Manager API",
        version="1.0.0",
        description="API for managing tasks with authentication",
        routes=app.routes,
    )

    # Define security scheme for API token authentication
    openapi_schema["components"]["securitySchemes"] = {
        "OAuth2PasswordBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT"
        }
    }

    # Apply authentication globally
    openapi_schema["security"] = [{"OAuth2PasswordBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
