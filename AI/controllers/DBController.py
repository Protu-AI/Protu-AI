import psycopg2
from .BaseController import BaseController
import os
from .utils import get_template_by_name


class DBController(BaseController):

    def __init__(self):
        super().__init__()
        self.db_connection = self.db_connect()
        self.db_cursor = self.db_connection.cursor()
        self.queries_dir = os.path.join(
            self.base_dir,
            "controllers/utils/queries.json"
        )

    def db_connect(self):
        try:
            return psycopg2.connect(
                dbname=self.app_settings.DB_NAME,
                user=self.app_settings.DB_USER,
                password=self.app_settings.DB_PASSWORD,
                host=self.app_settings.DB_HOST,
                port=self.app_settings.DB_PORT
            )
        except Exception as e:
            print(e)
            return None

    def execute_query(self, query, params):
        try:
            self.db_cursor.execute(query, params)
            return self.db_cursor.fetchall()
        except Exception as e:
            print(e)
            return None

    def get_last_message_by_chat_id(self, chat_id):
        query = get_template_by_name(self.queries_dir, "get_last_message_id")

        if query is not None:
            return self.execute_query(query, (chat_id,))

    def get_all_messages_by_chat_id(self, chat_id):
        query = get_template_by_name(
            self.queries_dir, "get_all_messages")

        if query is not None:
            return self.execute_query(query, (chat_id,))
        else:
            print("Query is None")

    def get_attached_file_by_message_id(self, message_id):
        query = get_template_by_name(self.queries_dir, "get_attached_file")

        if query is not None:
            return self.execute_query(query, (message_id,))

    def get_file_path(self, chat_id):
        message_id, content = self.get_last_message_by_chat_id(chat_id=chat_id)[
            0]

        print(message_id)

        if message_id is not None:

            file_path, file_type = self.get_attached_file_by_message_id(
                message_id=message_id)[0]

            return file_path

    def db_disconnect(self):
        self.db_cursor.close()
        self.db_connection.close()
