import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    ArrowRightIcon, 
    CheckCircleIcon, 
    CloudIcon, 
    DevicePhoneMobileIcon, 
    GlobeAltIcon, 
    ListBulletIcon, 
    ArrowPathIcon,
    EyeIcon,
    EyeSlashIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import api from "../services/api"
import Notification from '../components/Notification';

function LandingPage(){
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const validateForm = (formData, isLogin = false) => {
        const errors = {};
        
        if (!isLogin) {
            if (!formData.name?.trim()) {
                errors.name = 'Name is required';
            }
        }

        if (!formData.email?.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password?.trim()) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        return errors;
    };

    const handleLoginSubmit = async(e) => {
        e.preventDefault();
        const formData = {
            email: e.target.elements['login-email'].value,
            password: e.target.elements['login-password'].value
        };

        const errors = validateForm(formData, true);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});
        
        setIsLoading(true);
        try{
            const responce = await api.post('/auth/login', formData);
            const {token} = responce.data;

            localStorage.setItem('token', token);
            showNotification("Login successful! Redirecting to dashboard...", "success");
            setIsModalOpen(false);
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
            
        }catch (error) {
            showNotification(error.response?.data?.error || 'Login failed!', "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupSubmit = async(e) => {
        e.preventDefault();
        const formData = {
            name: e.target.elements['signup-name'].value,
            email: e.target.elements['signup-email'].value,
            password: e.target.elements['signup-password'].value,
            confirmPassword: e.target.elements['signup-confirm-password'].value
        };

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }
        setFormErrors({});

        setIsLoading(true);
        try {
            const responce = await api.post('/auth/register', { 
                name: formData.name, 
                email: formData.email, 
                password: formData.password 
            });
            
            const {token} = responce.data;
            localStorage.setItem('token', token);

            showNotification("Account created successfully! Redirecting to dashboard...", "success");
            setIsModalOpen(false);
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            showNotification(error.response?.data?.error || 'Signup failed!', "error");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="text-gray-800 bg-gradient-to-b from-white to-blue-50">
            {/* Notification */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Header Section */}
            <motion.header 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm"
            >
                <nav className="max-w-7xl mx-auto px-5 py-4 flex justify-between items-center">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-2xl font-bold flex items-center"
                    >
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">P</span>
                        <span className="text-blue-600">ack-Pal</span>
                    </motion.div>
                    <ul className="hidden md:flex space-x-8">
                        <motion.li whileHover={{ scale: 1.05 }}>
                            <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Features</a>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }}>
                            <a href="#about" className="text-gray-600 hover:text-blue-600 transition">About</a>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }}>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Contact</a>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }}>
                            <button
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setIsSignUpActive(false);
                                }}
                                className="bg-blue-600 text-white font-bold px-6 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-600/30"
                            >
                                Log In
                            </button>
                        </motion.li>
                    </ul>
                </nav>
            </motion.header>

            {/* Hero Section */}
            <section className="pt-36 pb-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Smart Packing Solutions<br />
                            <span className="text-blue-200">for Every Journey</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 leading-relaxed text-blue-100 max-w-3xl mx-auto">
                            Pack-Pal is your intelligent travel companion that helps you pack efficiently for any trip. Never forget essential items again!
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                href="#features"
                                className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Explore Features
                            </motion.a>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setIsSignUpActive(true);
                                }}
                                className="border-2 border-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all duration-300"
                            >
                                Get Started
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 max-w-7xl mx-auto px-5">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold inline-block relative pb-4">
                        Why Choose Pack-Pal?
                        <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></span>
                    </h2>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[
                        { icon: <ListBulletIcon className="w-8 h-8" />, title: 'Smart Packing Lists', desc: 'Generate customized packing lists based on your destination, weather, activities, and trip duration.' },
                        { icon: <CloudIcon className="w-8 h-8" />, title: 'Weather Integration', desc: 'Pack-Pal checks the forecast for your destination and suggests appropriate clothing and gear.' },
                        { icon: <ArrowPathIcon className="w-8 h-8" />, title: 'Reusable Templates', desc: 'Save your favorite packing lists as templates for future trips of similar types.' },
                        { icon: <CheckCircleIcon className="w-8 h-8" />, title: 'Check-off System', desc: 'Keep track of what you\'ve already packed with our intuitive check-off system.' },
                        { icon: <DevicePhoneMobileIcon className="w-8 h-8" />, title: 'Mobile Friendly', desc: 'Access your packing lists on any device - desktop, tablet, or smartphone.' },
                        { icon: <GlobeAltIcon className="w-8 h-8" />, title: 'Destination Tips', desc: 'Receive location-specific suggestions for essential items you might not have considered.' },
                    ].map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ 
                                y: -10,
                                boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)"
                            }}
                            className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                        >
                            {/* Gradient Background Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            
                            {/* Icon Container */}
                            <motion.div 
                                whileHover={{ scale: 1.1 }}
                                className="relative z-10 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white mx-auto mb-5 shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300"
                            >
                                {feature.icon}
                            </motion.div>
                            
                            {/* Content */}
                            <div className="relative z-10">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                    {feature.desc}
                                </p>
                            </div>
                            
                            {/* Bottom Border Animation */}
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-gradient-to-br from-blue-50 to-white">
                <div className="max-w-7xl mx-auto px-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold inline-block relative pb-4">
                            About Pack-Pal
                            <span className="absolute bottom-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></span>
                        </h2>
                    </motion.div>
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex-1"
                        >
                            <div className="space-y-8">
                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Mission</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Pack-Pal was born from a common travel problem - the stress of packing and the fear of forgetting essential items. Our mission is to make packing an effortless part of your travel experience.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        We envision a world where travelers can focus on the joy of their journey rather than the stress of preparation. Through intelligent technology and personalized recommendations, we're transforming the way people pack for their adventures.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Technology</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Pack-Pal combines advanced AI algorithms with real-time weather data and destination insights to create the perfect packing list for every trip. Our technology learns from your preferences and adapts to your unique travel style.
                                    </p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Team</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        Our team consists of passionate travelers, tech enthusiasts, and packing experts who understand the challenges of travel preparation. Together, we're dedicated to making your packing experience seamless and stress-free.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="flex-1 space-y-6"
                        >
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <img 
                                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80" 
                                    alt="Travel Packing" 
                                    className="w-full h-96 object-cover rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
                                    <h3 className="text-white text-xl font-semibold">Smart Packing for Smart Travelers</h3>
                                    <p className="text-white/80 mt-2">Experience the future of travel preparation</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Fast</h4>
                                            <p className="text-sm text-gray-600">Quick packing lists</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Secure</h4>
                                            <p className="text-sm text-gray-600">Data protection</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Efficient</h4>
                                            <p className="text-sm text-gray-600">Save time</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Smart</h4>
                                            <p className="text-sm text-gray-600">AI-powered</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer id="contact" className="bg-gray-900 text-white pt-16 pb-8 px-5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-semibold mb-5 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-blue-600">
                            Pack-Pal
                        </h3>
                        <p className="text-gray-300">
                            Smart packing solutions for every journey. Never forget essential items again!
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-semibold mb-5 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-blue-600">
                            Quick Links
                        </h3>
                        <a href="#features" className="block text-gray-300 hover:text-white hover:pl-1.5 transition mb-2.5">Features</a>
                        <a href="#about" className="block text-gray-300 hover:text-white hover:pl-1.5 transition mb-2.5">About Us</a>
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsSignUpActive(false);
                            }}
                            className="block text-gray-300 hover:text-white hover:pl-1.5 transition mb-2.5"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => {
                                setIsModalOpen(true);
                                setIsSignUpActive(true);
                            }}
                            className="block text-gray-300 hover:text-white hover:pl-1.5 transition"
                        >
                            Register
                        </button>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <h3 className="text-xl font-semibold mb-5 relative pb-2 after:absolute after:bottom-0 after:left-0 after:w-1/2 after:h-0.5 after:bg-blue-600">
                            Contact Us
                        </h3>
                        <p className="text-gray-300 mb-2.5">Email: smitgajera53@gmail.com</p>
                        <p className="text-gray-300">Phone: +1 (555) 123-4567</p>
                    </motion.div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-5 border-t border-gray-700 text-center">
                    <p>&copy; 2023 Pack-Pal. All rights reserved. Made by Smit</p>
                </div>
            </footer>

            {/* Login/Signup Modal */}
            {isModalOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                >
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl min-h-[600px] flex overflow-hidden"
                    >
                        {/* Decorative Side Panel */}
                        <div className="hidden lg:block w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800">
                            <div className="absolute inset-0 bg-blue-600 opacity-20">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                                }}></div>
                            </div>
                            <div className="relative h-full flex flex-col justify-center px-12 text-white">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="space-y-6"
                                >
                                    <h2 className="text-4xl font-bold">
                                        {isSignUpActive ? "Start Your Journey" : "Welcome Back"}
                                    </h2>
                                    <p className="text-lg text-blue-100">
                                        {isSignUpActive 
                                            ? "Join Pack-Pal and make your travel packing effortless. Create your account in minutes and start organizing your trips like a pro."
                                            : "Log in to access your packing lists, templates, and travel recommendations. Your next adventure awaits!"}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                            <CloudIcon className="w-6 h-6" />
                                        </div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                            <GlobeAltIcon className="w-6 h-6" />
                                        </div>
                                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                            <ListBulletIcon className="w-6 h-6" />
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Form Container */}
                        <div className="w-full lg:w-1/2 relative">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Sign Up Form */}
                            <div className={`absolute inset-0 transition-all duration-500 transform ${isSignUpActive ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}>
                                <form onSubmit={handleSignupSubmit} className="h-full flex flex-col justify-center px-8 lg:px-12 py-8">
                                    <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                                        <p className="text-gray-600 mt-2">Join Pack-Pal today and start your journey</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="signup-name"
                                                placeholder="Enter your name"
                                                required
                                                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.name ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                            />
                                            {formErrors.name && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="signup-email"
                                                placeholder="Enter your email"
                                                required
                                                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showSignupPassword ? "text" : "password"}
                                                    name="signup-password"
                                                    placeholder="Create a password"
                                                    required
                                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showSignupPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {formErrors.password && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="signup-confirm-password"
                                                    placeholder="Confirm your password"
                                                    required
                                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {formErrors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-6 w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Creating Account...
                                            </div>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>

                                    <p className="mt-6 text-center text-gray-600">
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setIsSignUpActive(false)}
                                            className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none"
                                        >
                                            Sign In
                                        </button>
                                    </p>
                                </form>
                            </div>

                            {/* Login Form */}
                            <div className={`absolute inset-0 transition-all duration-500 transform ${!isSignUpActive ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'}`}>
                                <form onSubmit={handleLoginSubmit} className="h-full flex flex-col justify-center px-8 lg:px-12 py-8">
                                    <div className="text-center mb-8">
                                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                                        <p className="text-gray-600 mt-2">Sign in to continue your journey</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                name="login-email"
                                                placeholder="Enter your email"
                                                required
                                                className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.email ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                            />
                                            {formErrors.email && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showLoginPassword ? "text" : "password"}
                                                    name="login-password"
                                                    placeholder="Enter your password"
                                                    required
                                                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${formErrors.password ? 'border-red-500' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showLoginPassword ? (
                                                        <EyeSlashIcon className="h-5 w-5" />
                                                    ) : (
                                                        <EyeIcon className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                            {formErrors.password && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="remember-me"
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                                    Remember me
                                                </label>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="mt-6 w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Signing In...
                                            </div>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </button>

                                    <p className="mt-6 text-center text-gray-600">
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => setIsSignUpActive(true)}
                                            className="text-blue-600 font-semibold hover:text-blue-700 focus:outline-none"
                                        >
                                            Create Account
                                        </button>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </div>
    )
}

export default LandingPage