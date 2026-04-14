from fastapi import Request
from starlette.exceptions import HTTPException as StarletteHTTPException
from fastapi.responses import JSONResponse
from models.error_models import ErorrBaseModel
from services.logger import log

def starlette_exception_handler(request: Request, exec: StarletteHTTPException):
    log.error(exec, exc_info=True)
    return JSONResponse(status_code=500,
                            content=ErorrBaseModel(message=exec.detail).model_dump())
