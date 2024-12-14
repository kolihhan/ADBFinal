import React, { useState } from 'react';
import AppBarComponent from '../components/AppBarComponent.js';

export const ThirdPage = () => {
  const [studentId, setStudentId] = useState('');
  const [studentInfo, setStudentInfo] = useState(null);  // To store the fetched student info
  const [error, setError] = useState(null);  // To store any error message

  const handleInputChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Create FormData to send the student_id as form data
    const formData = new FormData();
    formData.append('student-id', studentId);  // Add student ID as form data

    // Make the POST request to the Flask backend
    fetch('http://localhost:5000/post_query_student', {
      method: 'POST',
      body: formData,  // Send form data in the body of the request
    })
      .then((response) => {
        // Log the response status and body for debugging
        console.log('Response Status:', response.status);  // Log the status code
        return response.json();
      })
      .then((data) => {
        console.log('Response Data:', data);  // Log the response data

        if (data.error) {
          setError(data.error);  // Set error if the backend returns an error
          setStudentInfo(null);  // Reset student info
        } else {
          setStudentInfo(data.info);  // Set student info
          setError(null);  // Reset any error
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching data.');
        console.error('Error:', error);
      });
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

        {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error message */}
        {studentInfo && (
          <div style={{ marginTop: '20px' }}>
            <h3>Student Information</h3>
            <pre>{JSON.stringify(studentInfo, null, 2)}</pre>  {/* Display student info */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdPage;
