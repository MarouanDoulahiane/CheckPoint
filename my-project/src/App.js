import './App.css';
import NavBar from './components/NavBar';
import { useState } from 'react';
import React from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [groqResponse, setGroqResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file");
      return;
    }

    setGroqResponse(null); // Reset state before fetching
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setGroqResponse(data.groqResponse);
      } else {
        alert("Error uploading file, reason: " + response.statusText);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div>
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex justify-between border-b border-gray-300 py-2">
              <strong className="text-gray-700">{key}:</strong>
              <span className="text-gray-600">{renderValue(val)}</span>
            </div>
          ))}
        </div>
      );
    }
    return String(value); // Fallback to string conversion for other types
  };

  return (
    <div className="App">
      <NavBar />
      <div className="mx-auto max-w-screen-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Upload Your Resume
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Upload your resume and get a summary of your skills and experiences.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center">
          <input
            type="file"
            accept=".pdf"
            className="w-full p-3 border border-gray-400 rounded-md shadow-md hover:border-blue-500 transition duration-200"
            onChange={(e) => {
              const files = e.target.files;
              setFile(files && files.length > 0 ? files[0] : null);
            }}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-200"
          >
            Upload
          </button>
        </form>
        {groqResponse && (
          <div className="flex flex-col gap-4 mt-6">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              {renderValue(groqResponse)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
