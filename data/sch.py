import json
import random

timestamp_list = [1,2,3,4,5,6,7,8,9,10]

f = open('moretimestep.json',"r")
data = json.load(f)

for node in data['nodes']:
    node.update({"timestamp": timestamp_list[random.randrange(0,10)]})

json.dumps(data)
f2 = open('new_test.json', 'w')
f2.write(json.dumps(data))
f.close()
f2.close()


