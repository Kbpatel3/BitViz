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

/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Javascript entry point for the application, gets an HTML element with an ID of root and renders the JSX rendered
 * in the app component
 */

// Address and port of the database
const address = 'localhost';
const port = 7687;

// Name and password
const databaseName = 'neo4j';
// NOTE: this must match the password that is entered when creating the database
const password = 'password';

// Gets a database driver from the use-neo4j package
const driver = createDriver('neo4j', address, port, databaseName, password);

// Gets the root of the index.html document (found in frontend/public/)
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Neo4jProvider driver={driver}>
      {/* Observer context */}
      <ObserverProvider>

        {/* Routes inside of the app */}
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
