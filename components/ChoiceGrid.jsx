import React from "react";

export default function ChoiceGrid() {
  return (
    <div className="grid grid-cols-3 gap-4 w-[60%]">
      <div className="relative border-sky-600 col-span-1 h-14 w-14 border rounded-xl border-dashed">
        <div className="absolute w-2 h-full bg-sky-600 left-[42%]"></div>
        <div className="absolute w-full h-2 bg-sky-600 top-[45%]"></div>
      </div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
      <div className="col-span-1 h-14 w-14 border border-black rounded-xl border-dashed"></div>
    </div>
  );
}
