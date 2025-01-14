import LandscapeGrid from '@/components/LandscapeGrid'
import PortraitGrid from '@/components/PortraitGrid'
import { useState } from 'react'

export default function Modal({logo, showModal, setShowModal, saveLogo}) {
  const [opacity, setOpacity] = useState(100);
  const [choice, setChoice] = useState(1);
  
  const handleChoice = (e) => {
    setChoice(Number(e.target.id));
  }

  const normalClasses = 'cursor-pointer col-span-1 h-14 w-14 border border-black rounded-xl border-dashed'
  const selectedClasses = 'cursor-pointer col-span-1 h-14 w-14 border relative border-sky-600 rounded-xl border-dashed'
  const innerChild = [<div className="absolute w-1 h-full bg-sky-600 left-[47%]"></div>,
      <div className="absolute w-full h-1 bg-sky-600 top-[47%]"></div>
    ]

  const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  // Using a canvas element to generate the logo with set opacity
  const handleSaveLogo = async () => {

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = `/uploads/${logo}`;
    img.onload = () => {

      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.globalAlpha = opacity / 100;
      ctx.drawImage(img, 0, 0);

      const base64Image = canvas.toDataURL("image/png");

      saveLogo(base64Image);
    };
  };

  return (
    // Modal full screen wrapper
    <div className={`overflow-hidden absolute bg-black bg-opacity-40 w-full h-full flex items-center justify-center ${showModal ? 'block' : 'hidden'}`}>
      
      {/* Modal container */}
      <div className={`modal-enter modal-enter-active h-[75%] w-[70%] p-8 rounded-xl opacity-100 flex flex-col bg-white lg:overflow-hidden overflow-x-hidden overflow-y-auto`}>
        
        {/* Modal Heading */}
        <div className='flex justify-between mb-1'>
          <h1 className='font-bold text-xl'>Water Mark</h1>
          <div className='w-5 h-4 cursor-pointer' onClick={() => setShowModal(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
          </div>
        </div>

        {/* other components wrapper */}
        <div className='lg:flex flex-col lg:flex-row w-full h-full justify-center items-center gap-8'>
          {/* portrait and landscape preview component */}
          <div className="lg:h-[90%] h-full lg:w-[75%] flex items-center lg:items-start lg:flex-row flex-col gap-4">
            <PortraitGrid logo={logo} choice={choice} opacity={opacity}/>
            <LandscapeGrid logo={logo} choice={choice} opacity={opacity}/>
          </div>

          {/* Right Side Components wrapper */}
          <div className="lg:w-[40%] flex flex-col gap-3">

            {/* Choice Grid */}
            <h1 className='font-bold text-lg'>Position</h1>
            <div className="grid grid-cols-3 gap-4 lg:w-[60%]">
              {positions.map((i) => <div key={i+" in positions"} id={i} onClick={handleChoice} className={`${choice === i ? selectedClasses : normalClasses}`}>{
                choice === i ? innerChild : null
              }</div>)}
            </div>

              {/* Opacity Input Range */}
            <div className="flex flex-col gap-4 mb-6">
                <h1 className='font-bold text-lg'>Opacity</h1>
              <label htmlFor="opacity" className='flex items-center gap-4 pr-1 mb-6'>
                <input type="range" className='w-full' value={opacity} onChange={(e)=>setOpacity(e.target.value)}/>
                <h1 className='font-bold'>{opacity}</h1>
              </label>
              
              {/* Save Button */}
              <button onClick={()=>handleSaveLogo()} className='border-none flex justify-center font-semibold bg-sky-600 py-3 px-6 rounded-xl w-full text-white'>
                <div className='w-6 h-6 mr-3 inline-block'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill='white' d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>
                </div>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}
