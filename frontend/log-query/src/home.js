// src/components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Welcome to Log Ingestor App</h1>
      <h2>Made by Kausstubh Jaiswal</h2>
      <div>
        <Link to="/logsearch">
          <button style={buttonStyle}>Perform Query</button>
        </Link>
        <Link to="/logform">
          <button style={buttonStyle}>Add Log in Database</button>
        </Link>
        <hr></hr>
        <a href="https://drive.google.com/file/d/1HBRd0GBhklJnh9Pu0D7BaOLCCc4n8XuC/view?usp=sharing" target="_blank" rel="noopener noreferrer">
          <button style={buttonStyle}>Resume</button>
        </a>
      </div>

    </div>
  );
};

const buttonStyle = {
  padding: '10px',
  fontSize: '18px',
  margin: '10px',
};

export default Home;
