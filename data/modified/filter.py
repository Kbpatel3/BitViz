# Filters the data to get the illicit data (will add more filters)

def get_illicit_data(data, filename):
    """
    Get the illicit data from the final data
    """
    illicits = []
    with open(filename, 'w') as out:
        for each in data["data"]:
            if each["group"] == '1' or is_illicit(each):
                illicits.append(each)
        out.write(json.dumps({"data": illicits}, indent=2))


def is_illicit(data):
    """
    Check if the edge data is illicit
    """
    for each in data["edges"]:
        if each["group"] == '1':
            return True
    return False


def main():
    """
    Main function
    """
    with open('data_final.json', 'r') as f:
        data = json.load(f)
    get_illicit_data(data, 'illicit_data.json')

    # NOTE:Please add files to filter 


if __name__ == '__main__':
    main()