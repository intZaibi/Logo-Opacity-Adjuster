"use client";
import Modal from "@/components/Modal";
import React, { useState } from "react";

export default function App() {
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState('Logo');
  const [showModal, setShowModal] = useState(false);
  const [btnTitle, setBtnTitle] = useState(null);

  const updateShowModal = (value) => {
    setShowModal(value);
  };

  // Handling initial logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
      alert('File size exceeds the 5MB limit.');
      return;
    }
    
    if (file) {
      setLogo(file);
      setShowModal(true);
      saveUploadedLogo(file);
    }
  };

  // Function to save initially uploaded logo in uploads folder
  const saveUploadedLogo = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/saveLogo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('File uploaded successfully');
        setLogoName(result.name);
        console.log(result.name)
      } else {
        alert(`Failed to upload file`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('An error occurred during file upload.');
    }
  };

  // Function to save the logo after changes 
  const saveLogo = (file)=>{
    const formData = new FormData();
    formData.append('base64Image', file);
    formData.append('fileName', logoName);

    fetch('/api/saveLogoWithOpacity', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setBtnTitle(data.name);
        setShowModal(!showModal);
        alert('Logo saved successfully');
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred during logo save.');
      });
  }

  // Function to remove the current logo
  const handleRemoveLogo = () => {
    setLogo(null); 
    setLogoName(null);
    setBtnTitle(null);
  };

  return (
    <div className="bg-gray-200 h-screen overflow-hidden">
      {/* Logo Adjustment Preview */}
      <Modal logo={logoName} showModal={showModal} setShowModal={updateShowModal} saveLogo={saveLogo}/>

      <h1 className="pl-10 pt-10 font-bold text-2xl">Logo Opacity Changer</h1>
      
      <div className="flex items-center pb-20 justify-center h-full">
        {/* Upload Button */}
        {!logo ? <button
          className="p-2 rounded-xl bg-blue-500 text-white"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Upload logo
          <input
            type="file"
            id="fileInput"
            accept=".png"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </button>:
        
        // Remove Logo btn
        <button
          className="p-2 rounded-xl bg-blue-500 text-white"
          onClick={handleRemoveLogo}
        >
          Remove logo
        </button>
        }

        {/* Open Modal Button */}
        <button
          className="p-2 rounded-xl bg-green-500 text-white ml-4"
          onClick={() => logo ? setShowModal(true) : alert('Please Uplaod the logo!')}
          disabled={btnTitle}
        >
          {btnTitle || 'Open Modal'}
        </button>

      </div>
    </div>
  );
}
