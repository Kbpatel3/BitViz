/**
 * Index.js
 *
 * This module serves as the entry point for the React application. It initializes the
 * application by rendering the root component, setting up the Neo4j database connection,
 * defining routes using React Router, and utilizing various context providers.
 *
 * @module Index
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// !added more comments to understand the functions

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Neo4jProvider, createDriver } from 'use-neo4j';
import { ObserverProvider } from './context/ObserverContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Landing from './Landing';


// Address and port of the database
// const address = '152.30.5.83';
const address = 'localhost';
const port = 7687;

// Name and password
const username = 'neo4j'; // Username
// NOTE: this must match the password that is entered when creating the database
const password = 'password';

// Gets a database driver from the use-neo4j package
const driver = createDriver('neo4j', address, port, username, password);

// const uri = `neo4j://${address}:${port}`;
// const database = 'test';
// const driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
//   database: database // Specify the database in the configuration
// });

// Gets the root of the index.html document (found in frontend/public/)
const root = ReactDOM.createRoot(document.getElementById('root'));

// const [database, setDatabase] = React.useState('neo4j');

// Renders the root component of the application
root.render(
  <React.StrictMode>
    {/* Neo4j database provider context */}
    <Neo4jProvider driver={driver}
    database='neo4j'>
      {/* Observer context */}
      <ObserverProvider>

        {/* Routes inside the app */}
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Landing />} />
              <Route path="/app" element={<App />}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </ObserverProvider>
    </Neo4jProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
