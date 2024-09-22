import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';  
import './App.css';

const App = () => {
  useEffect(() => {
    document.title = 'RA2111027020104';
  }, []);
  const [jsonData, setJsonData] = useState('');   
  const [file, setFile] = useState(null);        
  const [response, setResponse] = useState(null); 
  const [filteredResponse, setFilteredResponse] = useState(null); 
  const [error, setError] = useState('');         
  const [selectedOptions, setSelectedOptions] = useState([]); 

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' }
  ];

  const handleJsonChange = (e) => {
    setJsonData(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; 
        setFile(base64String);
      };
    }
  };

  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  const handleSubmit = async () => {
    try {
      const parsedJson = JSON.parse(jsonData);
      
      const payload = {
        data: parsedJson.data,
        file_b64: file ? file : null 
      };

      const res = await axios.post('https://ra2111027020104-bajaj-backend.onrender.com/bfhl', payload); 
      setResponse(res.data); 
      setFilteredResponse(null); 
      setError('');          
    } catch (err) {
      console.error(err);
      setError('Invalid JSON or request failed.');
    }
  };

  const applyFilters = () => {
    if (!response) return;

    if (selectedOptions.length === 0) {
      setFilteredResponse(null); 
      return;
    }

    const filtered = {};
    selectedOptions.forEach(option => {
      filtered[option.value] = response[option.value];
    });

    setFilteredResponse(filtered);
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    if (!filteredResponse) {
      return (
        <div className="response-content">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      );
    }

    const formattedResponse = Object.entries(filteredResponse).map(([key, value]) => {
      if (value && value.length) {
        return (
          <p key={key}>
            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value.join(', ')}
          </p>
        );
      }
      return null;
    });

    return formattedResponse.length ? formattedResponse : <p>No data available for the selected filters.</p>;
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Bajaj Finserv API Client</h1>
        <p>Submit data and apply filters for structured response.</p>
      </div>

      <div className="input-section">
        <h2>Input JSON</h2>
        <textarea 
          value={jsonData} 
          onChange={handleJsonChange} 
          placeholder='{"data": ["A", "B", "C", "1"]}'
        />
        
        <h2>Upload File (optional)</h2>
        <input type="file" onChange={handleFileChange} />
        
        <button onClick={handleSubmit} className="submit-btn">Submit</button>
      </div>

      {response && (
        <>
          <div className="filter-section">
            <h2>Multi Filter</h2>
            <Select 
              isMulti
              options={options}
              value={selectedOptions}
              onChange={handleSelectChange}
              placeholder="Select filters"
            />
            <button onClick={applyFilters} className="filter-btn">Apply Filters</button>
          </div>

          <div className="response-section">
            <h2>Filtered Response</h2>
            {renderFilteredResponse()}
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;

