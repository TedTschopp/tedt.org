import json
import openai
import time
import os

# Set up the OpenAI API key
openai.api_key = "YOUR_OPENAI_API_KEY"

# Function to call OpenAI's GPT-4o API for translation
def translate_text(text):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Translate the following Swiss folktale into English:\n\n{text}",
            max_tokens=2048,
            temperature=0.7
        )
        return response.choices[0].text.strip()
    except openai.error.RateLimitError:
        print("Rate limit exceeded. Waiting for 60 seconds...")
        time.sleep(60)
        return translate_text(text)  # Retry after waiting
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

# Function to extract named locations using OpenAI
def extract_locations(text):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Extract all named locations from the following Swiss folktale and list them with their English translations:\n\n{text}\n\nFormat the response as a JSON array with each entry having 'Name', 'EnglishTranslation', 'Latitude', and 'Longitude'. If the latitude and longitude are not known, leave them empty.",
            max_tokens=2048,
            temperature=0.7
        )
        return json.loads(response.choices[0].text.strip())
    except openai.error.RateLimitError:
        print("Rate limit exceeded. Waiting for 60 seconds...")
        time.sleep(60)
        return extract_locations(text)  # Retry after waiting
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
    print(f"Translating entry {index + 1} of {len(data)}")
    
    translated_title = translate_text(entry["Title"])
    translated_text = translate_text(entry["Text"])
    locations = extract_locations(entry["Text"])
    
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
            "Specific Locations in the Story": locations
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
