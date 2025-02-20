
import json
import os


def load_json_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: The file {filepath} was not found.")
        return None


def get_template_by_name(file_path, template_name):
    data = load_json_file(file_path)

    if template_name in data:
        return data[template_name]
    return None  # Return None if template is not found


