import React, { useState } from 'react';
import axios from 'axios';


const LogSearch = () => {
  const [filters, setFilters] = useState({
    level: '',
    message: '',
    resourceId: '',
    timestampStart: '',
    timestampEnd: '',
    traceId: '',
    spanId: '',
    commit: '',
    parentResourceId: '',
  });
  const [searchText, setSearchText] = useState('');
  const [logResults, setLogResults] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
  };

  const searchLogs = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/logs/search', {
        ...filters,
        searchText,
        timestamp: {
          start: new Date(filters.timestampStart),
          end: new Date(filters.timestampEnd),
        },
      });

      const logs = response.data;
      setLogResults(logs);
    } catch (error) {
      console.error('Error searching logs:', error);
    }
  };
 
  return (
    <div>
      <h1>Log Search</h1>
      <div>
        <label>
          Search Text:
          <input type="text" value={searchText} onChange={handleSearchTextChange} />
        </label>
        <button type="button" onClick={searchLogs}>
          Search  (Scroll to see result)
        </button>
      </div>

      <h3>Not necessary to fill all filters , use according to your condition</h3>
      <form>
        <label>
          Level:
          <input type="text" name="level" value={filters.level} onChange={handleInputChange} />
        </label>

        <label>
          Message:
          <input type="text" name="message" value={filters.message} onChange={handleInputChange} />
        </label>

        <label>
          Resource ID:
          <input type="text" name="resourceId" value={filters.resourceId} onChange={handleInputChange} />
        </label>

        <label>
          Timestamp Start:
          <input
            type="datetime-local"
            name="timestampStart"
            value={filters.timestampStart}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Timestamp End:
          <input
            type="datetime-local"
            name="timestampEnd"
            value={filters.timestampEnd}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Trace ID:
          <input type="text" name="traceId" value={filters.traceId} onChange={handleInputChange} />
        </label>

        <label>
          Span ID:
          <input type="text" name="spanId" value={filters.spanId} onChange={handleInputChange} />
        </label>

        <label>
          Commit:
          <input type="text" name="commit" value={filters.commit} onChange={handleInputChange} />
        </label>

        <label>
          Parent Resource ID:
          <input
            type="text"
            name="parentResourceId"
            value={filters.parentResourceId}
            onChange={handleInputChange}
          />
        </label>

        <button type="button" onClick={searchLogs}>
          Search (Scroll to see result)
        </button>
      </form>

      <div>
      <h2>Search Results</h2>
      {logResults.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <ul>
          {logResults.map((log, index) => (
            <li key={index}>
              <pre>{JSON.stringify(log, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>

    </div>
  );
};

export default LogSearch;
