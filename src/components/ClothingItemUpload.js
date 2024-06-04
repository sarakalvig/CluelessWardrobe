import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import './ClothingItemUpload.css';
import '../App.css';

const ClothingItemUpload = () => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('top');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleUpload = async () => {
    if (file) {
      const storageRef = ref(storage, `${category}Clothing/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle progress if needed
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, `${category}Clothing`), {
            imageUrl: downloadURL,
            name: file.name,
          });
          navigate('/browse');
        }
      );
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Clothing Item</h1>
        <input type="file" onChange={handleFileChange} />
        <div>
          <label>
            <input
              type="radio"
              value="top"
              checked={category === 'top'}
              onChange={handleCategoryChange}
            />
            Top Clothing
          </label>
          <label>
            <input
              type="radio"
              value="bottom"
              checked={category === 'bottom'}
              onChange={handleCategoryChange}
            />
            Bottom Clothing
          </label>
        </div>
        <div className="button-container">
          <button onClick={handleUpload}>Upload</button>
        </div>
      </div>
    </div>
  );
};

export default ClothingItemUpload;
