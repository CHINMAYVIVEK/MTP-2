from fastapi.routing import APIRouter
from services.logger import log
from models.store_users_models import (
    GETResponseModel, RegisterRequestModel, CreateUpdateRegisterModel, 
    user_id_annotation, UpdateStoreUserModel)
from models.error_models import ErorrBaseModel
from services.DB.postgresql import PostgreeDB
from services.utils import convert_to_get_store_user_model, validate_password, encrypt_password

router = APIRouter(prefix="/users")
tags = ["Users"]
responses = {
    404: {"model": ErorrBaseModel},
    500: {"model": ErorrBaseModel},
    400: {"model": ErorrBaseModel},
    204: {"model": ""}
}

@router.post(path="", 
             response_model=CreateUpdateRegisterModel, 
             responses=responses,
             status_code=201,
             tags=tags)
async def register_store_user(req_body: RegisterRequestModel):
    log.info("register_store_user started")
    db = PostgreeDB()
    req_body.password = encrypt_password(req_body.password.encode('utf-8'))
    id = db.insert_store_user(req_body)
    log.info("register_store_user ended")
    return CreateUpdateRegisterModel(id=id, message="Store user added successfully")

@router.put(path="/{user_id}", 
             response_model=CreateUpdateRegisterModel, 
             responses=responses,
             status_code=201,
             tags=tags)
async def update_store_user(user_id: user_id_annotation ,
                      req_body: UpdateStoreUserModel):
    log.info("update_store_user started")
    db = PostgreeDB()
    db.update_store_user(req_body, user_id)
    log.info("update_store_user ended")
    return CreateUpdateRegisterModel(id=user_id, message="Store user updated successfully")

@router.delete(path="/{user_id}", 
             response_model=CreateUpdateRegisterModel, 
             responses=responses,
             status_code=202,
             tags=tags)
async def delete_store_user(user_id: user_id_annotation):
    log.info("delete_store_user started")
    db = PostgreeDB()
    db.delete_store_user(user_id=user_id)
    log.info("delete_store_user ended")
    return CreateUpdateRegisterModel(id=user_id, message="Store user deleted successfully")

@router.get(path="/login", 
             response_model=GETResponseModel, 
             status_code=200,
             responses=responses,
             response_model_exclude_none=True,
             tags=tags)
async def login_store_user(email: str, password: str):
    log.info("login_store_user started")
    db = PostgreeDB()
    data = db.get_user_by_email(email=email)
    validate_password(hashed_pass=data[-1], password=password)
    data = convert_to_get_store_user_model(data)
    log.info("login_store_user ended")
    return data

@router.get("/{product_id}",
            response_model=GETResponseModel,
            status_code=200,
            responses=responses,
            tags=tags)
async def get_user_by_product_id(product_id: str):
    log.info("get_store_by_product_id started")
    db = PostgreeDB()
    data = db.get_user_by_product_id(product_id=product_id)
    data = convert_to_get_store_user_model(data)
    log.info("get_store_by_product_id ended")
    return data