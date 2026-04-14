from pydantic import BaseModel, Field

class ErorrBaseModel(BaseModel):
    message: str = Field(description="error message")

class BadRequestModel(ErorrBaseModel):
    pass
