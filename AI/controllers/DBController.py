import psycopg2
from .BaseController import BaseController
import os
from .utils import get_template_by_name


class DBController(BaseController):

    def __init__(self, db_name, db_user, db_password, db_host, db_port):
        super().__init__()
        self.db_name = db_name
        self.db_user = db_user
        self.db_password = db_password
        self.db_host = db_host
        self.db_port = db_port
        self.db_connection = self.db_connect()
        self.db_cursor = self.db_connection.cursor()
        self.queries_dir = os.path.join(
            self.base_dir,
            "controllers/utils/queries.json"
        )


    def db_connect(self):
        try:
            return psycopg2.connect(
                dbname=self.db_name,
                user=self.db_user,
                password=self.db_password,
                host=self.db_host,
                port=self.db_port
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

        if message_id is not None:

            file_path, file_type = self.get_attached_file_by_message_id(
                message_id=message_id)[0]

            return file_path

    def get_all_courses(self):

        get_courses_query = get_template_by_name(
            self.queries_dir, "get_courses")

        if get_courses_query is not None:
            return self.execute_query(get_courses_query, ())
        else:
            print("get_courses query is None")

    def db_disconnect(self):
        self.db_cursor.close()
        self.db_connection.close()
