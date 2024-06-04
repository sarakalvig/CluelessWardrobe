import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import './ClothingItemList.css';

const ClothingItemList = () => {
  const [topClothing, setTopClothing] = useState([]);
  const [bottomClothing, setBottomClothing] = useState([]);

  useEffect(() => {
    const qTop = query(collection(db, 'topClothing'));
    const qBottom = query(collection(db, 'bottomClothing'));

    const unsubscribeTop = onSnapshot(qTop, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log('Top Clothing Items:', items); // Debugging
      setTopClothing(items);
    });

    const unsubscribeBottom = onSnapshot(qBottom, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      console.log('Bottom Clothing Items:', items); // Debugging
      setBottomClothing(items);
    });

    return () => {
      unsubscribeTop();
      unsubscribeBottom();
    };
  }, []);

  const handleDelete = async (item, category) => {
    console.log('Attempting to delete:', item); // Debugging
    const itemRef = ref(storage, `${category}Clothing/${item.name}`);
    console.log('Storage reference:', itemRef); // Debugging
    try {
      await deleteObject(itemRef);
      await deleteDoc(doc(db, `${category}Clothing`, item.id));
      alert('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item: ', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="list-container">
      <div className="list-content">
        <h1>Top Clothing Items</h1>
        <div className="clothing-items">
          {topClothing.map((item) => (
            <div key={item.id} className="clothing-item">
              <img src={item.imageUrl} alt="Top Clothing" />
              <p>{item.name}</p>
              <button onClick={() => handleDelete(item, 'top')}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <div className="list-content">
        <h1>Bottom Clothing Items</h1>
        <div className="clothing-items">
          {bottomClothing.map((item) => (
            <div key={item.id} className="clothing-item">
              <img src={item.imageUrl} alt="Bottom Clothing" />
              <p>{item.name}</p>
              <button onClick={() => handleDelete(item, 'bottom')}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClothingItemList;
