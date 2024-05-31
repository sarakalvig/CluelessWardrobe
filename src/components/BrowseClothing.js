import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import './BrowseClothing.css';

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
            <header>
                <h1>CHER'S WARDROBE</h1>
                <Link to="/browse" className="header-button">BROWSE</Link>
            </header>
            <div className="clothing-container">
                <div className="clothing-item">
                    <button onClick={handlePrevTop}>&lt;&lt;</button>
                    {topClothing.length > 0 && (
                        <img src={topClothing[currentTopIndex].imageUrl} alt="Top Clothing" />
                    )}
                    <button onClick={handleNextTop}>&gt;&gt;</button>
                </div>
                <div className="clothing-item">
                    <Link to="/upload" className="side-button left">UPLOAD</Link>
                    <button onClick={handlePrevBottom}>&lt;&lt;</button>
                    {bottomClothing.length > 0 && (
                        <img src={bottomClothing[currentBottomIndex].imageUrl} alt="Bottom Clothing" />
                    )}
                    <button onClick={handleNextBottom}>&gt;&gt;</button>
                    <Link to="/list" className="side-button right">LIST</Link>
                </div>
            </div>
            <footer>
                <button className="footer-button">SHOES</button>
                <button className="footer-button">JEWELRY</button>
                <button className="footer-button">SCARVES</button>
                <button className="footer-button">PANTWHOSE</button>
                <button className="footer-button">UNDERWEAR</button>
                <button className="footer-button">PANTS</button>
                <button className="footer-button">SWEATERS</button>
                <button className="footer-button">MORE</button>
            </footer>
        </div>
    );
};

export default BrowseClothing;
