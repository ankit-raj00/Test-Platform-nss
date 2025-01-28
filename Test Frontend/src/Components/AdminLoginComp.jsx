import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminlogin  } from '../Store/authslice';
import Button from './Button';
import Input from './Input';
import Logo from './Logo';
import { useDispatch } from "react-redux";
import adminService from '../Backend/adminAuth'; // Updated import for adminService
import { useForm } from "react-hook-form";

function AdminLoginComp() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [serverError, setServerError] = useState("");

    const login = async (data) => {
        console.log("Admin Login button clicked");
        setServerError(""); // Reset server error before login attempt
        try {
            // Perform login using adminService
            const session = await adminService.loginAdmin(data);
            if (session) {
                const adminData = await adminService.getCurrentAdmin();
                if (adminData) {
                    // Dispatch login action to Redux store
                    dispatch(adminlogin({adminData}));
                }
                // Navigate to the admin dashboard upon successful login
                navigate("/admin-dash");
            }
        } catch (error) {
            // Set error message from API response
            setServerError(error || "An error occurred during login");
        }
    };

    return (
        <div className='flex items-center justify-center w-full min-h-screen'>
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 shadow-md">
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">
                    Admin Sign In
                </h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have an admin account?&nbsp;
                    <Link
                        to="/admin-dash/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign Up
                    </Link>
                </p>

                {serverError && (
                    <p className="text-red-600 mt-4 text-center">
                        {serverError}
                    </p>
                )}

                <form onSubmit={handleSubmit(login)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Invalid email address",
                                },
                            })}
                            error={errors.email?.message}
                        />

                        <Input
                            label="Enrollment Number"
                            placeholder="Enter your enrollment number"
                            type="text"
                            {...register("enroll", {
                                required: "Enrollment number is required",
                            })}
                            error={errors.enroll?.message}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                            error={errors.password?.message}
                        />

                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Signing in..." : "Sign in"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminLoginComp;
