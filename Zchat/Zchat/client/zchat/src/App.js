import { Route, BrowserRouter as Router } from 'react-router-dom'

import Chat from './components/Chat/Chat'
import Join from './components/Join/Join'
import React from 'react'

function App() {
  return (
    <div className="App">
      <Router>
        <Route path='/' exact component={Join} />
        <Route path='/chat' exact component={Chat} />
      </Router>
    </div>
  );
}

export default App;
