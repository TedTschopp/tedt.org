import json

in_file_path='/Users/tedtschopp/Developer/tschopp.net/_data/GammaWorldv5 Working.json' # Change me!

with open(in_file_path,'r') as in_json_file:

    # Read the file and convert it to a dictionary
    json_obj_list = json.load(in_json_file)

    for json_obj in json_obj_list:
        i = 1
        for creature in json_obj:
           
           filename='creature_'+str(i)+'.json'

           with open(filename, 'w') as out_json_file:
               # Save each obj to their respective filepath
               # with pretty formatting thanks to `indent=4`
               json.dump(creature, out_json_file, indent=4)
               i=i+1