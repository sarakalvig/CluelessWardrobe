import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import BrowseClothing from './components/BrowseClothing';
import ClothingItemList from './components/ClothingItemList';
import ClothingItemUpload from './components/ClothingItemUpload';
import './index.css';
import './App.css';

const Header = () => (
  <header className="header">
    <div className="header-content">
      <nav>
        <Link to="/upload">UPLOAD</Link>
        <Link to="/list">LIST</Link>
        <Link to="/browse">BROWSE</Link>
      </nav>
    </div>
  </header>
);

const Footer = () => (
  <footer className="footer">
    <span className="more-text">MORE</span>
  </footer>
);

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<ClothingItemUpload />} />
            <Route path="/list" element={<ClothingItemList />} />
            <Route path="/browse" element={<BrowseClothing />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
