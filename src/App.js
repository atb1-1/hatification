import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import './App.css';
import logo from './catinasat_cropped_transparent.gif'; // Ensure the logo path is correct

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [hatVisible, setHatVisible] = useState(false);
  const [originalImageSize, setOriginalImageSize] = useState({ width: 0, height: 0 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setImageUrl(URL.createObjectURL(file));
        console.log("Image uploaded:", URL.createObjectURL(file));
        const img = new Image();
        img.onload = () => {
          setOriginalImageSize({ width: img.width, height: img.height });
        };
        img.src = URL.createObjectURL(file);
      };
      reader.onerror = (error) => {
        console.error("Error reading file:", error);
      };
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Failed to read file:", error);
      }
    } else {
      console.error("No file selected or file type is not supported.");
    }
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = document.getElementById('uploaded-image');
    const hat = document.getElementById('hat');
    const scaleFactor = originalImageSize.width / image.width;

    canvas.width = originalImageSize.width;
    canvas.height = originalImageSize.height;

    const hatRect = hat.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      hat,
      (hatRect.left - imageRect.left) * scaleFactor,
      (hatRect.top - imageRect.top) * scaleFactor,
      hat.clientWidth * scaleFactor,
      hat.clientHeight * scaleFactor
    );

    const link = document.createElement('a');
    link.download = 'profile_with_hat.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Cats•In•The•Sats Hatification!</h1>
      </header>
      <main className="App-main">
        <form className="App-form">
          <label htmlFor="profile-picture" className="App-file-label">
            Choose PFP
          </label>
          <input type="file" id="profile-picture" className="App-file-input" accept="image/jpeg, image/png, image/webp" onChange={handleImageUpload} required />
        </form>
        {uploadedImage && (
          <div className="App-image-container">
            <div id="profile-picture-container">
              <img id="uploaded-image" src={imageUrl} alt="Profile" onLoad={() => setHatVisible(true)} onError={(e) => console.error('Uploaded image load error', e)} />
              {hatVisible && (
                <Rnd
                  default={{
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100,
                  }}
                  bounds="parent"
                  lockAspectRatio
                  minWidth={50}
                  minHeight={50}
                  maxWidth={300}
                  maxHeight={300}
                  style={{ zIndex: 10 }}
                  dragHandleClassName="handle"
                  enableResizing={{
                    bottomRight: true,
                  }}
                >
                  <img
                    id="hat"
                    src="/static/hat.png"
                    alt="Hat"
                    className="handle"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                    onLoad={() => console.log("Hat loaded")}
                    onError={(e) => console.error('Hat image load error', e)}
                  />
                </Rnd>
              )}
            </div>
            <button className="App-button" onClick={saveImage}>Save</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
