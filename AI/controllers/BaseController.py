from helpers.config import get_settings, Settings
import os
import string
import random


class BaseController:
    def __init__(self):
        self.app_settings = get_settings()
        self.base_dir = os.path.dirname(os.path.dirname(__file__))
        self.database_dir = os.path.join(
            self.base_dir,
            'assets/database'
        )

    def generate_random_string(self, length=12):
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

    def get_db_path(self, db_name: str):
        '''
        This method returns the path to the database directory and creates the directory if it does not exist
        '''
        db_path = os.path.join(
            self.database_dir,
            db_name
        )

        if not os.path.exists(path=db_path):
            os.makedirs(db_path)

        return db_path
