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
        setCurrentTopIndex((prevIndex) => (prevIndex + 1) % topClothing.length);
    };

    const handlePrevTop = () => {
        setCurrentTopIndex((prevIndex) => (prevIndex - 1 + topClothing.length) % topClothing.length);
    };

    const handleNextBottom = () => {
        setCurrentBottomIndex((prevIndex) => (prevIndex + 1) % bottomClothing.length);
    };

    const handlePrevBottom = () => {
        setCurrentBottomIndex((prevIndex) => (prevIndex - 1 + bottomClothing.length) % bottomClothing.length);
    };

    return (
        <div className="browse-container">
            <div className="column">
                <div className="row">
                    {topClothing.length > 0 && (
                        <img src={topClothing[currentTopIndex].imageUrl} alt="Top Clothing" />
                    )}
                </div>
                <div className="row buttons-container">
                    <div className="row buttons">
                        <button onClick={handlePrevTop}>&lt;&lt; Prev</button>
                        <button onClick={handleNextTop}>Next &gt;&gt;</button>
                    </div>
                </div>
                <div className="row">
                    {bottomClothing.length > 0 && (
                        <img src={bottomClothing[currentBottomIndex].imageUrl} alt="Bottom Clothing" />
                    )}
                </div>
                <div className="row buttons-container">
                    <div className="row buttons">
                        <button onClick={handlePrevBottom}>&lt;&lt; Prev</button>
                        <button onClick={handleNextBottom}>Next &gt;&gt;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrowseClothing;
