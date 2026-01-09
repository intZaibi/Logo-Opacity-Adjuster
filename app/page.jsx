"use client";
import Modal from "@/components/Modal";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function App() {
  const [logo, setLogo] = useState(null);
  const [logoURL, setLogoURL] = useState("");
  const [logoName, setLogoName] = useState('Logo');
  const [showModal, setShowModal] = useState(false);
  const [btnTitle, setBtnTitle] = useState(null);

  const updateShowModal = (value) => {
    setShowModal(value);
  };

  // Handling initial logo file upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { // Limit file size to 5MB
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    const logoUrl = URL.createObjectURL(file);
    
    if (file) {
      setLogo(file);
      setLogoURL(logoUrl);
      setShowModal(true);
      saveLogo(file);
    }
  };

  const router = useRouter();

  // Clean up the object URL when component unmounts or logo changes
  useEffect(() => {
    return () => {
      if (logoURL) {
        URL.revokeObjectURL(logoURL);
      }
    };
  }, [logoURL]);

  // Function to save initially uploaded logo in uploads folder
  const saveLogo = async (file) => {

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/saveLogo', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 429) {
        toast.error('Upload limit exceeded');
        router.push('/notAllowed');
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setLogoName(result.name);
      }
    } catch (error){
      // Logic to handle error
    }
  };

  // Function to remove the current logo
  const handleRemoveLogo = () => {
    setLogo(null);
    setLogoURL(""); 
    setLogoName(null);
    setBtnTitle(null);
  };

  return (
    <div className="bg-gray-200 h-screen overflow-hidden">
      {/* Logo Adjustment Preview */}
      <Modal logo={logoURL} logoName={logoName} showModal={showModal} setShowModal={updateShowModal}/>

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
