from .BaseController import BaseController
import os
from langchain_community.document_loaders import TextLoader, PyMuPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
# I used this one because its smart in splitting its split in appropriate positions like wait to close the brackets and so on ...

from .Enums import ProcessEnum


class ProcessController(BaseController):

    '''
    This is the ProcessController class that will be used to handle all process related operations
    It inherits from the BaseController class
    It has the following methods:

    get_file_extension: This method gets the file extension of the file

    get_file_loader: This method gets the file loader based on the file extension

    get_file_content: This method gets the content of the file

    get_file_chunks: This method gets the chunks of the file content

    get_file_name_from_metadata: This method gets the file name from the metadata

    '''

    def __init__(self):
        super().__init__()

    def get_file_extension(self, file_path: str):
        return os.path.splitext(file_path)[-1]

    def get_file_name_from_metadata(self, metadata: dict):
        '''
        This function extracts the file name from the metadata and from the source key
        ex: source: 'home/user/Xvxj2DnWk6fbfKV_file.txt' => file.txt
        '''
        return os.path.basename(metadata['source']).split('_', 1)[-1]

    def get_file_loader(self, file_path: str):

        if not os.path.exists(file_path):
            return None

        file_extension = self.get_file_extension(file_path=file_path)

        if file_extension == ProcessEnum.TXT.value:
            return TextLoader(
                file_path=file_path,
                encoding='UTF-8'
            )
        elif file_extension == ProcessEnum.PDF.value:
            return PyMuPDFLoader(
                file_path=file_path
            )

        return None

    def get_file_content(self, file_path: str):

        loader = self.get_file_loader(file_path=file_path)

        if loader:
            return loader.load()

        return None

    def get_file_chunks(self, file_content: list,
                        chunk_size: int = 100, overlap_len: int = 10):

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=overlap_len,
            length_function=len,
        )

        file_content_texts = [
            rec.page_content
            for rec in file_content
        ]

        file_content_metadata = [
            rec.metadata
            for rec in file_content
        ]

        chunks = text_splitter.create_documents(
            texts=file_content_texts,
            metadatas=file_content_metadata,
        )

        return chunks
