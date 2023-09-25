# Imports
import json

op1 = open('elliptic_txs_classes.json', "r")  # Open test.json and give it read permissions
op2 = open('group.json', "r")  # Open tes1.json
json1 = json.load(op1)  # Base JSON
json2 = json.load(op2)  # JSON being compared


def json_compare(json1, json2):
    # Compare all keys
    for key in json1.keys():
        # if key exist in json2:
        if key in json2.keys():
            # If subjson
            if type(json1[key]) == dict:
                json_compare(json1[key], json2[key])
                print("These entries are the same")
            else:
                if json1[key] != json2[key]:
                    print("These entries are different:")
                    print(json1[key])
                    print(str(json2[key]) + "\n")
                    print("fixing ... ")
                    # for node in json2['links']:
        else:
            print("found new key in json1 %r" % key)
    return True


def elliptic(json_to_stay_same, json_to_make_match):
    key = "links"
    # loop through the dictionaries in the one that stays the same
    for entry in json_to_stay_same[key]:
        # compare the whole dictionaries in the list (ie: {source: "testing", target: "123"})
        count = 0
        #print("first json source:", entry["source"])
        try:
            for _ in json_to_make_match[key]:
                #print("second json source:", json_to_make_match[key][count]["source"])
                if str(entry["source"]) == str(json_to_make_match[key][count]["source"]):
                    #print("They're the same")
                    if str(entry["timestamp"]) != str(json_to_make_match[key][count]["timestamp"]):
                        json_to_make_match[key][count]["timestamp"] = entry["timestamp"]
                    else:
                        #print("Complete!")
                        break
                count += 1
        except IndexError:
            print("Error: outside bounds of index")
            break

    print("Modification Complete")
    #print("First json:", json_to_stay_same)
    #print("Second json:", json_to_make_match)
    print("Writing to file...")
    f = open("modified.json", "w")
    f.write(json.dumps(json_to_make_match))


elliptic(json1, json2)
