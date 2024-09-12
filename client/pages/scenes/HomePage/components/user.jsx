import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"; 

function User() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { _id, picturePath } = useSelector((state) => state.user); 

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/users/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
        setUserData(response.data); 
      } catch (error) {
        console.log(error);
        setError(error.message || "An error occurred.");
      } finally {
        setLoading(false); 
      }
    };

    if (_id) {
      getUser();
    }
  }, [_id]); 

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="w-[20%] h-full bg-white rounded-[25px] py-[20px] flex flex-col gap-6 items-center">
      <div className="w-[165px] h-[165px] rounded-full mt-10">
        {/* PROFILE PIC */}
        <img
          src="assets/man.png"
          className="w-full h-full object-cover rounded-full"
        ></img>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1 justify-center items-center">
        <p className="text-[24px] font-[600] text-gray-900">{userData.firstName + userData.lastName}</p>
        {/* <p className="text-[15px] font-[400] text-[#636363]">
          Apple CEO, National Parks
        </p> */}
      </div>

      {/* Button */}
      <button className="w-[70%] h-[50px] rounded-md bg-white border-2 border-[#636363]">
        <p className="text-[16px] font-medium text-[#636363]">Edit Profile</p>
      </button>

      {/* Followers */}
      <div className="flex flex-row gap-4 justify-center items-center">
        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-[20px] font-bold">103</p>
          <p className="text-[14px] font-normal">Posts</p>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-[20px] font-bold">{userData.viewedProfile}</p>
          <p className="text-[14px] font-normal">Viewed Profile</p>
        </div>

        <div className="flex flex-col gap-2 justify-center items-center">
          <p className="text-[20px] font-bold">{userData.impressions}</p>
          <p className="text-[14px] font-normal">Impressions</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex flex-col items-center gap-1">
        <p className="font-[600] text-[18px]">{userData.location || "Data not Available"}</p>
        <p className="font-[300] text-[16px]">Location</p>
      </div>

      {/* Occupation */}
      <div className="flex flex-col items-center gap-1">
        <p className="font-[600] text-[18px]">{userData.occupation || "Data not Available"}</p>
        <p className="font-[300] text-[16px]">Occupation</p>
      </div>
    </div>
  );
}

export default User;
