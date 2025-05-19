from fastapi import UploadFile
from .BaseController import BaseController
from .Enums import ResponseSignal
import logging

class DataController(BaseController):
    def __init__(self):
        super().__init__()
        self.file_scale = 1048576

    def validate_uploaded_file(self, file: UploadFile):

        if file.content_type != self.FILE_ALLOWED_TYPES:
            logging.fatal(f"File content type {file.content_type} not allowed")
            return False, ResponseSignal.FILE_TYPE_NOT_ALLOWED.value
        
        if file.size > self.FILE_MAX_SIZE * self.file_scale:
            logging.fatal(f"File size {file.size} exceeds the limit {self.FILE_MAX_SIZE * self.file_scale} MB")
            return False, ResponseSignal.FILE_SIZE_EXCEEDS_LIMIT.value
        
        return True, ResponseSignal.FILE_UPLOAD_SUCCESS.value

