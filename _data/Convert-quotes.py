# Convert json to yaml
import sys
import json
from ruamel.yaml import YAML

from datetime import datetime  
from datetime import date

date_time = datetime.fromtimestamp(datetime.now().timestamp()) # Fix and Merge with next line.

todays_date = date.today()

in_file_path='/Users/tedtschopp/Developer/tschopp.net/_data/Quotebook.json' # Change me to pull directly in from Google Sheets at somepoint!

def left(s, amount):
    return s[:amount]

def right(s, amount):
    return s[-amount:]

def mid(s, offset, amount):
    return s[offset:offset+amount]


with open(in_file_path,'r') as in_json_file:

    # Read the file and convert it to a dictionary
    json_obj_list = json.load(in_json_file)

    i = 0

    for json_obj in json_obj_list['BooksV1']:
        filename = str(todays_date.year)+'-'+str(todays_date.month)+'-'+str(todays_date.day)+'-'+json_obj['author'].strip()+"-"+left(json_obj['quote'].strip(),30)+'.md'
        filename = filename.replace("/","-")
        filename = filename.replace(",","-")
        filename = filename.replace(" ","-")
        filename = filename.replace("'","")
        filename = filename.replace("»","-")
        filename = filename.replace("«","-")
        filename = filename.replace("--","-")
        filename = filename.replace("---","-")
        filename = filename.replace("----","-")
        filename = filename.replace("-----","-")
        filename = filename.replace("-.",".")
        filename = filename.replace("“","")
        filename = filename.replace("”","")
        filename = filename.replace("’","'")
        filename = filename.replace("\"","")




        i = i + 1
        print (str(i)+' - '+filename)

        with open(filename, 'w') as out_yaml_file:
            yaml = YAML()
            yaml.explicit_start = True
            yaml.default_flow_style = False
            yaml.dump(json_obj, out_yaml_file)
            out_yaml_file.write("id: "+str(i + 21000 - 1)+"\n")  # id
            out_yaml_file.write(""+"\n")
            out_yaml_file.write("layout: quotes"+"\n")
            out_yaml_file.write("categories:"+"\n")
            out_yaml_file.write("- Quotes"+"\n")
            out_yaml_file.write("date: "+str(date_time)+"\n")
            out_yaml_file.write("---\n")
