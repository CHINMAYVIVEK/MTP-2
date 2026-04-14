from models.store_users_models import GETResponseModel, UpdateStoreUserModel
from services.logger import log
import bcrypt
import json
from models.product_models import GETResponseModel as GETProductResponseModel
from models.product_models import UpdateQuantityModel, UpdateProductModel
from Exceptions.python_exceptions import CustomException

def encrypt_password(password: str) -> str:
    log.info("encrypt_password started")
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password, salt)
    hashed = hashed.decode('utf-8')
    log.info("encrypt_password ended")
    return hashed

def validate_password(hashed_pass: str, password: str) -> bool:
    log.info("validate_password called")
    if not bcrypt.checkpw(password.encode('utf-8'), hashed_pass.encode('utf-8')):
        raise CustomException(type="INVALID_PASSWORD", message="Email/Password is invalid")
    return True

def convert_to_get_store_user_model(data: tuple) -> GETResponseModel:
    log.info("convert_to_get_id_store_user_model started")
    result = {}
    for index in range(len(data)):
        if index == 0:
            result["id"] = data[0]
        elif index == 1:
            result["first_name"] = data[1]
        elif index == 2:
            result["last_name"] = data[2]
        elif index == 3:
            result["email"] = data[3]
        elif index == 4:
            result["phone"] = data[4]
        elif index == 5:
            result["img_url"] = data[5]
        elif index == 6:
            result["store_name"] = data[6]
        elif index == 7:
            result["addresses"] = data[7]
    result = GETResponseModel.model_validate(result)
    log.info("convert_to_get_id_store_user_model ended")
    return result

def create_update_query_store_users_data(data: UpdateStoreUserModel) -> str:
    log.info("create_update_query_store_users_data started")
    data = data.model_dump(exclude_unset=True)
    result = []
    for key in data:
        if key == "password":
            data[key] = encrypt_password(data[key].encode('utf-8'))   
        if key == "addresses":
            data[key] = json.dumps(data[key])
        result.append("{}='{}'".format(key, data[key]))
    log.info("create_update_query_store_users_data ended")
    return ", ".join(result)

def convert_to_get_product_response_model(data: tuple) -> GETProductResponseModel:
    log.info("convert_to_get_product_response_model started")
    result = {}
    for index in range(len(data)):
        if index == 0:
            result["id"] = data[0]
        elif index == 1:
            result["name"] = data[1]
        elif index == 2:
            result["description"] = data[2]
        elif index == 3:
            result["shortDescription"] = data[3]
        elif index == 4:
            result["price"] = data[4]
        elif index == 5:
            result["discountPrice"] = data[5]
        elif index == 6:
            result["currency"] = data[6]
        elif index == 7:
            result["quantity"] = data[7]
        elif index == 8:
            result["weight"] = data[8]
        elif index == 9:
            result["storeUserId"] = data[9]
        elif index == 10:
            result["attributes"] = data[10]
        elif index == 11:
            result["images"] = data[11]
        elif index == 12:
            result["category"] = data[12]
    result = GETProductResponseModel.model_validate(result)
    log.info("convert_to_get_product_response_model ended")
    return result

def convert_to_get_products_response_model(data: list[tuple]) -> list[GETProductResponseModel]:
    log.info("convert_to_get_products_response_model started")
    result = []
    for row in data:
        result.append(convert_to_get_product_response_model(row))
    log.info("convert_to_get_products_response_model ended")
    return result

def create_update_query_product_quantity_data(data: list[UpdateQuantityModel]) -> list[tuple]:
    result = [(item.quantity, item.product_id) for item in data]
    return result

def create_update_query_product_data(data: list[UpdateProductModel]) -> str:
    log.info("create_update_query_product_data started")
    data = data.model_dump(exclude_unset=True)
    result = []
    for key in data:   
        db_key = key
        if key == "attributes":
            data[key] = json.dumps(data[key])
        elif key == "discountPrice":
            db_key = "discount_price"
        elif key == "shortDescription":
            db_key = "short_description" 
        elif key == "images":
            db_key = "img_urls"
            data[key] = json.dumps(data[key])  
        result.append("{}='{}'".format(db_key, data[key]))
    log.info("create_update_query_product_data ended")
    return ", ".join(result)
