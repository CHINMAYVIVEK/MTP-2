from fastapi import Request, Response
from fastapi.responses import JSONResponse
from models.error_models import ErorrBaseModel
from services.logger import log

class CustomException(Exception):
    def __init__(self, message: str, type: str|None = None,):
        self.type = type
        self.message = message

def custom_exception_handler(request: Request, exec: CustomException):
    if exec.type == "DB_UNIQUE_VIOLATION":
        return JSONResponse(status_code=400,
                            content=ErorrBaseModel(message=exec.message).model_dump())
    elif exec.type == "ID_INVALID" or exec.type == "INVALID_PASSWORD":
        return JSONResponse(status_code=404,
                            content=ErorrBaseModel(message=exec.message).model_dump())
    elif exec.type == "EMPTY_TABLE":
        return Response(status_code=204)
    else:
        return JSONResponse(status_code=500,
                            content=ErorrBaseModel(message=exec.message).model_dump())

def python_exception_handler(request: Request, exec: Exception):
    log.error(exec, exc_info=True)
    return JSONResponse(status_code=500,
                            content=ErorrBaseModel(message=str(exec)).model_dump())