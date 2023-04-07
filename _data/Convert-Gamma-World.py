# Convert json to yaml
import sys
import json
from ruamel.yaml import YAML

in_file_path='/Users/tedtschopp/Developer/tschopp.net/_data/GammaWorldv11.json' # Change me!

with open(in_file_path,'r') as in_json_file:

    # Read the file and convert it to a dictionary
    json_obj_list = json.load(in_json_file)

    for json_obj in json_obj_list['CreaturesV5']:
        filename = json_obj['title']+'.md'
        filename = filename.replace("/","-")
        filename = filename.replace(",","-")
        filename = filename.replace(" ","-")
        filename = filename.replace("'","")
        filename = filename.replace("»","-")
        filename = filename.replace("«","-")
        filename = filename.replace("--","-")
        filename = filename.replace("---","-")
        filename = filename.replace("----","-")
        filename = filename.replace("-.",".")

        print (filename)

        # print (i)
        with open(filename, 'w') as out_yaml_file:
            yaml = YAML()
            yaml.explicit_start = True
            yaml.default_flow_style = False
            yaml.dump(json_obj, out_yaml_file)
            out_yaml_file.write("date: 2023-04-06T03:13:00+00:00\n") # Change Me!
            out_yaml_file.write("---\n")
            out_yaml_file.write("</br>")
