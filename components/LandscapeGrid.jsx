import Image from "next/image";
import React from "react";

export default function LandscapeGrid({logo, choice, opacity }) {
  const imgElement = <Image style={{ opacity : opacity/100 }} src={`/uploads/${logo}`} width={60} height={60} alt='logo'/>
  const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    // wrapper for landscape grid
    <div className="lg:w-[60%] h-full flex flex-col lg:justify-end">
      {/* Heading */}
      <h1 className="font-bold text-lg mb-4 text-center">Landscape</h1>
      {/* Grid container */}
      <div className={`grid h-[55%] ${ choice === 1 || choice === 2 || choice === 3 ? 'items-start' : choice === 4 || choice === 5 || choice === 6 ? 'items-center' : 'items-end' } grid-cols-3 gap-4 bg-cyan-100 rounded-xl p-5`}>
        {/* Grid Cells */}
        {positions.map((i) => (
          <div key={i+" in positions"} id={i} className={`flex ${ choice === 1 || choice === 4 || choice === 7 ? 'justify-start' : choice === 2 || choice === 5 || choice === 8 ? 'justify-center' : 'justify-end' } col-span-1`}>
            {choice === i ? imgElement : null} {/* Image element in choosen cell */}
          </div>
        ))}
      </div>
    </div>
  );
}
