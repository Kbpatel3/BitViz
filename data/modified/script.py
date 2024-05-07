"""
PSEUDOCODE:
Load the initial data from the .csv files
Pass the initial data to sort_by_timestep() to generate the nodes in each timestep
Take the timestep sorted data and pass it to create_limits() to find the number of each group of 
node needed in the 
final data
    Returns a limits dictionary

Take the timestep-sorted dictionary and the limits dicitonary and pass to filter_group() to get the 
group-filtered_dictionary
Pass group_filtered_dict to limit_by_edge() to filter data by the # of edges of a node
    Returns edge_filtered_dict
Take group_filtered_dict and pass to get_final() to bring in all connected nodes from the limited 
data and write to final.json
"""

import json
from math import ceil

# Limits the data
# MAX_NODES = 30
# MAX_EDGES = 20
# MIN_EDGES = 2

# ?Max nodes and edges for the entire dataset
MAX_NODES = 30 * 95
MAX_EDGES = 20 * 95
MIN_EDGES = 2 * 95


def sort_by_timestep(initial_data):
    """
    Takes the loaded data and sorts it by timesteps
    
    Data needs to be in the format of:
    {
        id: {
            group: #,
            timestep: #,
            edges: []
        }
    }

    Returns:
    {
        timestep#: [
            {id: #, timestep: #, edges[]},
            {id: #, timestep: #, edges[]},
            etc.
        ]
    }
    """

    # Init return dictionary
    return_dict = {f'timestep{i}': [] for i in range(1, 50)}

    # Loop over each node id in the data
    for key in initial_data:
        # Get the node and timestep at the specified key
        node = initial_data[key]
        ts = node['timestep']

        # Append the node to the appropriate spot in our return dictionary
        return_dict[f'timestep{ts}'].append(
            {"id": key, "group": node['group'], "edges": node['edges']})

    return return_dict


def create_limits(timestep_sorted_dict, write_to_file=False):
    """
    Creates the limits for limiting the amount of nodes in each group of the final data

    Takes timestep sorted data and returns data in the same format
    """

    # Init our limits dictionary
    limits = {f'timestep{i}': {} for i in range(1, 50)}

    # Loop over each timestep in our data
    for timestep in timestep_sorted_dict:
        # Init our sums
        group1_sum = 0
        group2_sum = 0
        group3_sum = 0

        # Calculate the groups
        for node in timestep_sorted_dict[timestep]:
            if node['group'] == "1":
                group1_sum += 1
            elif node['group'] == "2":
                group2_sum += 2
            elif node['group'] == "3":
                group3_sum += 3

        # Calculate the totals
        timestep_total = group1_sum + group2_sum + group3_sum

        # Get the ratio of a groups count to the rest of the data in the timestep and take the
        # ceiling of the product of the MAX_NODES setting times the ratio, then set the value in 
        # the limits
        limits[timestep] = {
            "group1": ceil(MAX_NODES * (group1_sum / timestep_total)),
            "group2": ceil(MAX_NODES * (group2_sum / timestep_total)),
            "group3": ceil(MAX_NODES * (group3_sum / timestep_total)),
        }

    # Write to the file, used for testing    
    if write_to_file:
        with open('limits.json', 'w') as f:
            f.write(json.dumps(limits, indent=2))

    return limits


def filter_group(sorted_dict, limits_dict):
    """
    Filter the nodes in the final data based on the groups that we calculated in create_limits()
    """
    rtn_dict = {f'timestep{i}': [] for i in range(1, 50)}
    # Loop over every timestep
    for timestep in sorted_dict:
        # get the nodes in a timestep
        nodes = sorted_dict[timestep]
        # setup counters comp_counter & current_counter
        comp_counter = limits_dict[timestep]
        current_counter = {
            "group1": 0,
            "group2": 0,
            "group3": 0
        }

        # loop over the nodes in a timestep while counters are not equal
        node_cnt = 0
        while comp_counter != current_counter and node_cnt <= len(nodes) - 1:
            node = nodes[node_cnt]
            group_key = f'group{node["group"]}'
            # CHECK 1: if the current node's group is below the limit (found in comp_counter)
            if current_counter[group_key] <= comp_counter[group_key]:
                # CHECK 2: if the nodes egdes are withing the settings range
                edges = len(node['edges'])

                # Lower our min edges setting for group 1 nodes due to some timesteps containing 
                # group one nodes with only one edge
                min_edges = 1 if group_key == "group1" else MIN_EDGES

                if edges <= MAX_EDGES and edges >= min_edges:
                    # add the node to the return dictionary
                    rtn_dict[timestep].append(node)
                    # increment the current counter
                    current_counter[group_key] += 1
            # Increment the node counter
            node_cnt += 1

    return rtn_dict

