import React from 'react';

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Provider from './components/Context/Provider';
import Todo from './pages/Todo';
import Login from './pages/Login';

function App() {
  return (
    <div className="container">
    <BrowserRouter>
      {/* <Provider>
        <NavBar />
      </Provider> */}

      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <Provider>
                <Todo />
              </Provider>
            }
          />
          <Route
            path="/login"
            element={
              <Provider>
                <Login />
              </Provider>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
  );
}

export default App;
