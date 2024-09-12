import React from 'react'

function Friend({image, username, location, isActive}) {
  return (
    <div className="flex gap-5 items-center">
      <div className="w-[55px] h-[55px] rounded-full">
        <img className="w-full h-full obejct-cover rounded-full" src={image} />
      </div>

      <div className="flex flex-col w-[70%]">
        <div className="flex justify-between w-full items-center">
          <p className="text-[20px] font-[700]">{username}</p>
          <div
            className={`w-[12px] h-[12px] ${
              isActive ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          />
        </div>

        <p className="text-[15px] font-[500]">{location}</p>
      </div>
    </div>
  );
}

export default Friend