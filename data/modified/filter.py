##
# Author: Noah Hassett
# Author: Kaushal Patel
#
# This script is responsible for filtering the json file and creating new json files with the 
# filtered data.
#
# NOTE: illicit=1, licit=2, unknown=3
##

import json
import os
import time

# Directory of the current file
SCRIPT_DIR = os.path.dirname(__file__)

# Path to the filtered_models directory
FILTERED_MODELS_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, '..', 'data',
                                                    'filtered_models'))


def load_data(filename):
    """
    Load the data from a file

    Args:
    filename: the name of the file to load the data from
    """
    # Get the path to the file
    filename = os.path.normpath(os.path.join(FILTERED_MODELS_DIR, filename))

    # Print that the file is being loaded
    print(f'Loading data from {filename}...')

    # Load the data
    with open(filename, 'r') as f:
        data = json.load(f)

    return data


def write_data(data, filename):
    """
    Write the data to a file

    Args:
    data: the data to write
    filename: the name of the file to write the data to
    """
    # Get the path to the file
    filename = os.path.normpath(os.path.join(FILTERED_MODELS_DIR, filename))

    # Print that the file is being written
    print(f'Writing data to {filename}...')

    # Write the data
    with open(filename, 'w') as out:
        out.write(json.dumps({"data": data}, indent=2))


def get_illicit_data(data, filename):
    """
    Get the illicit data from the final data

    Args:
    data: the final data
    filename: the name of the file to write the illicit data to
    """
    # Initialize the list of illicit data
    illicit = []

    # Loop through the data
    for transaction in data["data"]:
        # If the group is 1 or any of the edges are illicit, then we keep it
        if transaction["group"] == '1' or is_illicit(transaction):
            illicit.append(transaction)

    # Write the illicit data to a file
    write_data(illicit, filename)


def is_illicit(data):
    """
    Check if the edge data is illicit

    Args:
    data: the edge data
    """

    # Loop through the connected transactions
    for connected_transactions in data["edges"]:
        # If the group is 1, then the transaction is illicit
        if connected_transactions["group"] == '1':
            return True
    return False


def get_min_edge_data(data, min_edge_count, filename):
    """
    Get the data with a minimum edge count

    Args:
    data: the final data
    min_edge_count: the minimum edge count
    filename: the name of the file to write the data with the minimum edge count to
    """
    # Initialize the list of data with the minimum edge count
    min_edge = []

    # Loop through the data
    for transaction in data["data"]:
        # If the number of edges is greater than or equal to the minimum edge count, then we
        # keep it
        if len(transaction["edges"]) >= min_edge_count:
            min_edge.append(transaction)

    # Write the data with the minimum edge count to a file
    write_data(min_edge, filename)


def get_range_edge_data(data, min_edge_count, max_edge_count, filename):
    """
    Get the data with a minimum edge count

    Args:
    data: the final data
    min_edge_count: the minimum edge count
    filename: the name of the file to write the data with the minimum edge count to
    """
    # Initialize the list of data with the minimum edge count
    range_edge = []

    # Loop through the data
    for transaction in data["data"]:
        # If the number of edges is greater than or equal to the minimum edge count, then we
        # keep it
        if min_edge_count <= len(transaction["edges"]) <= max_edge_count:
            range_edge.append(transaction)

    # Write the data with the minimum edge count to a file
    write_data(range_edge, filename)


def get_min_edge_illicit_data(data, min_edge_count, filename):
    """
    Get the data with a minimum edge count and illicit

    Args:
    data: the final data
    min_edge_count: the minimum edge count
    filename: the name of the file to write the data with the minimum edge count to
    """
    # Initialize the list of data with the minimum edge count
    min_edge_illicit = []

    # Loop through the data
    for transaction in data["data"]:
        # If the number of edges is greater than or equal to the minimum edge count, then we
        # keep it
        if len(transaction["edges"]) >= min_edge_count and is_illicit(transaction):
            min_edge_illicit.append(transaction)

    # Write the data with the minimum edge count to a file
    write_data(min_edge_illicit, filename)


def main():
    """
    Main function
    """

    # Print that the program has started
    print('Program started.')

    # Get the start time
    start_time = time.time()

    # Load the data
    data = load_data('data_all_predicted.json')

    # Let the user know that the data is being filtered to include chains with illicit
    print('Filtering the data to include chains with illicit...')

    # Filter the data to include chains with illicit
    get_illicit_data(data, 'data_illicit.json')

    # Let the user know that the data has been filtered
    print('Data has been filtered to include chains with illicit.')

    # Let the user know that the data is being filtered to include chains with minimum edge counts
    print('Filtering the data to include chains with minimum edge counts...')

    # Filter the data to include chains with minimum edge counts
    get_min_edge_data(data, 3, 'data_min_edge.json')

    # Let the user know that the data has been filtered
    print('Data has been filtered to include chains with minimum edge counts.')

    # Let the user know that the data is being filtered to include only chains with no edges
    print('Filtering the data to include only chains with no edges...')

    # Filter the data to include only chains with no edges
    get_range_edge_data(data, 0, 0, 'data_no_edge.json')

    # Let the user know that the data has been filtered
    print('Data has been filtered to include only chains with no edges.')

    # Let the user know that the data is being filtered to include only include transactions
    # with edges that are between X and Y
    print('Filtering the data to include only include transactions with edges that are between X '
          'and Y...')

    # Filter the data to include only include transactions with edges that are between X and Y
    get_range_edge_data(data, 3, 5, 'data_range_edge.json')

    # Let the user know that the data has been filtered
    print('Data has been filtered to include only include transactions with edges that are between'
          'X and Y.')

    # Let the user know that the data is being filtered to include only nodes with minimum of 3
    # edges and include only nodes with illicit in the chain
    print('Filtering the data to include only nodes with minimum of 3 edges and include only nodes'
          'with illicit in the chain...')

    # Filter the data to include only nodes with minimum of 3 edges and include only nodes with
    # illicit in the chain
    get_min_edge_illicit_data(data, 3, 'data_min_3_edge_illicit.json')

    # Let the user know that the data has been filtered
    print('Data has been filtered to include only nodes with minimum of 3 edges and include only'
          'nodes with illicit in the chain.')

    # Print that the program has finished and how long it took
    print(f"Program finished. It took {time.time() - start_time} seconds.")


if __name__ == '__main__':
    main()