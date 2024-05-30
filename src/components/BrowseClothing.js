import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './BrowseClothing.css';

const BrowseClothing = () => {
  const [topClothing, setTopClothing] = useState([]);
  const [bottomClothing, setBottomClothing] = useState([]);
  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);

  useEffect(() => {
    const fetchClothingItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'clothing'));
      const topItems = [];
      const bottomItems = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        if (item.category === 'top') {
          topItems.push(item);
        } else if (item.category === 'bottom') {
          bottomItems.push(item);
        }
      });
      setTopClothing(topItems);
      setBottomClothing(bottomItems);
    };

    fetchClothingItems();
  }, []);

  const handleNextTop = () => {
    setTopIndex((prevIndex) => (prevIndex + 1) % topClothing.length);
  };

  const handlePrevTop = () => {
    setTopIndex((prevIndex) => (prevIndex - 1 + topClothing.length) % topClothing.length);
  };

  const handleNextBottom = () => {
    setBottomIndex((prevIndex) => (prevIndex + 1) % bottomClothing.length);
  };

  const handlePrevBottom = () => {
    setBottomIndex((prevIndex) => (prevIndex - 1 + bottomClothing.length) % bottomClothing.length);
  };

  return (
    <div className="browse-container">
      <h1>Browse Clothing</h1>
      {topClothing.length > 0 && (
        <div className="clothing-display">
          <button onClick={handlePrevTop}>Previous Top</button>
          <img src={topClothing[topIndex].url} alt="Top Clothing" className="clothing-item" />
          <button onClick={handleNextTop}>Next Top</button>
        </div>
      )}
      {bottomClothing.length > 0 && (
        <div className="clothing-display">
          <button onClick={handlePrevBottom}>Previous Bottom</button>
          <img src={bottomClothing[bottomIndex].url} alt="Bottom Clothing" className="clothing-item" />
          <button onClick={handleNextBottom}>Next Bottom</button>
        </div>
      )}
    </div>
  );
};

export default BrowseClothing;
