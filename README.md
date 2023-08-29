# Node View
## Table of contents:
* [About](#about)
* [Setup](#setup)
    - [Database Setup](#step-one-setting-up-the-database)
    - [Automatic setup](#step-two-importing-the-data-automatic-method)
    - [Manual Setup](#manual-method)
    - [Installing required packages](#step-3-installing-nessesary-packages)
    - [Run the project](#step-4-run-the-project)
* [Re-creating the data](#re-creating-the-data)
* [Notes](#notes)

# About

# Setup
There are two methods of setup: automatically and manually. Automatically pulls the data from an online repository and loads it into Neo4j. This method is recommended so that there will be no issues with the database but is slower due to the size of the dataset. Manual setup loads the data from your own machine but requires more setup in the database
## Step One: Setting up the database
For this project we use the Neo4j database. To use the app you will need to setup Neo4j to run locally. Installation steps are detailed below
1) Download Neo4j for desktop [here](https://neo4j.com/download/) and follow the directions for installation
2) Once Neo4j has finished installing, run it and click New > Create project. The name of the project is not important
3) In the top right side of the screen, click Add > Local DBMS
4) Leave the name of the database the same. The way that Node-View communicates with the frontend requires that the password be setup in the application. We have coded the frontend to use the password "password"
5) After the database has finished loading, enable APOC by clicking on the databse > plugins > APOC > install APOC
6) Once the database has finished setting up start the server and click open
## Step Two: Importing  the data (Automatic Method)
To setup manually, skip [here](#manual-method)

Once the database has been setup following the step above, there are two queries that you have to run

To load the main data, run the following query
```
CALL apoc.load.json("https://raw.githubusercontent.com/Kellan-Anderson/Node-View/main/data/modified/data_final.json")
YIELD value
UNWIND value.data as data
MERGE (s:Transaction {id: data.id, timestep: data.timestep, group: data.group})
WITH s, data
UNWIND data.edges as edge
MERGE (t:Transaction {id: edge.id, timestep: edge.timestep, group: edge.group})
MERGE (s)-[:CONNECTED]->(t)
```

And run the following query to load the meta data
```
CALL apoc.load.json("https://raw.githubusercontent.com/Kellan-Anderson/Node-View/main/data/modified/meta.json") 
YIELD value
UNWIND value.data as data 
MERGE (n:meta {timestep: data.timestep, illicit: data.illicit, licit: data.licit, unknown: data.unknown})
```
And you are all finished with the setup!

## Manual Method
The files that were pulled into the database in the automatic setup are also on your machine, provided you have clone the project. These files were generated using using two python scripts that you can find in the /data/modified folder. Steps to re-create the data are provided below. To load the data into the database manually, you will need to change some of the databases config settings. Those steps are provided below

1) Make sure that your database has finished setting up as described above
2) Once the database is finished setting up, click the three dots to the right of the database name and then click "Open folder" to open the configuration filse for the database. Make an ```apoc.conf``` file here with the following lines

    ```bash
    apoc.import.file.enabled=true
    apoc.import.file.use_neo4j_config=false
    ```
3) Now run the following queries to load the main data and the meta data
    ```
    CALL apoc.load.json("<PATH TO PROJECT>/data/modified/data_final.json")
    YIELD value
    UNWIND value.data as data
    MERGE (s:Transaction {id: data.id, timestep: data.timestep, group: data.group})
    WITH s, data
    UNWIND data.edges as edge
    MERGE (t:Transaction {id: edge.id, timestep: edge.timestep, group: edge.group})
    MERGE (s)-[:CONNECTED]->(t)
    ```
    and
    ```
    CALL apoc.load.json("<PATH TO PROJECT>/data/modified/meta.json") 
    YIELD value
    UNWIND value.data as data 
    MERGE (n:meta {timestep: data.timestep, illicit: data.illicit, licit: data.licit, unknown: data.unknown})
    ```
Now the data should be loaded from your own machine

## Step 3: Installing nessesary packages
To install the nessesary packages for the frontend:
1) Navigate to the frontend directory
2) Run:

    ```bash 
    npm install
    ```
    This may take a few minutes as it is installing all of the packages not included when you clone the project

## Step 4: Run the project
To start the project:
1) Make sure that the database is running and is active
2) Navigate to the frontend directory
3) Run ```npm start```. After a minute or two this will automatically open a browser window. If the project was setup correctly, you should be able to see the project in your browser!

## Re-creating the data
The data provided in this project has been created with two python scripts, both of which can be found in the ```/data/modified/``` directory. These scripts are called script.py and create_meta.py and they are used to create the main data and the meta data, respectively. If you are wanting to change the data, or generate it yourself, first you must retreive the data used for the project [here](https://www.kaggle.com/datasets/ellipticco/elliptic-data-set). Download and unzip all the files, then make sure that the files are placed in the same directory as the script files. To re-generate the data loaded by the database, run the following command. It is important that these are ran **in order** as the first script generates data for the second
```bash
python3 script.py && python3 create_meta.py
```

The script.py uses three settings (that you can find in the top of the file) called
```python
MAX_NODES = 30
MAX_EDGES = 20
MIN_EDGES = 2
```
These settings are used to limit the amount of data that is created from the data provided from Elliptic and limits the data to roughly 1% of the original. Changing these values will change the overall amount of nodes inside of the dataset. If you change the data you will not need to change the way the data is loaded into the database. However, it is required that you setup the database the manual way if you do this

# Notes
Currently, the backend serves no purpose in the project due to a decision to change dataflow of the project during development. It is still part of the project for potential future use