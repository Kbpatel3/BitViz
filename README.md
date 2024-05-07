# BitViz

## Table of Contents
* [Contributor Information](#contributor-information)
* [Oranization Information](#organization-information)
* [Introduction](#introduction)
* [Installation](#installation)
   - [File Structure](#file-structure)
   - [Automatic Setup](#automatic-setup)
        - [Step 1: Setting up the database](#step-1-setting-up-the-database)
        - [Step 2: Setting up the frontend](#step-2-setting-up-the-frontend)
   - [Manual Setup](#manual-setup)
* [Usage](#usage)
* [Video Guide For Installation](#video-guide-for-installation)
* [Video Demo](#video-demo)
* [Screenshots](#screenshots)

## Contributor Information
- [Kaushal Patel](https://github.com/kbpatel3/)
- [Noah Hassett](https://github.com/na245/)

## Organization Information
Math and Computer Science Department at [Western Carolina University](https://www.wcu.edu/)
- Course: CS 495-496 - Capstone Project

## Introduction
BitViz is a tool for visualizing and analyzing Bitcoin transactions. 
It is built on top of the Neo4j graph database and uses the APOC library to import data. 
The frontend is built using React. The project is designed to be run locally, but is currently 
hosted on the web via WCU's servers. To access the web version, 
click [here](http://csbccapstone.wcu.edu:8080/) (**Must be on WCU internet**).
The data that is used in the project is from
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

3) Install the node modules for the frontend
```bash
cd BitViz/frontend
npm install
```

4) Follow README.md in the BitViz-ML project to setup the machine learning model

5) The project is now installed.

The node modules will be installed and the project will be ready to run.
However, we need to setup the database before we can run the project. There are two methods
to setup the database: automatic and manual. The automatic method is the easiest and is
recommended. The manual method is more difficult and requires more steps. The automatic
method is described below.

### File Structure
Before proceeding, make sure you get an idea of the file structure of the project.

To view the file structure, 
click [here](https://tree.nathanfriend.io/?s=(%27options!(%27fancyJ~fullPQh!falq~trailingSlashJ~rootDotJ)~Z(%27Z%27BitViz04GmodifiTG*creQe_XwG*scriptw0frontend05react%20relQ6files74baq_dumps05.dumps%20for%20each%204basWto%20bWloadT7origY_4qtG3KesCG3TgelistCG3feQuresC0%5CnBitViz-ML0NGp9T_4_fYOHP96k%203KesC7*%22FY%20P96DQa.rar%22HRAR%20k8p96C7srcGI2I6qts7*ml2ML%20N%20and%20export8Kifi64qt74GIT_NsG*4G*54%20O7**X4G*5X4%20O%7D%27)~E!%271%27)

The project is divided into two main parts: BitViz-ML and BitViz. The BitViz-ML
folder contains the machine learning model generation that is used to classify the data. The 
BitViz folder contains the frontend of the project. The frontend is built using React.

In the BitViz folder, there are four main folders: **data**, **frontend**, **database_dumps**, and
**original_datasets**. 
- The **data** folder contains the scripts used to generate two data files (for 
loading onto Neo4J) from the original datsets provided by Elliptic. 
- The **frontend** folder contains the React frontend of the project. 
- The **database_dumps** folder contains the database dumps that are used to load the data onto 
  Neo4J. 
- The **original_datasets** folder contains the original datasets provided by Elliptic.

### Automatic Setup

#### Step 1: Setting up the database
To setup the database, follow these steps:
1) Download Neo4j for desktop [here](https://neo4j.com/download/) and follow the directions 
    for installation

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
database manually, please refer to the original README.md file in the project.

## Usage
The project is designed to be run locally. The frontend is built using React and the backend is
built using Neo4j. The project is designed to be run locally, but is currently hosted on the web
via WCU's servers. To access the web version, click [here]
(http://csbccapstone.wcu.edu:8080/).

## Video Guide For Installation
TODO : Going to add video guide for installation.

## Video Demo
TODO : Going to add video demo for the project.

## Screenshots
TODO : Going to add screenshots for each step if necessary.






