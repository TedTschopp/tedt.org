import os
import yaml

# Set the directory to search for Markdown files
post_directory = "_posts"

# Define the list of standard YAML fields
standard_fields = ["layout", "title", "title-url", "subtitle", "subtitle-url", "quote", "excerpt", "source", "source-url", "call-to-action", "date", "update", "author", "bullets", "description", "seo-description", "categories", "tags", "keywords", "draft-status", "location", "coordinates", "image", "image-alt", "image-author", "image-author-URL", "image-credits", "image-credits-URL", "image-credits-artist", "image-credits-artist-URL", "image-credits-title", "image-description", "image-title", "monster-or-magical-or-religious-ideas", "year-the-event-took-place", "permalink", "mathjax", "order"]

# Define the subfields for the author field
author_subfields = ["avatar", "name", "url"]

# Define the subfields for the location field
location_subfields = ["name", "address", "city", "state", "zip", "country", "on-map", "place-names"]

# Define the subfields for the coordinates field
coordinates_subfields = ["latitude", "longitude"]

# Loop through each Markdown file in the directory and its subdirectories
for dirpath, dirnames, filenames in os.walk(post_directory):
    for filename in filenames:
        if filename.endswith(".md"):
            filepath = os.path.join(dirpath, filename)

            # Check if the filepath includes "Gamma World"
            if "Gamma World" in filepath:
                continue

            # Read the file
            with open(filepath, 'r') as f:
                lines = f.readlines()

            print(f"reading: {filepath}")

            # Extract the YAML front matter
            yaml_lines = []
            inside_yaml = False
            for line in lines:
                if line.strip() == "---":
                    inside_yaml = not inside_yaml
                    if not inside_yaml:
                        break
                if inside_yaml:
                    yaml_lines.append(line)

            # Parse the YAML
            existing_yaml = yaml.safe_load("".join(yaml_lines[1:]))

            # Add subfields to the author field
            if "author" in existing_yaml:
                author_data = existing_yaml["author"]
                if isinstance(author_data, str):
                    existing_yaml["author"] = {"name": author_data}
                elif isinstance(author_data, dict):
                    for subfield in author_subfields:
                        if subfield not in author_data:
                            author_data[subfield] = ""
                    existing_yaml["author"] = author_data

            # Add subfields to the location field
            if "location" in existing_yaml:
                location_data = existing_yaml["location"]
                if isinstance(location_data, str):
                    existing_yaml["location"] = {"name": location_data}
                elif isinstance(location_data, dict):
                    for subfield in location_subfields:
                        if subfield not in location_data:
                            location_data[subfield] = ""
                    existing_yaml["location"] = location_data

            # Add subfields to the coordinates field
            if "coordinates" in existing_yaml:
                coordinates_data = existing_yaml["coordinates"]
                if isinstance(coordinates_data, str):
                    existing_yaml["coordinates"] = {"latitude": coordinates_data, "longitude": ""}
                elif isinstance(coordinates_data, dict):
                    for subfield in coordinates_subfields:
                        if subfield not in coordinates_data:
                            coordinates_data[subfield] = ""
                    existing_yaml["coordinates"] = coordinates_data

            # Standardize the order of the fields
            standardized_yaml = {}
            for field in standard_fields:
                if field in existing_yaml:
                    standardized_yaml[field] = existing_yaml[field]
                elif field == "":
                    standardized_yaml[field] = "\n"

            # Extract the content of the file
            content_lines = lines[len(yaml_lines) + 1:]

            # Write the updated YAML front matter and content back to the file
            with open(filepath, 'w') as f:
                f.write("---\n")
                f.write(yaml.dump(standardized_yaml, allow_unicode=True, default_flow_style=False, sort_keys=False, indent=4))
                f.write("---\n")
                f.write("".join(content_lines))