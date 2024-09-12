import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";

function CreatePost() {
  const { _id } = useSelector((state) => state.user); // Get user ID from Redux
  const token = useSelector((state) => state.token); // Get token from Redux
  const [desc, setDesc] = useState(""); // Post description
  const [picture, setPicture] = useState(null); // File state
  const [error, setError] = useState(null); // Error handling
  const [successMessage, setSuccessMessage] = useState(null); // Success message handling

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!token || !_id) {
      setError("No authentication token or user ID found.");
      return;
    }

    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", desc);
    if (picture) {
      formData.append("picture", picture);
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", 
          },
        }
      );

      // Handle successful response
      console.log(response.data);
      console.log("Post created with picture path:", response.data.picturePath);
      setSuccessMessage("Post created successfully!");
      setDesc(""); // Clear description
      setPicture(null); // Clear selected file
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the post."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      method="post"
      enctype="multipart/form-data"
      action="/home"
      className="w-full h-full bg-white rounded-[25px] flex flex-col gap-5 px-[30px] py-[20px]"
    >
      <div>
        <div className="flex flex-row justify-between">
          {/* Profile */}
          <div className="w-[60px] h-[60px] rounded-full">
            <img
              src="assets/man.png"
              className="w-full h-full object-cover rounded-full"
              alt="Profile"
            />
          </div>

          {/* What's Happening */}
          <input
            type="text"
            value={desc} // Bind value to state
            onChange={(e) => setDesc(e.target.value)}
            placeholder="What's on your mind?"
            className="px-[10px] py-[5px] w-[85%] h-[60px] bg-[#eeeeee] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        {/* Upload Section */}
        <label className="flex gap-2 items-center cursor-pointer">
          <img
            src="assets/upload.png"
            className="w-[25px] h-[25px]"
            alt="Upload"
          />
          <span className="text-[16px]">Photos</span>
          <input
            type="file"
            name="picture"
            onChange={(e) => setPicture(e.target.files[0])}
            className="hidden"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-[#000AFF] rounded-[25px] px-[20px] py-[10px] font-bold text-[16px] text-white"
        >
          Post
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && (
        <p className="text-green-500">{successMessage}</p>
      )}{" "}
      {/* Display success message */}
    </form>
  );
}

export default CreatePost;
