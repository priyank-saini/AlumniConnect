"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setLogin } from "@/pages/state";

export default function Login() {
    const loginText = "Sign in.".split(" "); 
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/auth/login", { email, password });
            console.log(response.data);
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

    { error && <p className="text-red-500">{error}</p> }

    return (
        <div className="flex flex-col h-screen bg-white justify-center gap-10">
            {/* Logo */}
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="w-[150px] flex">
                    <img src="assets/lnmiit.png" alt="" />
                </div>
                <div className="w-[400px] flex">
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
                        <div className="flex flex-col gap-y-10 relative justify-center items-start">
                            <div className="Login text-zinc-700 text-5xl font-bold">
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
                            <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your username or email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="px-4 h-[4rem] w-[30rem] font-normal text-1xl shadow-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="px-4 h-[4rem] w-[30rem] font-normal text-1xl shadow-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500  rounded-md"
                                />

                                <div className="flex w-[30rem] flex-row justify-between">
                                    <Link
                                        href="/signup"
                                        className="text-blue-700 underline underline-offset-auto font-normal"
                                    >
                                        New User? Sign Up
                                    </Link>
                                    <Link
                                        href="/login/Forget"
                                        className="text-blue-700 underline underline-offset-auto font-normal"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                                <button type="submit" className="h-[4rem] w-[30rem] font-bold text-2xl bg-[#0056FE] hover:bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md text-white shadow-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    Sign in
                                </button>
                            </form>

                            <button className="flex justify-center items-center gap-4 h-[4rem] w-[30rem] font-regular text- 2xl bg-white rounded-md shadow-md border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                <img src="assets/Google.svg" alt="google" className="w-[2rem]" />
                                Sign in with Google
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
