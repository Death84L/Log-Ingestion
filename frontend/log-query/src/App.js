import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogSearch from './LogSearch';
import LogForm from './LogForm';
import Home from './home'; 

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/logsearch" element={<LogSearch />} />
          <Route path="/logform" element={<LogForm />} />
          {/* Add more routes for other pages if needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
