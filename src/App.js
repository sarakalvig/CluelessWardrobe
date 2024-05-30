import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ClothingItemUpload from './components/ClothingItemUpload';
import ClothingItemList from './components/ClothingItemList';
import BrowseClothing from './components/BrowseClothing';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <nav>
          <a href="/upload">Upload</a>
          <a href="/list">List</a>
          <a href="/browse">Browse</a>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<ClothingItemUpload />} />
          <Route path="/list" element={<ClothingItemList />} />
          <Route path="/browse" element={<BrowseClothing />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
