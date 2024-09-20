import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "@/pages/state"; // Make sure this path is correct
import { TextField, Button, Alert } from "@mui/material";

export default function Login() {
    const loginText = "Sign in.".split(" ");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    // Handle Google OAuth redirection to backend
    const handleGoogleAuth = async (e) => {
        e.preventDefault();
        try {
            // Redirect to the backend Google authentication endpoint
            window.location.href = "http://localhost:3001/auth/google";
        } catch (error) {
            console.log("Error in Google auth: ", error);
        }
    }

    // Handle traditional email/password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/auth/login", { email, password });
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                dispatch(setLogin({
                    user: response.data.user,
                    token: response.data.token,
                }));
                router.push("/home");
            } else {
                setError("Invalid email or password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
            console.error(err);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white justify-center gap-10">
            {/* Logo */}
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="w-[120px] flex">
                    <img src="assets/lnmiit.png" alt="" />
                </div>
                <div className="w-[350px] flex">
                    <img src="assets/logo.png" alt="" />
                </div>
            </div>

            <div className="flex justify-center items-center">
                {/* Left Side */}
                <div className="w-1/3 ml-20 h-full">
                    <img
                        src="assets/loginAsset.png"
                        alt="login_image"
                        className="w-[80%] object-cover"
                    />
                </div>
                {/* Right Side */}
                <div className="w-1/2">
                    <div className="flex justify-center items-center">
                        <div className="flex flex-col gap-y-8 relative justify-center items-start">
                            <div className="Login text-zinc-700 text-4xl font-bold">
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
                            </div>
                            <form className="flex flex-col gap-6 w-[400px]" onSubmit={handleSubmit}>
                                {error && <Alert severity="error">{error}</Alert>}
                                <TextField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <TextField
                                    label="Password"
                                    type="password"
                                    name="password"
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <div className="flex w-full flex-row justify-between">
                                    <Link
                                        href="/signup"
                                        className="text-blue-700 underline underline-offset-auto font-normal text-sm"
                                    >
                                        New User? Sign Up
                                    </Link>
                                    <Link
                                        href="/login/Forget"
                                        className="text-blue-700 underline underline-offset-auto font-normal text-sm"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{ backgroundColor: "#0056FE", '&:hover': { backgroundColor: "#0044CC" }, color: "white", fontStyle: "bold" }}
                                >
                                    Sign in
                                </Button>
                            </form>

                            <Button
                                fullWidth
                                size="large"
                                variant="outlined"
                                sx={{ color: "#0056FE" }}
                                onClick={handleGoogleAuth}
                                startIcon={<img src="assets/Google.svg" alt="google" style={{ width: "1.5rem" }} />}
                            >
                                Sign in with Google
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
