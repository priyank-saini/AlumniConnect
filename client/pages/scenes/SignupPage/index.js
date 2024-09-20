import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { TextField, Button, Input, Typography, Box } from "@mui/material";

export default function Signup() {
  const loginText = "Sign up.".split(" ");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("location", location);
    formData.append("occupation", occupation);
    if (profilePicture) {
      formData.append("picture", profilePicture);
    }

    try {
      await axios.post("http://localhost:3001/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box className="flex flex-col py-[20px] bg-white justify-center gap-10">
      {/* Logo */}
      <Box className="flex flex-col gap-5 justify-center items-center">
        <Box className="w-[120px] flex">
          <img src="assets/lnmiit.png" alt="" className="w-full h-full object-cover" />
        </Box>
        <Box className="w-[350px] flex">
          <img src="assets/logo.png" alt="" />
        </Box>
      </Box>

      <Box className="flex justify-center items-center gap-20">
        {/* Left Side */}
        <Box className="w-[28rem]">
          <Box className="flex justify-center items-center">
            <Box className="flex flex-col gap-y-8 relative justify-center items-start">
              <Typography className="Login text-zinc-700 text-4xl font-bold">
                {loginText.map((el, i) => (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, delay: i / 10 }}
                    key={i}
                  >
                    {el}{" "}
                  </motion.span>
                ))}
              </Typography>

              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <Box className="flex w-full gap-4">
                  <TextField
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <TextField
                    label="Last Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Box>

                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                  label="Location"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setLocation(e.target.value)}
                />

                <TextField
                  label="Occupation"
                  variant="outlined"
                  fullWidth
                  onChange={(e) => setOccupation(e.target.value)}
                />

                <label htmlFor="picture">
                  <Input
                    id="picture"
                    type="file"
                    style={{ display: "none" }}  // Hide the input field
                    inputProps={{ accept: "image/*" }}
                    onChange={(e) => setProfilePicture(e.target.files[0])}
                  />
                  <Button variant="contained" component="span" fullWidth>
                    Upload Profile Picture
                  </Button>
                </label>


                <Box className="flex justify-between">
                  <Link href="/signup" passHref>
                    <Typography variant="body2" color="primary">
                      New User? Sign Up
                    </Typography>
                  </Link>
                  <Link href="/login/Forget" passHref>
                    <Typography variant="body2" color="primary">
                      Forgot Password?
                    </Typography>
                  </Link>
                </Box>

                <Button type="submit" variant="contained" fullWidth>
                  Sign Up
                </Button>
              </form>

              <Button variant="outlined" className="flex gap-2" fullWidth>
                <img
                  src="assets/Google.svg"
                  alt="google"
                  className="w-[1.5rem]"
                />
                Sign in with Google
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right Side */}
        <Box className="w-1/3 ml-20 h-full">
          <img
            src="assets/loginAsset.png"
            alt="login_image"
            className="w-[80%] object-cover"
          />
        </Box>
      </Box>
    </Box>
  );
}
