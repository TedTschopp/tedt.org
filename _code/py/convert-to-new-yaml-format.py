import os
import yaml
from ruamel.yaml import YAML

# Initialize YAML parser
ryaml = YAML()
ryaml.indent(mapping=2, sequence=4, offset=2)

# Directory containing the blog posts
post_directory = "_posts"

# Loop through each Markdown file in the directory
for filename in os.listdir(post_directory):
    if filename.endswith(".md"):
        filepath = os.path.join(post_directory, filename)
        
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
        
        # Update the YAML with the new format
        new_yaml = {
            'title': existing_yaml.get('title', 'Your Blog Post Title Here'),
            'description': existing_yaml.get('description', 'A brief summary of your blog post.'),
            'permalink': existing_yaml.get('permalink', '/your-seo-friendly-url/'),
            'date': existing_yaml.get('date', ''),
            'last_modified_at': existing_yaml.get('last_modified_at', ''),
            'categories': existing_yaml.get('categories', []),
            'tags': existing_yaml.get('tags', []),
            'author': {
                'name': existing_yaml.get('author', {}).get('name', 'Author Name'),
                'email': existing_yaml.get('author', {}).get('email', 'author@email.com')
            },
            'og_title': existing_yaml.get('og_title', ''),
            'og_description': existing_yaml.get('og_description', ''),
            'og_image': existing_yaml.get('og_image', ''),
            'twitter_card': existing_yaml.get('twitter_card', ''),
            'twitter_site': existing_yaml.get('twitter_site', ''),
            'twitter_creator': existing_yaml.get('twitter_creator', ''),
            'schema': {
                'type': 'Article',
                'author': existing_yaml.get('schema', {}).get('author', ''),
                'datePublished': existing_yaml.get('schema', {}).get('datePublished', ''),
                'dateModified': existing_yaml.get('schema', {}).get('dateModified', ''),
                'image': existing_yaml.get('schema', {}).get('image', '')
            },
            'layout': existing_yaml.get('layout', 'post'),
            'comments': existing_yaml.get('comments', True),
            'header': existing_yaml.get('header', {})
        }
        
        # Write the updated YAML back to the file
        with open(filepath, 'w') as f:
            ryaml.dump(new_yaml, f)
            f.write("---\n")
            f.write("".join(lines[len(yaml_lines):]))

print("YAML front matter updated for all posts.")
