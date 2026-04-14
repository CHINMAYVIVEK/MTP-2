from fastapi import FastAPI
from routers.store_users_routers import router as store_users_routers
from routers.product_routers import router as product_routers
from contextlib import asynccontextmanager
from services.DB.postgresql import PostgreeDB
from Exceptions.python_exceptions import CustomException, custom_exception_handler, python_exception_handler
from Exceptions.starlette_exceptions import StarletteHTTPException, starlette_exception_handler
from fastapi.middleware.cors import CORSMiddleware
from decouple import config, Csv

@asynccontextmanager
async def lifespan_event(app):
    db = PostgreeDB()
    yield
    db.close()

app = FastAPI(title="Store API", 
              description="Perform store related CRUD operations",
              version="1.0.0",
              lifespan=lifespan_event)

prefix = "/stores"

origins = config('CORS_ORIGIN', default=None, cast=Csv())
if not origins:
    origins = config('cors-origin', default='', cast=Csv())

app.include_router(router=store_users_routers, prefix=prefix)
app.include_router(router=product_routers, prefix=prefix)
app.add_exception_handler(CustomException, custom_exception_handler)
app.add_exception_handler(Exception, python_exception_handler)
app.add_exception_handler(StarletteHTTPException, starlette_exception_handler)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get(path="/ping", tags=["Ping"])
async def ping():
    return "Success"