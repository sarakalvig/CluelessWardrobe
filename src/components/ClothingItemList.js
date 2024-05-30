import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import './ClothingItemList.css';

const ClothingItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'clothing'));
      const clothingItems = querySnapshot.docs.map(doc => doc.data());
      setItems(clothingItems);
    };

    fetchData();
  }, []);

  return (
    <div className="list-container">
      <h1>Clothing Items List</h1>
      <div className="items">
        {items.map((item, index) => (
          <div key={index} className="item">
            <img src={item.url} alt={`clothing item ${index}`} />
            <p>Category: {item.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClothingItemList;
