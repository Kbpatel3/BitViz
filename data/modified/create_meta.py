import json

def main():
    with open("data_final.json", 'r') as f:
        data = json.load(f)
    check_nodes = []
    out = {
        f'{i}': {
            '1': 0,
            '2': 0,
            '3': 0,
        } 
    for i in range(1,50)}

    for node in data['data']:
        if node['id'] not in check_nodes:
            check_nodes.append(node['id'])
            out[node['timestep']][node['group']] += 1
        for edge_node in node['edges']:
            if edge_node['id'] not in check_nodes:
                check_nodes.append(edge_node['id'])
                out[edge_node['timestep']][edge_node['group']] += 1
    
    write_data = []
    for timestep in out.keys():
        write_data += [
            {
                "timestep": int(timestep), 
                "illicit": int(out[timestep]["1"]),
                "licit": int(out[timestep]["2"]), 
                "unknown": int(out[timestep]["3"])
            }
        ]

    with open('meta.json', 'w') as f:
        f.write(json.dumps({"data": write_data}, indent=2))

if __name__ == '__main__':
    main()

"""
CALL apoc.load.json("Users\Kellan Anderson\Desktop\meta.json")
YIELD value
UNWIND value.data as data
MERGE (s:meta {timestep: data.timestep, illicit: data.group1, licit: data.group2, unknown: data.group3})

====================================================================

match (n) with collect({timestep: n.timestep, illicit:n.illicit, licit:n.licit, unknown:n.unknown}) as meta return meta

======================================================================
match (n:Transaction {timestep: "1"}), (a:Transaction {timestep: "1"})-[]->(b:Transaction {timestep: "1"})
WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes,
COLLECT(DISTINCT {source: a.id, target: b.id}) as links 
RETURN {nodes: nodes, links: links}
"""