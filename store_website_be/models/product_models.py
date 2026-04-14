from pydantic import BaseModel, Field
from typing import Annotated, Optional, TypedDict
from fastapi import Path

product_id_annotation = Annotated[str, Path(description="Store product id")]

class BaseProductImageModel(TypedDict):
    url: Annotated[str, Field(description="Product image url")]
    alt_text: Annotated[str, Field(description="Product alt text")]
    primary: Annotated[Optional[bool], Field(default=False, description="is product image primary")]

class BaseProductAttributeModel(TypedDict):
    attrName: Annotated[str, Field(description="Product attribute name")]
    attrValue: Annotated[str, Field(description="Product attribute value")]

class POSTRequestModel(BaseModel):
    name: Annotated[str, 
                    Field(description="Product name")]
    description: Annotated[Optional[str], 
                           Field(default="", description="Product descripiton")]
    shortDescription: Annotated[Optional[str], 
                                Field(default="", description="Product short description")]
    price: Annotated[float, 
                    Field(description="Product price", gt=0)]
    discountPrice: Annotated[Optional[float], 
                            Field(default=0, description="Product discounted price")]
    currency: Annotated[str, 
                        Field(default="INR", description="Product price currency")]
    quantity: Annotated[int, 
                        Field(description="Product quantity", gt=0)]
    weight: Annotated[Optional[str], 
                      Field(default="", description="Product weight (in gm)")]
    storeUserId: Annotated[str,
                            Field(description="Store who is selling this product")]
    category: Annotated[Optional[str], 
                          Field(default="", description="Product category name")]
    attributes: Annotated[
        Optional[list[BaseProductAttributeModel]], 
        Field(default=[], 
              description="Product attributes",
              examples=[[{"attrName": "Battery", "attrValue": "100%"}, {"attrName": "os", "attrValue": "android"}]])]
    images: Annotated[
        Optional[list[BaseProductImageModel]],
        Field(
            default=[], 
            description="Product Images",
            examples=[
                [{'url': 'https://example.com/almonds1.jpg', 'alt_text': 'Almonds', 'primary': True}, 
                 {'url': 'https://example.com/almonds2.jpg', 'alt_text': 'Pack Image'}]]
            )]


class UpdateProductModel(BaseModel):
    name: Annotated[Optional[str], 
                    Field(default=None, description="Product name")]
    description: Annotated[Optional[str], 
                           Field(default=None, description="Product descripiton")]
    shortDescription: Annotated[Optional[str], 
                                 Field(default=None, description="Product short description")]
    price: Annotated[Optional[float], 
                     Field(default=None, description="Product price")]
    discountPrice: Annotated[Optional[float], 
                              Field(default=None, description="Product discounted price")]
    currency: Annotated[Optional[str], 
                        Field(default="INR", description="Product price currency")]
    weight: Annotated[Optional[str], 
                      Field(default=None, description="Product weight (in gm)")]
    category: Annotated[Optional[str], 
                          Field(default=None, description="Product category name")]
    quantity: Annotated[Optional[int], Field(default=None, description="Product quantity")]
    attributes: Annotated[
        Optional[list[BaseProductAttributeModel]], 
        Field(default=None, 
              description="Product attributes",
              examples=[[{"attrName": "Battery", "attrValue": "100%"}, {"attrName": "os", "attrValue": "android"}]])]
    images: Annotated[
        Optional[list[BaseProductImageModel]],
        Field(
            default=None, 
            description="Product Images",
            examples=[
                [{'url': 'https://example.com/almonds1.jpg', 'alt_text': 'Almonds', 'primary': True}, 
                 {'url': 'https://example.com/almonds2.jpg', 'alt_text': 'Pack Image'}]]
            )]


class UpdateQuantityModel(BaseModel):
    product_id: Annotated[str, Field(description="Product id")]
    quantity: Annotated[int, Field(description="Product quantity")]

class UpdateQuantityResponseModel(BaseModel):
    message: Annotated[str, Field(description="Success Message")]

class CreateUpdateDeleteProductModel(UpdateQuantityResponseModel):
    id: Annotated[str, Field(description="DB provided auto-generated id")]

class GETResponseModel(POSTRequestModel):
    id: Annotated[str, Field(description="Auto-generated product id")]
    price: Annotated[float, Field(description="Product price", gt=0)]
    quantity: Annotated[int, Field(description="Product quantity", ge=0)]
