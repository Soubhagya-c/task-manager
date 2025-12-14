from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api.routes import auth, users, tasks
from app.database.session import engine
from app.database import models
from app.utils.response import error_response
from fastapi.exceptions import RequestValidationError
from app.core.exceptions import validation_exception_handler

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Scalable Web App Backend")

app.add_exception_handler(
    RequestValidationError,
    validation_exception_handler
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(tasks.router, prefix="/tasks", tags=["Tasks"])


@app.get("/")
def root():
    return {
        "success": True,
        "message": "Backend running successfully"
    }

# Handle validation errors (422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(request)
    return JSONResponse(
        status_code=422,
        content=error_response("Validation error", 422)
    )

# Let HTTPException pass through correctly
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(exc.detail, exc.status_code)
    )

# Catch ONLY unexpected server errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content=error_response("Internal server error", 500)
    )
