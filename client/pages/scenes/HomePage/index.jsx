import axios from "axios";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

// Components Import
import Navbar from "../Navbar";
import User from "./Components/User";
import Post from "./Components/Post";
import Friend from "./Components/Friend";
import Suggested from "./Components/Suggested";
import CreatePost from "./Components/CreatePost";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setLogin } from "@/pages/state";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const { _id, picturePath } = useSelector((state) => state.user ?? {});
  const token = useSelector((state) => state.token ?? {});

  if (!token) {
    router.push("/");
  }

  useEffect(() => {
    if (router.isReady) {
      const { token, user } = router.query;
      console.log({token, user});

      if (token && user) {
        // Store token in localStorage
        localStorage.setItem("token", token);

        // Parse and dispatch user data
        const parsedUser = JSON.parse(decodeURIComponent(user));
        dispatch(setLogin({ user: parsedUser, token: token }));

        // Optionally redirect to another page or handle authentication state
        router.push("/home");
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    const fetchPosts = async () => {
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
      } catch (err) {
        setError("Failed to load posts. Unauthorized or bad request.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/users/${_id}/friends`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFriends(response.data);
      } catch (err) {
        setError("Failed to load friends. Unauthorized or bad request.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchSuggested = async () => {
      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3001/users/${_id}/suggested`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggested(response.data);
      } catch (err) {
        setError(
          "Failed to load suggested friends. Unauthorized or bad request."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSuggested();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="flex flex-col gap-10 bg-[#f3f3f3]">
      <Navbar className="shadow-md" />

      {/* MAIN HOME PAGE */}
      <div className="mx-24">
        <div className="flex flex-row w-full space-x-5 justify-center">
          {/* LEFT SECTION */}
          <User userId={_id} picturePath={picturePath} />

          {/* MIDDLE SECTION */}
          {/* Upload Section */}
          <div className="w-[40%] h-full flex flex-col gap-5">
            <CreatePost
              userId={_id}
              picturePath={picturePath}
              setPosts={setPosts}
            />

            {/* POSTS */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post
                  key={post._id}
                  userId={_id}
                  token={token}
                  postId={post._id}
                  profile={post.userPicturePath}
                  likes={post.likes}
                  comments={post.comments}
                  username={post.firstName + " " + post.lastName}
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
              {/* Friends */}
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <Friend
                    key={friend._id}
                    picturePath={friend.picturePath}
                    firstName={friend.firstName}
                    lastName={friend.lastName}
                    location={friend.location}
                    isActive={true}
                  />
                ))
              ) : (
                <p>No Friends to show!</p>
              )}
            </div>
            <div className="w-full h-full bg-white rounded-[25px] px-[30px] py-[20px] gap-[20px] flex flex-col">
              <p className="font-[700] text-[24px]">Suggested for you</p>
              {/* Suggested */}
              {suggested.length > 0 ? (
                suggested.map((user) => (
                  <Suggested
                    key={user._id}
                    token={token}
                    currentUserId={_id}
                    friendUserId={user._id}
                    picturePath={user.picturePath}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    location={user.location}
                  />
                ))
              ) : (
                <p>No Suggested friends to show!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
