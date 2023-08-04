import requests
from bs4 import BeautifulSoup
from feedgen.feed import FeedGenerator
import os

def generate_rss(url, output_path):
    username = os.getenv('WEBSITE_USERNAME')
    password = os.getenv('WEBSITE_PASSWORD')

    response = requests.get(url, auth=(username, password))
    soup = BeautifulSoup(response.text, 'html.parser')

    fg = FeedGenerator()
    fg.title('My RSS Feed')
    fg.link(href=url, rel='alternate')
    fg.description('This is a test feed')

    for li in soup.find_all('li'):
        fe = fg.add_entry()
        fe.title(li.text)
        fe.link(href=url)
        fe.description(li.text)

    fg.rss_file(output_path)

if __name__ == "__main__":
    generate_rss('https://www.midjourney.com/app/users/074b5e95-1e8a-465f-9a7f-921e11670eb5/', 'rss.xml')
