from pydantic import BaseModel, Field, field_validator
from typing import Annotated, Optional
from typing_extensions import TypedDict
from fastapi import Path, Query

class AddressModel(TypedDict):
    addressLine: str
    city: str
    state: str
    postalCode: str

class BaseStoreUserModel(BaseModel):
    first_name: Annotated[str, 
                          Field(description="Store User First Name")]
    last_name: Annotated[str, 
                         Field(description="Store User Last Name")]
    store_name: Annotated[str, 
                         Field(description="Store Name")]
    email: Annotated[str, 
                     Field(description="Store User Email")]
    phone: Annotated[Optional[str], 
                     Field(default=None, 
                           description="Store User Phone Number",
                           examples=["1234567890"])]
    img_url: Annotated[Optional[str], Field(default=None, description="Store User Avatar Url")]
    addresses: Annotated[Optional[list[AddressModel]], Field(default=None,description="Store addressses")]

    @field_validator('phone', mode='after')
    @classmethod
    def check_phone_number(cls, value: str) -> str:
        if (value is not None) and (not value.isdigit()) and len(value) == 10:
            raise ValueError('Phone should contain only number and should be of 10 dgits')
        return value

class RegisterRequestModel(BaseStoreUserModel):
    password: Annotated[str, Field(description="Store user password")]
    
    @field_validator('first_name', 'last_name', 'email', mode='after')
    @classmethod
    def check_null_or_empty_value(cls, value: str) -> str:
        if (value == None or len(value) == 0):
            raise ValueError('Field cannot be empty')
        return value

class UpdateStoreUserModel(BaseStoreUserModel):
    first_name: Annotated[Optional[str], Field(default="", description="Store User First Name")]
    last_name: Annotated[Optional[str], Field(default="", description="Store User Last Name")]
    email: Annotated[Optional[str], Field(default="", description="Store User Email")]
    store_name: Annotated[Optional[str], Field(default="", description="Store Name")]
    password: Annotated[Optional[str], Field(default="", description="Store user password")]

class CreateUpdateRegisterModel(BaseModel):
    id: str = Field(description="DB provided auto-generated id")
    message: str = Field(description="Success Message")

class GETResponseModel(BaseStoreUserModel):
    id:  Annotated[str, Field(description="DB provided aut-generated id")]

user_id_annotation = Annotated[str, Path(description="Store user id")]
email_annotation = Annotated[str, Query(description="Store User Email")]
store_name_annotation = Annotated[str, Query(description="Store Name")]