def get_final(filtered_dict, initial_dict, write_to_file=True):
    """
    Convert the final dataset to a format that the Neo4j database can load
    """

    # Print count of filtered_dict and inital_dict
    print(len(filtered_dict))
    print(len(initial_dict))

    # Init data
    final = []

    # Loop over the timesteps in the filtered data
    for timestep in filtered_dict:
        # Loop over each node in the timestep
        for node in filtered_dict[timestep]:
            # Get the timestep number from a string
            timestep_num = pull_timestep(timestep)
            # Create a temporary node
            temp = {
                "id": node['id'],
                "group": node['group'],
                "timestep": timestep_num,
                "edges": []
            }

            # Loop over each edge in the current node
            for edge_id in node['edges']:
                # pull the values from the original dataset to append it to the temporary nose
                temp['edges'].append({
                    "id": edge_id,
                    "timestep": timestep_num,
                    "group": initial_dict[edge_id]['group']
                })
            # Append the temporary node to the return data
            final.append(temp)
    
    # Write to a file
    if write_to_file:
        with open('data_final.json', 'w') as f:
            # Data is wrapped in { "data": [] } for the database
            f.write(json.dumps({"data": final}, indent=2))

    return {"data": final}


def pull_timestep(string):
    """
    Takes the last two characters from the string provided and checks if they're a digit, if so 
    return, else return the last character
    """
    if string[-2:].isdigit():
        return string[-2:]
    return string[-1]


def percent_as_str(part, whole):
    """
    Convert the values to a percentage string rounded to 2 decimal places
    """
    frac = float(part) / float(whole)
    return str(int((frac * 10000) // 1) / 100)


def print_stats(data, filename='metadata.csv'):
    """
    Takes the data and writes it to a .csv file. This allows us to look at the data easier through
    a program such as Excel.
    """

    # Used for keeping track of what nodes we've looked at
    checked_nodes = []

    # Make a dictionary for holding counts of the groups of our data
    print_data = {f'{i}': {"1": 0, "2": 0, "3": 0} for i in range(1, 50)}
    totals_data = {'1': 0, '2': 0, '3': 0, 'total': 0}

    # Loop over the nodes in oir data
    for node in data:
        # Make sure we have not already looked at the node
        if node['id'] not in checked_nodes:
            # Add the node to the checked nodes
            checked_nodes.append(node['id'])
            # Increment our counts
            print_data[node['timestep']][node['group']] += 1
            totals_data[node['group']] += 1
            totals_data['total'] += 1

    # Title string for our csv file
    csv_str = "Timestep,Group 1,Group 2,Group 3,Group 1 %,Group 2 %,Group 3 %,total\n"

    # Loop over the timesteps on our count data
    for timestep in print_data:
        # Get our counts
        counts = print_data[timestep]
        g1, g2, g3 = counts['1'], counts['2'], counts['3']
        total = g1 + g2 + g3
        # convert counts to percentages
        g1p = percent_as_str(g1, total)
        g2p = percent_as_str(g2, total)
        g3p = percent_as_str(g3, total)
        # Append the data to our csv file
        csv_str += f'Timestep {timestep},{g1},{g2},{g3},{g1p},{g2p},{g3p},{total}\n'

    # Add the totals line to our file
    csv_str += f'TOTALS,{totals_data["1"]},{totals_data["2"]},{totals_data["3"]},{totals_data["total"]}'

    # Write the data to our file and print a confirmation message
    with open(filename, 'w') as f:
        f.write(csv_str)
        print("Data written to " + filename)


def main():
    """
    Main function for the script
    """

    # Init data
    initial_data = {}

    # Load data in from the features
    with open('elliptic_txs_features.csv', 'r') as f:
        features = f.readlines()
        for i in features:
            line = i.split(',')
            initial_data[line[0]] = {"timestep": line[1], "group": "", "edges": []}

    # Load data from the classes
    with open('elliptic_txs_classes.csv', 'r') as f:
        classes = f.readlines()[1:]
        for i in classes:
            line = i.split(',')
            if line[1] == "unknown\n":
                group = "3"
            else:
                group = line[1]
            initial_data[line[0]]["group"] = group.strip()

    # Load data from edgelist
    with open('elliptic_txs_edgelist.csv', 'r') as f:
        edges = f.readlines()[1:]
        for i in edges:
            line = i.split(',')
            initial_data[line[0]]["edges"].append(line[1].strip())

    # Pass initial data to filters
    timestep_sorted_data = sort_by_timestep(initial_data)
    print("Done with sort_by_timestep")
    #limits = create_limits(timestep_sorted_data)
    #filtered_data = filter_group(timestep_sorted_data, limits)
    print("About to get final")
    final_data = get_final(timestep_sorted_data, initial_data)
    # get_illicit_data(final_data, 'illicit_data.json')

    #print("Final Data\n")
    #print(final_data)

    #print_stats(final_data["data"])


if __name__ == "__main__":
    main()
