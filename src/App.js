import React from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import StartPage from './components/StartPage/StartPage';
import { AuthProvider } from './Auth';

const history = createBrowserHistory();

function App() {
  return (
    <AuthProvider>
      <Router history={ history }>
        <StartPage />

      </Router>
    </AuthProvider>
  
  );
}

export default App;
