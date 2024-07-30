# translate-swiss-folktales.py

# Import the necessary library
from openai import OpenAI

# Prompt the user for their API key
api_key = input("Please enter your OpenAI API key: ")

# Initialize the OpenAI client with the provided API key
client = OpenAI(api_key=api_key)

import json
import time
import os

json_template_for_location = '''
"Specific Locations in the Story": [
  { 
    "Name": "",
    "EnglishTranslation": "",
    "Latitude": "",
    "Longitude": ""
  }
]
'''


# Function to call OpenAI's GPT-4o API for translation of the text
def translate_text(text):
    try:
        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are helpful assistant, an expert language translator, an expert in Markdown, and someone who is familiar with Swiss Folktales."},
            {"role": "user", "content": f"Translate the following into English. Use words that have a German or Norse etymology as much as possible. Use calque if there is no good word to use in modern English, and explain your decision to use a calque in a footnote using markdown.  If there is anything in the story that needs explaining from a modern American's perspective, explain it with a footnote that links from the translated text to the footnote itself using Markdown.  Output everything as markdown.  Include a list of Specific Locations from the above story that are mentioned.  That list should include the original name of the location, the modern name of that  location, the calque/literal translation of the name in English, the Latitude of the location, the Longitude of that location. Output this table as a markdown table with the mentioned columns. Next, create a table of mundane people or characters mentioned in the story.  Output their name, a description, and the location they are associated with in the story as a markdown table.  Next, create a table of important objects mentioned in the story.  Output their name, a description, and the location they are associated with in the story as a markdown table.  Next, create a table of important non-human, post human, or divine characters, monsters, creatures, forces, or any other characters mentioned in the story that are supernatural in nature.  Output their name, a description, and the location they are associated with in the story.  Do not mention anything about being read by the Mutabor Fairy Tale Foundation.  Make the markdown title be a title of the story that you would want the folktale to have. There will be a line in the text starting with Quelle:, Output that as the subtitle in full starting with the word Source:  \n\n{text}"},       ])
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        return None

# Function to call OpenAI's GPT-4o API for translation of the title
def translate_title(text):
    try:
        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Translate the following into English. Use words that have a German or Norse etymology as much as possible. Transliterate if there is no good word to use in modern English.  Output the text in Title Case.\n\n{text}"},
        ])
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error: {e}")
        return None



# Function to extract named locations using OpenAI
def extract_locations(text):
    try:

        Prompt = f"""
        Extract all named locations from the following Swiss folktale and list them with their English translations:

        "{text}"

        Format the response as a JSON array as follows:

        "Specific Locations in the Story": [
            { 
                "Name": "",
                "EnglishTranslation": "",
                "Latitude": "",
                "Longitude": ""
            }
        ]
        If the latitude and longitude are not known, leave them empty.
        """

        response = client.chat.completions.create(model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"{Prompt}"},
        ])
        content = response.choices[0].message.content
        if content:
            return json.loads(content)
        else:
            print("No content received from OpenAI API.")
            return []
    except Exception as e:
        print(f"An error occurred while extracting locations: {e}")
        return []

# Function to save progress
def save_progress(translated_data, error_entries, translated_filename='progress.json', error_filename='errors.json'):
    with open(translated_filename, 'w', encoding='utf-8') as file:
        json.dump(translated_data, file, ensure_ascii=False, indent=4)
    with open(error_filename, 'w', encoding='utf-8') as file:
        json.dump(error_entries, file, ensure_ascii=False, indent=4)

# Function to load progress
def load_progress(filename='progress.json'):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

# Function to load error entries
def load_errors(filename='errors.json'):
    if os.path.exists(filename):
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    return []

# Read the original JSON file
with open('swiss_folktales.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Load progress and error entries
translated_data = load_progress()
error_entries = load_errors()

# Ask the user how many entries to process
total_entries = len(data) - len(translated_data)
print(f"There are {total_entries} entries remaining to process.")
num_entries_to_process = int(input("Enter the number of entries to process in this run (0 for all): "))

if num_entries_to_process == 0 or num_entries_to_process > total_entries:
    num_entries_to_process = total_entries

# Start translating from the last saved point
for index, entry in enumerate(data[len(translated_data):len(translated_data) + num_entries_to_process], start=len(translated_data)):
    print(f"==============================")
    print(f"Translating entry {index + 1} of {len(data)}")

    translated_title = translate_title(entry["Title"])
    print(f"Translated Title: {translated_title}")

    translated_text = translate_text(entry["Text"])
    print(f"Translated Text: {translated_text}")

    # locations = extract_locations(translated_text)
    # print(f"locations: {locations}")

    if translated_title and translated_text:
        translated_entry = {
            "AuthorCategoryLocation": entry["AuthorCategoryLocation"],
            "SourceURL": entry["SourceURL"],
            "Title": {
                "Original": entry["Title"],
                "Translated": translated_title
            },
            "Text": {
                "Original": entry["Text"],
                "Translated": translated_text
            },
            "Author": entry["Author"],
            "Category": entry["Category"],
            # "Specific Locations in the Story": locations
        }
        translated_data.append(translated_entry)
    else:
        print("Error encountered for entry. Logging error.")
        error_entries.append(entry)

    # Save progress and error entries after each iteration
    save_progress(translated_data, error_entries)

    # Throttle requests to avoid hitting the rate limit
    time.sleep(1)

# Write the final translated JSON to a new file
with open('translated_swiss_folktales.json', 'w', encoding='utf-8') as file:
    json.dump(translated_data, file, ensure_ascii=False, indent=4)

# Clean up the progress file after successful completion
if os.path.exists('progress.json'):
    os.remove('progress.json')

if os.path.exists('errors.json'):
    if not error_entries:
        os.remove('errors.json')
    else:
        print(f"Errors encountered and logged in errors.json")
