# Temporary python script that gets only the illicit nodes
# NOTE: illicit=1, licit=2, unknown=3
import json

def rm_nonillicit(data):
    for each in data["edges"]:
        if each["group"] != '1':
            data["edges"].remove(each) # remove the edge if it is not illicit

def main():
    illicits = []
    # with open('data_final.json', 'r') as f:
    with open('.\data\data_all_predicted.json', 'r') as f:
        data = json.load(f)
    with open('.\data\data_illicit_only.json', 'w') as out:
        for each in data["data"]:
            if each["group"] == '1':
                rm_nonillicit(each)
                illicits.append(each)
        out.write(json.dumps({"data": illicits}, indent=2))

if __name__ == '__main__':
    main()