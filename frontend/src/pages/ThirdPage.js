import React, { useState } from 'react';
import AppBarComponent from '../components/AppBarComponent.js'; 

export const ThirdPage = () => {
  const [studentId, setStudentId] = useState(''); 

  const handleInputChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // fetch(`http://localhost:5000/query-student/${studentId}`)
    //   .then(response => response.json())
    //   .then(data => {
    //     //Gimme data so that I can show
    //   })
    //   .catch(error => console.error('Error:', error));
  };

  return (
    <div className="App">
      <AppBarComponent />
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="student-id">
            Student ID:
            <input
              id="student-id"
              type="text"
              value={studentId}
              onChange={handleInputChange}
              placeholder="Enter Student ID"
              required
              style={{ marginLeft: '10px', padding: '5px' }}
            />
          </label>
          <button type="submit" style={{ marginLeft: '10px', padding: '5px 10px' }}>
            Query
          </button>
        </form>
      </div>
    </div>
  );
};


export default ThirdPage;
