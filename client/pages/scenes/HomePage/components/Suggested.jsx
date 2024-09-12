import React from "react";

function Suggested({ image, username, location }) {
  return (
    <div className="flex gap-5 items-center">
      <div className="w-[55px] h-[55px] rounded-full">
        <img className="w-full h-full obejct-cover rounded-full" src={image} />
      </div>

      <div className="flex w-[70%] justify-between items-center">
        <div>
          <p className="text-[20px] font-[700]">{username}</p>
          <p className="text-[15px] font-[500]">{location}</p>
        </div>

        <button className="w-[40px] h-[40px] bg-[#eaeaea] rounded-full flex justify-center items-center">
            <img src="assets/add-friend.png" className="obejct-cover w-[28px] h-[28px]"/>
        </button>
      </div>
    </div>
  );
}

export default Suggested;
