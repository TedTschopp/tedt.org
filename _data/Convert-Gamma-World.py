# Convert json to yaml


import sys
import json
from ruamel.yaml import YAML

in_file_path='/Users/tedtschopp/Developer/tschopp.net/_data/GammaWorldv5 Working.json' # Change me!

with open(in_file_path,'r') as in_json_file:

    # Read the file and convert it to a dictionary
    json_obj_list = json.load(in_json_file)

    for json_obj in json_obj_list['CreaturesV5']:
        i = 1
        print (json_obj['Name']+' '+json_obj['Common_Name'])
        
        filename='creature_'+json_obj['Name']+'_'+json_obj['Common_Name']+'.yaml'
        # print (i)
        with open(filename, 'w') as out_yaml_file:
            yaml = YAML()
            yaml.default_flow_style = False
            yaml.dump(json_obj, out_yaml_file)
