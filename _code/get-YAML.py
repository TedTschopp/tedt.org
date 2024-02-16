import os
import yaml
from collections import defaultdict

# Directory containing the blog posts
post_directory = "_posts"

# Set to store unique YAML fields
unique_fields = set()

# Function to traverse nested dictionaries
def traverse_dict(d, parent_key=''):
    for k, v in d.items():
        new_key = f"{parent_key}.{k}" if parent_key else k
        unique_fields.add(new_key)
        if isinstance(v, dict):
            traverse_dict(v, new_key)

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
            
            # Add fields to the set
            if existing_yaml:
                traverse_dict(existing_yaml)

# Print the unique fields with hierarchy
print("Unique YAML Fields:")
for field in sorted(unique_fields):
    indent_level = field.count('.')
    print(f"{'  ' * indent_level}- {field.split('.')[-1]} ({field})")
