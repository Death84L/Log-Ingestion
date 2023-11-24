import React, { useState } from 'react';
import axios from 'axios';
import './LogForm.css'; 

const LogForm = () => {
  const [logData, setLogData] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestamp: '',
    traceId: '',
    spanId: '',
    commit: '',
    metadata: {
      parentResourceId: '',
    },
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target || e;
    setLogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setLogData((prevData) => ({
      ...prevData,
      metadata: {
        ...prevData.metadata,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/logs', logData);
      console.log('Log added successfully!');

      // Clear the form
      setLogData({
        level: '',
        message: '',
        resourceId: '',
        timestamp: '',
        traceId: '',
        spanId: '',
        commit: '',
        metadata: {
          parentResourceId: '',
        },
      });

      // Display a success message for 5 seconds
      setSuccessMessage('Log added successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error('Error adding log:', error.message);
      // Handle error (display an error message or log it)
    }
  };

  return (
    <div>
      <h1>Add log in Database</h1>
      <hr></hr>
    <form onSubmit={handleSubmit}>
      <label>
        Level:
        <input type="text" name="level" value={logData.level} onChange={handleChange} />
      </label>
      <br />
      <label>
        Message:
        <textarea name="message" value={logData.message} onChange={handleChange} />
      </label>
      <br />
      <label>
        Resource ID:
        <input type="text" name="resourceId" value={logData.resourceId} onChange={handleChange} />
      </label>
      <br />
      <label>
        Timestamp:
        <input type="datetime-local" name="timestamp" value={logData.timestamp} onChange={handleChange} />
      </label>
      <br />
      <label>
        Trace ID:
        <input type="text" name="traceId" value={logData.traceId} onChange={handleChange} />
      </label>
      <br />
      <label>
        Span ID:
        <input type="text" name="spanId" value={logData.spanId} onChange={handleChange} />
      </label>
      <br />
      <label>
        Commit:
        <input type="text" name="commit" value={logData.commit} onChange={handleChange} />
      </label>
      <br />
      <label>
        Parent Resource ID:
        <input
          type="text"
          name="parentResourceId"
          value={logData.metadata.parentResourceId}
          onChange={handleMetadataChange}
        />
      </label>
      <br />

      <button type="submit">Add Log</button>
      {successMessage && <p>{successMessage}</p>}
    </form>
    </div>
  );
};

export default LogForm;
