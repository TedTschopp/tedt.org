translated_text = "your translated text here"

text = f"""
Extract all named locations from the following Swiss folktale and list them with their English translations:

"{translated_text}"

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

# Now you can use the `text` variable to send to the OpenAI API