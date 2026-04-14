from fastapi import APIRouter
from services.logger import log
from models.product_models import (
    POSTRequestModel, CreateUpdateDeleteProductModel, GETResponseModel,
    product_id_annotation, UpdateQuantityModel, UpdateProductModel, UpdateQuantityResponseModel)
from services.DB.postgresql import PostgreeDB
from typing import Optional
from models.error_models import ErorrBaseModel
from services.utils import convert_to_get_product_response_model, convert_to_get_products_response_model

router = APIRouter(prefix="/products")
tags = ["Products"]
responses = {
    404: {"model": ErorrBaseModel},
    500: {"model": ErorrBaseModel},
    400: {"model": ErorrBaseModel},
    204: {"model": ""}
}

@router.get(path="",
            status_code=200,
            response_model=list[GETResponseModel],
            summary="Get all product if store id not provided",
            responses=responses,
            tags=tags)
async def get_product_query_params(store_id: Optional[str] = None):
    log.info("get_product started")
    db = PostgreeDB()
    if store_id is not None:
        data = db.get_products_by_store_id(store_id)
    else:
        data = db.get_products()
    data = convert_to_get_products_response_model(data)
    log.info("get_product ended")
    return data

@router.get(path="/{product_id}",
            status_code=200,
            response_model=GETResponseModel,
            summary="Get product by product id",
            responses=responses,
            tags=tags)
async def get_product(product_id: str):
    log.info("get_product started")
    db = PostgreeDB()
    data = db.get_product_by_product_id(product_id)
    print(data)
    data = convert_to_get_product_response_model(data)
    log.info("get_product ended")
    return data


@router.post(path="",
            response_model=CreateUpdateDeleteProductModel,
            status_code=201,
            summary="Create Product",
            responses=responses,
            tags=tags)
def create_product(req_body: POSTRequestModel):
    log.info("create_product started")
    db = PostgreeDB()
    id = db.insert_product(req_body)
    log.info("create_product ended")
    return CreateUpdateDeleteProductModel(id=id, message="Product added successfully.")

@router.put(path="/quantities",
            response_model=UpdateQuantityResponseModel,
            status_code=201,
            summary="Update product quantities",
            responses=responses,
            tags=tags)
def update_product_quantity(req_body: list[UpdateQuantityModel]):
    log.info("update_product_quantity started")
    db = PostgreeDB()
    db.update_product_quantity(req_body)
    log.info("update_product_quantity ended")
    return UpdateQuantityResponseModel(message="Quantities updated successfully.")

@router.put(path="/{product_id}",
            response_model=CreateUpdateDeleteProductModel,
            summary="Update product by product id",
            status_code=201,
            responses=responses,
            tags=tags)
def update_product(product_id: product_id_annotation, req_body: UpdateProductModel):
    log.info("create_product started")
    db = PostgreeDB()
    db.update_product(product_id, req_body)
    log.info("create_product ended")
    return CreateUpdateDeleteProductModel(id=product_id, message="Product added successfully.")

  
@router.delete(path="/{product_id}",
            response_model=CreateUpdateDeleteProductModel,
            status_code=202,
            summary="Delete product",
            responses=responses,
            tags=tags)
def delete_product(product_id: product_id_annotation):
    log.info("delete_product started")
    db = PostgreeDB()
    db.delete_product(product_id)
    log.info("delete_product ended")
    return CreateUpdateDeleteProductModel(id=product_id, message="Product removed successfully.")

