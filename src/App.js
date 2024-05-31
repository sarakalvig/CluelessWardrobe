import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrowseClothing from './components/BrowseClothing';
import ClothingItemUpload from './components/ClothingItemUpload';
import ClothingItemList from './components/ClothingItemList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/browse" element={<BrowseClothing />} />
                <Route path="/upload" element={<ClothingItemUpload />} />
                <Route path="/list" element={<ClothingItemList />} />
                <Route path="/" element={<BrowseClothing />} />
            </Routes>
        </Router>
    );
}

export default App;
