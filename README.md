# BitViz

## Table of Contents
1. [Contributor Information](#contributor-information)
2.[Introduction](#introduction)
3.[Installation](#installation)
   - [File Structure](#file-structure)
   - [Automatic Setup](#automatic-setup)
        - [Step 1: Setting up the database](#step-1-setting-up-the-database)
        - [Step 2: Setting up the frontend](#step-2-setting-up-the-frontend)
   - [Manual Setup](#manual-setup)
4.[Usage](#usage)
5.[Screenshots](#screenshots)

## Introduction
BitViz is a tool for visualizing and analyzing Bitcoin transactions. 
It is built on top of the Neo4j graph database and uses the APOC library to import data. 
The frontend is built using React. The project is designed to be run locally, but is currently 
hosted on the web via WCU's servers. To access the web version, click [here]
(http://csbccapstone.wcu.edu:8080/). The data that is used in the project is from
the [Elliptic Data Set](https://www.kaggle.com/datasets/ellipticco/elliptic-data-set/). 
The data was converted to a graph database using two python scripts that can be found in the
/data/modified folder. The goal of the project is to provide a tool for users to explore the
relationships between Bitcoin transactions and to provide a way to analyze the data in a
meaningful way. Also, the goal is to classify the roughly 75% of the data that is currently
unclassified.

## Installation
To install the project, follow these steps:
1) Clone the project (frontend)
```bash
git clone https://github.com/Kbpatel3/BitViz.git
```

2) Clone the project (machine learning)
```bash
git clone https://github.com/Kbpatel3/BitViz-ML.git
```

The node modules will be installed and the project will be ready to run.
However, we need to setup the database before we can run the project. There are two methods
to setup the database: automatic and manual. The automatic method is the easiest and is
recommended. The manual method is more difficult and requires more steps. The automatic
method is described below.

### File Structure
Before proceeding, make sure you get an idea of the file structure of the project.

To view the file structure, click [here](https://tree.nathanfriend.io/?s=%28%27optiws%21%28%27fancyF~fullPQh%21falR~trailingSXhF~rootDotF%29~N%28%27N%27BitViz049modiWIkcreQe_JYkscriptY0frwtend05react%20relQ6Wles74baR_dumps05.dumps%20for%20each%204bas8Zb8loadI7original_4Rt9C93IgelistK93feQuresK0%5CnBitViz-ML0G9prIictI_4_WnalHTPrIict6O%20of%20C7src9E2E6Rts7*ml2ML%20G%20and%20export%20th8cXsiW64Rt749EI_Gsk4k5q7**J4k5Jq%7D%27%29~O%21%271%27%29*%20%200%5Cn*2YTUs6ZgenerQ8th83elliptic_txs_4dQa5*%7BAll%206I%207%7D08e%2090*C3cXRsKEWlterF%21trueGmodelH.jswIedJmetaK.csvNsource%21OversiwQatRseT%20%7BWfiXlasY.pyZto%20k9*q4%20Hwon%01wqkZYXWTRQONKJIHGFEC987654320*).

The project is divided into two main parts: BitViz-ML and BitViz. The BitViz-ML
folder contains the machine learning model generation that is used to classify the data. The 
BitViz folder contains the frontend of the project. The frontend is built using React.

In the BitViz folder, there are four main folders: data, frontend, database_dumps, and
original_datasets. The data folder contains the scripts used to generate two data files (for 
loading onto Neo4J) from the original datsets provided by Elliptic. The frontend folder contains
the React frontend of the project. The database_dumps folder contains the database dumps that
are used to load the data onto Neo4J. The original_datasets folder contains the original datasets
provided by Elliptic.

### Automatic Setup

#### Step 1: Setting up the database
To setup the database, follow these steps:
1) Download Neo4j for desktop [here](https://neo4j.com/download/) and follow the directions for installation

2) Once Neo4j has finished installing, run it and 
click New > Create project. The name of the project is not important

3) In the bottom section of the screen under "File", click "Reveal files in File Manager"
    - This will open the directory where the database dumps can be placed

4) Copy the database dumps from the database_dumps folder in the project to the 
directory that was opened in the previous step.

5) After copying the dumps over to Neo4J, you should see a list of .dump files in the "file" 
   section.

6) For each .dump file, click the three dots to the right of the file name and click "Create new
 DBMS from dump"
    - This will load the data into the database
    - It will prompt you to enter a name for the database. Make the name the same as the file name.
      - For example, if the file name is "data-all-predicted.dump", name the database
        "data-all-predicted"

7) Each database dump will create a new database. Be aware that the database dumps are large and
will take a while to load. The largest dump is "data-all-predicted.dump" and 
   "data-all-unpredicted" and will take the longest

8) Now that the databases are setup, you can proceed to the frontend setup

#### Step 2: Setting up the frontend
To setup the frontend, follow these steps:

1) Open the frontend folder in the project
```bash
cd BitViz/frontend
```

2) Install the node modules
```bash
npm install
```

3) Start the frontend
```bash
npm start
```

4) The frontend should now be running on localhost:3000


### Manual Setup
Note: The manual setup is more difficult and is not recommended. The automatic setup is
recommended. For now, the manual setup is not fully documented. If you would like to setup the
database manually, please refer to the original README.md file.

## Usage
The project is designed to be run locally. The frontend is built using React and the backend is
built using Neo4j. The project is designed to be run locally, but is currently hosted on the web
via WCU's servers. To access the web version, click [here]
(http://csbccapstone.wcu.edu:8080/).

## Screenshots
TODO : Going to add screenshots for each step if necessary.







