import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import User from "./components/user";
import Post from "./components/Post";
import Friend from "./components/Friend";
import Suggested from "./components/Suggested";
import CreatePost from "./components/createPost";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch posts from the backend with the token
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Failed to load posts. Unauthorized or bad request.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty array ensures the effect runs only once when the component mounts

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="flex flex-col gap-10 bg-[#f3f3f3]">
      <Navbar className="shadow-md" />

      {/* MAIN HOME PAGE */}
      <div className="mx-24">
        <div className="flex flex-row w-full space-x-5 justify-center">
          {/* LEFT SECTION */}
          <User/>

          {/* MIDDLE SECTION */}
          {/* Upload Section */}
          <div className="w-[40%] h-full flex flex-col gap-5">
            <CreatePost/>

            {/* POSTS */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post._id}
                  profile={`assets/man.png`} // Adjust path as needed
                  likes={post.likes}
                  comments={post.comments}
                  username={post.firstName}
                  location={post.location}
                  attachment={post.picturePath} 
                  desc={post.description}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>

          {/* RIGHT SECTION */}
          <div className="flex flex-col gap-5 w-[25%] h-full">
            <div className="w-full h-full bg-white rounded-[25px] px-[30px] py-[20px] gap-[20px] flex flex-col">
              <p className="font-[700] text-[24px]">Friends</p>
              <Friend
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Friend
                image="assets/man.png"
                username="Sophia Martinez"
                location="Barcelona, Spain"
                isActive={true}
              />
              <Friend
                image="assets/man.png"
                username="Ethan Johnson"
                location="Sydney, Australia"
                isActive={false}
              />
              <Friend
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Friend
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Friend
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={false}
              />
            </div>
            <div className="w-full h-full bg-white rounded-[25px] px-[30px] py-[20px] gap-[20px] flex flex-col">
              <p className="font-[700] text-[24px]">Suggested for you</p>
              <Suggested
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Suggested
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Suggested
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Suggested
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
              <Suggested
                image="assets/man.png"
                username="Aarav Patel"
                location="Mumbai, India"
                isActive={true}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
