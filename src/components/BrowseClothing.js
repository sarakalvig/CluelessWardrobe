import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import './BrowseClothing.css';
import '../App.css';

const BrowseClothing = () => {
  const [topClothing, setTopClothing] = useState([]);
  const [bottomClothing, setBottomClothing] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0);
  const [isTopPaused, setIsTopPaused] = useState(false);
  const [isBottomPaused, setIsBottomPaused] = useState(false);

  useEffect(() => {
    const qTop = query(collection(db, 'topClothing'));
    const qBottom = query(collection(db, 'bottomClothing'));

    const unsubscribeTop = onSnapshot(qTop, (querySnapshot) => {
      setTopClothing(querySnapshot.docs.map(doc => doc.data()));
    });

    const unsubscribeBottom = onSnapshot(qBottom, (querySnapshot) => {
      setBottomClothing(querySnapshot.docs.map(doc => doc.data()));
    });

    return () => {
      unsubscribeTop();
      unsubscribeBottom();
    };
  }, []);

  const handleNextTop = () => {
    if (!isTopPaused) {
      setCurrentTopIndex((prevIndex) => (prevIndex + 1) % topClothing.length);
    }
  };

  const handlePrevTop = () => {
    if (!isTopPaused) {
      setCurrentTopIndex((prevIndex) => (prevIndex - 1 + topClothing.length) % topClothing.length);
    }
  };

  const handleNextBottom = () => {
    if (!isBottomPaused) {
      setCurrentBottomIndex((prevIndex) => (prevIndex + 1) % bottomClothing.length);
    }
  };

  const handlePrevBottom = () => {
    if (!isBottomPaused) {
      setCurrentBottomIndex((prevIndex) => (prevIndex - 1 + bottomClothing.length) % bottomClothing.length);
    }
  };

  const handlePauseTop = () => {
    setIsTopPaused(!isTopPaused);
  };

  const handlePauseBottom = () => {
    setIsBottomPaused(!isBottomPaused);
  };

  return (
    <div className="browse-container">
      <div className="column">
        <div className="row">
          {topClothing.length > 0 && (
            <img src={topClothing[currentTopIndex]?.imageUrl} alt="Top Clothing" />
          )}
        </div>
        <div className="row buttons-container">
          <button onClick={handlePrevTop}>{'\u25C0\u25C0'}</button> {/* Two reversed play icons */}
          <button className="select-button" onClick={handlePauseTop}>{isTopPaused ? '\u25B6' : '\u2016'}</button> {/* Play/Pause icon */}
          <button onClick={handleNextTop}>{'\u25B6\u25B6'}</button> {/* Two play icons */}
        </div>
        <div className="row">
          {bottomClothing.length > 0 && (
            <img src={bottomClothing[currentBottomIndex]?.imageUrl} alt="Bottom Clothing" />
          )}
        </div>
        <div className="row buttons-container">
          <button onClick={handlePrevBottom}>{'\u25C0\u25C0'}</button> {/* Two reversed play icons */}
          <button className="select-button" onClick={handlePauseBottom}>{isBottomPaused ? '\u25B6' : '\u2016'}</button> {/* Play/Pause icon */}
          <button onClick={handleNextBottom}>{'\u25B6\u25B6'}</button> {/* Two play icons */}
        </div>
      </div>
    </div>
  );
};

export default BrowseClothing;
