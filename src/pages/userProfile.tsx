// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import Footer from '../components/footer';
// import Header from '../components/header';
// import bgImage from '../assets/background_Dark_signup.webp';
// import { useNavigate } from 'react-router-dom';
// import { User, Star } from 'lucide-react';

// const fadeIn = (delay = 0) => ({
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay,
//       duration: 0.6,
//       ease: 'easeOut',
//     },
//   },
// });

// const iconVariant = {
//   hidden: { opacity: 0, scale: 0.8 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     transition: {
//       duration: 0.6,
//       ease: 'easeOut',
//       delay: 0.3,
//     },
//   },
// };

// const UserProfile: React.FC = () => {
//   const [user, setUser] = useState<{
//     name: string; email: string; role: string
// } | null>(null);
//   const [plan, setPlan] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }

//     const planType = localStorage.getItem('userPlan');
//     console.log('PLAN TYPE: ', planType);
//     if (planType) {
//       setPlan(planType);
//     } else {
//       setPlan('basic');
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     localStorage.removeItem('userPlan');
//     navigate('/');
//   };

//   return (
//     <div className="min-h-screen bg-black text-white px-4">
//       <Header />
//       <div className=" gap-10 backdrop-blur-sm max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-xl w-full p-6 md:p-10 flex flex-col md:flex-row mb-5 mt-5">
//         <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
//           <h2 className="text-3xl font-bold mb-10">
//             Profile
//             <span className="text-red-600"> M</span>OVIEXPO!
//           </h2>
//           <p className="text-gray-300 mb-6 leading-relaxed mb-10">
//             Your profile details are shown below.
//           </p>
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="w-full md:w-5/6 rounded-lg overflow-hidden flex item-center justify-center"
//           >
//             <div className="flex flex-col w-full md:w-1/3 flex items-center justify-center">
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="bg-black border-4 border-red-600 rounded-full p-7"
//               >
//                 <User className="h-20 w-20 text-red-500" />
//               </motion.div>
//             </div>
//           </motion.div>
//           <div className="mt-10">

//             <br />
//             <p className="text-white text-sm">
//               Your privacy is our top priority — always secure.
//             </p>
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full md:w-2/3 flex flex-col space-y-9"
//         >
//           <h1 className="text-3xl font-bold text-red-600 mt-8 md:mt-0">
//             Welcome, <span className="text-white">{user?.name || 'Guest'}</span>
//           </h1>

//           <div className="space-y-3">
//             <div>
//               <p className="text-red-500 font-semibold text-lg">Email:</p>
//               <p className="text-white">{user?.email}</p>
//             </div>
//             <div>
//               <p className="text-red-500 font-semibold text-lg">Role:</p>
//               <p className="text-white capitalize">{user?.role || 'Guest'}</p>
//             </div>

//             <button
//               className="w-[120px] mt-5 cursor-pointer p-1 bg-red-700 border border-red-600 rounded-lg hover:text-white-500"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>

//             <div
//               className={`mt-5 p-4 rounded-xl border relative overflow-hidden ${
//                 plan === 'premium'
//                   ? 'bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-500 shadow-lg shadow-yellow-500/50'
//                   : 'bg-zinc-900 border-zinc-700'
//               }`}
//             >
//               {/* Decorative Stars in Arc Formation */}
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 flex items-center space-x-3 -mt-5">
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.5, duration: 0.3 }}
//                   className="transform translate-y-4"
//                 >
//                   <Star className={`h-4 w-4 ${plan === 'premium' ? 'text-yellow-200' : 'text-red-400'}`} fill="currentColor" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.7, duration: 0.3 }}
//                   className="transform translate-y-2"
//                 >
//                   <Star className={`h-5 w-5 ${plan === 'premium' ? 'text-yellow-300' : 'text-red-500'}`} fill="currentColor" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 0.9, duration: 0.3 }}
//                   className="transform translate-y-0"
//                 >
//                   <Star className={`h-6 w-6 ${plan === 'premium' ? 'text-yellow-100' : 'text-red-300'}`} fill="currentColor" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 1.1, duration: 0.3 }}
//                   className="transform translate-y-2"
//                 >
//                   <Star className={`h-5 w-5 ${plan === 'premium' ? 'text-yellow-200' : 'text-red-400'}`} fill="currentColor" />
//                 </motion.div>
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.5 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   transition={{ delay: 1.3, duration: 0.3 }}
//                   className="transform translate-y-4"
//                 >
//                   <Star className={`h-4 w-4 ${plan === 'premium' ? 'text-yellow-300' : 'text-red-500'}`} fill="currentColor" />
//                 </motion.div>
//               </div>

//               <h2 className="text-lg font-semibold text-red-500 mb-3">
//                 Current Plan
//               </h2>

//               {plan && (
//                 <>
//                   <p className="mb-4 text-white">
//                     Plan:{' '}
//                     <span className="text-red-500 font-medium capitalize">
//                       {plan}
//                     </span>
//                   </p>
//                   <button
//                     className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm cursor-pointer"
//                     onClick={() => navigate(`/subscription`)}
//                   >
//                     Explore Plan
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default UserProfile;




// import React, { useEffect, useState, useCallback } from "react";
// import { motion } from "framer-motion";
// import Footer from "../components/footer";
// import Header from "../components/header";
// import bgImage from "../assets/background_Dark_signup.webp";
// import { useNavigate } from "react-router-dom";
// import { User, Star } from "lucide-react";
// import axios from "axios";

// // Define the base URL for API requests
// const API_BASE_URL = "https://movie-explorer-ror-ashutosh-singh.onrender.com";

// const fadeIn = (delay = 0) => ({
//   hidden: { opacity: 0, y: 30 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay,
//       duration: 0.6,
//       ease: "easeOut",
//     },
//   },
// });

// const UserProfile: React.FC = () => {
//   const [user, setUser] = useState<{
//     name: string;
//     email: string;
//     role: string;
//     profile_picture_url: string | null;
//     profile_picture_thumbnail: string | null;
//   } | null>(null);
//   const [plan, setPlan] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const navigate = useNavigate();

//   // Clear messages after timeout
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   // Fetch user data
//   const fetchUser = useCallback(async () => {
//     try {
//       setIsLoading(true);
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("No authentication token found. Please log in.");
//         navigate("/");
//         return;
//       }

//       const response = await axios.get(
//         `${API_BASE_URL}/api/v1/current_user`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       console.log("User data fetched:", response.data);
//       setUser(response.data);
      
//       // Update localStorage with fresh user data
//       localStorage.setItem("user", JSON.stringify(response.data));
      
//       const planType = localStorage.getItem("userPlan");
//       setPlan(planType || "basic");
      
//     } catch (err: any) {
//       console.error("Error fetching user:", err);
//       if (err.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userPlan");
//         navigate("/");
//       } else {
//         setError("Failed to load user data");
//         // Fallback to localStorage
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           try {
//             setUser(JSON.parse(storedUser));
//           } catch (parseError) {
//             console.error("Error parsing stored user data:", parseError);
//             localStorage.removeItem("user");
//           }
//         }
//         const planType = localStorage.getItem("userPlan");
//         setPlan(planType || "basic");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     fetchUser();
//   }, [fetchUser]);

//   const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         setError("Please select a valid image file");
//         setSelectedFile(null);
//         setPreview(null);
//         return;
//       }

//       // Validate file size (e.g., max 5MB)
//       const maxSize = 5 * 1024 * 1024; // 5MB in bytes
//       if (file.size > maxSize) {
//         setError("File size must be less than 5MB");
//         setSelectedFile(null);
//         setPreview(null);
//         return;
//       }

//       setSelectedFile(file);
//       setError(null);
//       setSuccess(null);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.onerror = () => {
//         setError("Failed to read file");
//         setSelectedFile(null);
//         setPreview(null);
//       };
//       reader.readAsDataURL(file);
//     }
//   }, []);

//   const handleUpload = useCallback(async () => {
//     if (!selectedFile) {
//       setError("Please select a file");
//       return;
//     }

//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No authentication token found. Please log in.");
//       navigate("/");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);
//     setSuccess(null);

//     const formData = new FormData();
//     formData.append("profile_picture", selectedFile);

//     // Try different possible endpoints
//     const possibleEndpoints = [
//       `${API_BASE_URL}/api/v1/update_profile_picture`,
//       `${API_BASE_URL}/api/v1/profile_picture`,
//       `${API_BASE_URL}/api/v1/users/profile_picture`,
//       `${API_BASE_URL}/api/v1/user/profile_picture`,
//       `${API_BASE_URL}/profile_picture`,
//       `${API_BASE_URL}/api/v1/upload_profile_picture`,
//     ];

//     let lastError = null;
//     let uploadSuccessful = false;

//     for (const endpoint of possibleEndpoints) {
//       try {
//         console.log("Trying endpoint:", endpoint);
//         const response = await axios.post(endpoint, formData, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           timeout: 30000,
//           onUploadProgress: (progressEvent) => {
//             if (progressEvent.total) {
//               const percentCompleted = Math.round(
//                 (progressEvent.loaded * 100) / progressEvent.total
//               );
//               console.log("Upload progress:", percentCompleted + "%");
//             }
//           },
//         });
        
//         console.log("Upload response:", response.data);
        
//         // Update user state with fresh data
//         setUser(response.data);
        
//         // Update localStorage
//         localStorage.setItem("user", JSON.stringify(response.data));
        
//         // Clear form state
//         setSelectedFile(null);
//         setPreview(null);
//         setSuccess("Profile picture updated successfully");
//         setError(null);
//         uploadSuccessful = true;

//         // Clear the file input
//         const fileInput = document.querySelector(
//           'input[type="file"]'
//         ) as HTMLInputElement;
//         if (fileInput) {
//           fileInput.value = "";
//         }

//         break; // Success, exit the loop
//       } catch (err: any) {
//         console.error(`Error with endpoint ${endpoint}:`, err);
//         lastError = err;

//         // If it's not a 404, break the loop and handle the error
//         if (err.response?.status !== 404) {
//           break;
//         }
//         // Continue to next endpoint if 404
//         continue;
//       }
//     }

//     if (!uploadSuccessful) {
//       // Handle the final error
//       const err = lastError;
//       console.error("All endpoints failed. Last error:", err);

//       if (err?.code === "ECONNABORTED") {
//         setError("Upload timeout. Please try again with a smaller file.");
//       } else if (err?.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userPlan");
//         navigate("/");
//       } else if (err?.response?.status === 404) {
//         setError(
//           "Upload endpoint not found. Please contact support or check if the feature is available."
//         );
//       } else if (err?.response?.status === 422) {
//         const errors = err.response?.data?.errors;
//         if (Array.isArray(errors)) {
//           setError(errors.join(", "));
//         } else if (typeof errors === "object") {
//           setError(Object.values(errors).flat().join(", "));
//         } else {
//           setError("Validation failed. Please check your file and try again.");
//         }
//       } else if (err?.response?.status === 413) {
//         setError("File too large. Please select a smaller image.");
//       } else {
//         setError(
//           err?.response?.data?.error ||
//             err?.response?.data?.message ||
//             "Failed to upload profile picture. Please try again."
//         );
//       }
//     }

//     setIsUploading(false);
//   }, [selectedFile, navigate]);

//   const handleRemove = useCallback(async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("No authentication token found. Please log in.");
//       navigate("/");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       await axios.post(
//         `${API_BASE_URL}/api/v1/remove_profile_picture`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
      
//       // Update user state
//       const updatedUser = {
//         ...user!,
//         profile_picture_url: null,
//         profile_picture_thumbnail: null,
//       };
//       setUser(updatedUser);
      
//       // Update localStorage
//       localStorage.setItem("user", JSON.stringify(updatedUser));
      
//       setSuccess("Profile picture removed successfully");
//       setError(null);
//     } catch (err: any) {
//       console.error("Error removing profile picture:", err);
//       if (err.response?.status === 401) {
//         setError("Session expired. Please log in again.");
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         localStorage.removeItem("userPlan");
//         navigate("/");
//       } else {
//         setError(
//           err.response?.data?.error || "Failed to remove profile picture"
//         );
//       }
//       setSuccess(null);
//     } finally {
//       setIsUploading(false);
//     }
//   }, [user, navigate]);

//   const handleLogout = useCallback(() => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("userPlan");
//     navigate("/");
//   }, [navigate]);

//   // Show loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-black text-white px-4">
//         <Header />
//         <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
//             <p className="text-gray-300">Loading profile...</p>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-black text-white px-4">
//       <Header />
//       <div className="gap-10 backdrop-blur-sm max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-xl w-full p-6 md:p-10 flex flex-col md:flex-row mb-5 mt-5">
//         <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
//           <h2 className="text-3xl font-bold mb-10">
//             Profile
//             <span className="text-red-600"> M</span>OVIEXPO!
//           </h2>
//           <p className="text-gray-300 mb-6 leading-relaxed mb-10">
//             Your profile details are shown below.
//           </p>
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5 }}
//             className="w-full md:w-5/6 rounded-lg overflow-hidden flex items-center justify-center"
//           >
//             <div className="flex flex-col w-full items-center justify-center">
//               <motion.div
//                 key={user?.profile_picture_thumbnail || 'default'} // Force re-render when image changes
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3 }}
//                 className="w-40 h-40 bg-black border-4 border-red-500 rounded-full flex items-center justify-center overflow-hidden"
//               >
//                 {user?.profile_picture_thumbnail ? (
//                   <img
//                     src={user.profile_picture_thumbnail}
//                     alt="Profile"
//                     className="h-full w-full rounded-full object-cover"
//                     onError={(e) => {
//                       console.error("Failed to load profile image");
//                       // Hide the image and show default icon on error
//                       (e.target as HTMLImageElement).style.display = 'none';
//                     }}
//                   />
//                 ) : (
//                   <User className="h-12 w-12 text-red-500" />
//                 )}
//               </motion.div>
              
//               <div className="mt-4 w-full max-w-xs flex flex-col items-center space-y-3">
//                 <input
//                   type="file"
//                   accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
//                   onChange={handleFileChange}
//                   disabled={isUploading}
//                   className="w-full text-xs text-gray-300 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                 />
                
//                 {preview && (
//                   <div className="flex flex-col items-center">
//                     <p className="text-gray-300 text-xs mb-1">Preview:</p>
//                     <img
//                       src={preview}
//                       alt="Preview"
//                       className="h-16 w-16 rounded-full object-cover border border-gray-600"
//                     />
//                   </div>
//                 )}
                
//                 <div className="flex space-x-2 w-full">
//                   <button
//                     onClick={handleUpload}
//                     disabled={!selectedFile || isUploading}
//                     className={`flex-1 px-3 py-2 rounded-lg text-xs text-white transition-colors ${
//                       selectedFile && !isUploading
//                         ? "bg-red-700 hover:bg-red-600 cursor-pointer"
//                         : "bg-zinc-700 cursor-not-allowed opacity-50"
//                     }`}
//                   >
//                     {isUploading ? "Uploading..." : "Upload"}
//                   </button>
                  
//                   {user?.profile_picture_url && (
//                     <button
//                       onClick={handleRemove}
//                       disabled={isUploading}
//                       className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-xs text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                     >
//                       {isUploading ? "Removing..." : "Remove"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </motion.div>
          
//           <div className="mt-6">
//             <p className="text-white text-sm">
//               Your privacy is our top priority — always secure.
//             </p>
            
//             {error && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg"
//               >
//                 <p className="text-red-400 text-sm">{error}</p>
//               </motion.div>
//             )}
            
//             {success && (
//               <motion.div
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="mt-3 p-3 bg-green-900/30 border border-green-600 rounded-lg"
//               >
//                 <p className="text-green-400 text-sm">{success}</p>
//               </motion.div>
//             )}
//           </div>
//         </motion.div>

//         <motion.div
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="w-full md:w-2/3 flex flex-col space-y-9"
//         >
//           <h1 className="text-3xl font-bold text-red-600 mt-8 md:mt-0">
//             Welcome, <span className="text-white">{user?.name}</span>
//           </h1>

//           <div className="space-y-6">
//             <div>
//               <p className="text-red-500 font-semibold text-lg">Email:</p>
//               <p className="text-white">{user?.email}</p>
//             </div>
//             <div>
//               <p className="text-red-500 font-semibold text-lg">Role:</p>
//               <p className="text-white capitalize">{user?.role || "Guest"}</p>
//             </div>

//             <button
//               className="w-[120px] mt-5 cursor-pointer p-2 bg-red-700 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-white"
//               onClick={handleLogout}
//             >
//               Logout
//             </button>

//             <div
//               className={`mt-5 p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
//                 plan === "premium"
//                   ? "bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-500 shadow-lg shadow-yellow-500/50"
//                   : "bg-zinc-900 border-zinc-700"
//               }`}
//             >
//               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 flex items-center space-x-3 -mt-5">
//                 {[0.5, 0.7, 0.9, 1.1, 1.3].map((delay, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, scale: 0.5 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay, duration: 0.3 }}
//                     className={`transform ${
//                       index === 2 ? 'translate-y-0' : 
//                       index === 1 || index === 3 ? 'translate-y-2' : 
//                       'translate-y-4'
//                     }`}
//                   >
//                     <Star
//                       className={`${
//                         index === 2 ? 'h-6 w-6' :
//                         index === 1 || index === 3 ? 'h-5 w-5' :
//                         'h-4 w-4'
//                       } ${
//                         plan === "premium" 
//                           ? index === 2 ? "text-yellow-100" :
//                             index === 1 || index === 3 ? "text-yellow-300" :
//                             "text-yellow-200"
//                           : index === 2 ? "text-red-300" :
//                             index === 1 || index === 3 ? "text-red-500" :
//                             "text-red-400"
//                       }`}
//                       fill="currentColor"
//                     />
//                   </motion.div>
//                 ))}
//               </div>

//               <h2 className="text-lg font-semibold text-red-500 mb-3">
//                 Current Plan
//               </h2>

//               {plan && (
//                 <>
//                   <p className="mb-4 text-white">
//                     Plan:{" "}
//                     <span className="text-red-500 font-medium capitalize">
//                       {plan}
//                     </span>
//                   </p>
//                   <button
//                     className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm cursor-pointer transition-colors"
//                     onClick={() => navigate("/subscription")}
//                   >
//                     Explore Plan
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </motion.div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default UserProfile;



import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import Header from "../components/header";
import bgImage from "../assets/background_Dark_signup.webp";
import { useNavigate } from "react-router-dom";
import { User, Star } from "lucide-react";
import axios from "axios";

const API_BASE_URL = "https://movie-explorer-ror-ashutosh-singh.onrender.com";

const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: "easeOut",
    },
  },
});

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [plan, setPlan] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/");
        return;
      }

      const response = await axios.get(
       `${API_BASE_URL}/api/v1/current_user`,
        {
          headers: { Authorization:`Bearer ${token} `},
        }
      );
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      const planType = localStorage.getItem("userPlan");
      setPlan(planType || "basic");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userPlan");
        navigate("/");
      } else {
        setError("Failed to load user data");
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (parseError) {
            localStorage.removeItem("user");
          }
        }
        const planType = localStorage.getItem("userPlan");
        setPlan(planType || "basic");
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        setSelectedFile(null);
        setPreview(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
      setSuccess(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.onerror = () => {
        setError("Failed to read file");
        setSelectedFile(null);
        setPreview(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("user[profile_picture]", selectedFile);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/update_profile_picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }
          },
        }
      );

      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      setSelectedFile(null);
      setPreview(null);
      setSuccess("Profile picture updated successfully");
      setError(null);

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      if (err?.code === "ECONNABORTED") {
        setError("Upload timeout. Please try again with a smaller file.");
      } else if (err?.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userPlan");
        navigate("/");
      } else if (err?.response?.status === 404) {
        setError(
          "Upload endpoint not found. Please contact support or check if the feature is available."
        );
      } else if (err?.response?.status === 422) {
        const errors = err.response?.data?.errors;
        if (Array.isArray(errors)) {
          setError(errors.join(", "));
        } else if (typeof errors === "object") {
          setError(Object.values(errors).flat().join(", "));
        } else {
          setError("Validation failed. Please check your file and try again.");
        }
      } else if (err?.response?.status === 413) {
        setError("File too large. Please select a smaller image.");
      } else {
        setError(
          err?.response?.data?.error ||
            err?.response?.data?.message ||
            "Failed to upload profile picture. Please try again."
        );
      }
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, navigate]);

  const handleRemove = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      navigate("/");
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      await axios.post(
        `${API_BASE_URL}/api/v1/remove_profile_picture`,
        {},
        {
          headers: { Authorization: `Bearer ${token} `},
        }
      );

      const updatedUser = {
        ...user,
        profile_picture_url: null,
        profile_picture_thumbnail: null,
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSuccess("Profile picture removed successfully");
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userPlan");
        navigate("/");
      } else {
        setError(
          err.response?.data?.error || "Failed to remove profile picture"
        );
      }
      setSuccess(null);
    } finally {
      setIsUploading(false);
    }
  }, [user, navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userPlan");
    navigate("/");
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white px-4">
        <Header />
        <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4">
      <Header />
      <div className="gap-10 backdrop-blur-sm max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-xl w-full p-6 md:p-10 flex flex-col md:flex-row mb-5 mt-5">
        <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
          <h2 className="text-3xl font-bold mb-10">
            Profile
            <span className="text-red-600"> M</span>OVIEXPO!
          </h2>
          {/* <p className="text-gray-300 mb-6 leading-relaxed mb-10">
            Your profile details are shown below.
          </p> */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-5/6 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <div className="flex flex-col w-full items-center justify-center">
              <motion.div
                key={user?.profile_picture_thumbnail || 'default'}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-40 h-40 bg-black border-4 border-red-500 rounded-full flex items-center justify-center overflow-hidden"
              >
                {user?.profile_picture_thumbnail ? (
                  <img
                    src={user.profile_picture_thumbnail}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <User className="h-12 w-12 text-red-500" />
                )}
              </motion.div>
              
              <div className="mt-4 w-full max-w-xs flex flex-col items-center space-y-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="w-full text-xs text-gray-300 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-700 file:text-white hover:file:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                
                {preview && (
                  <div className="flex flex-col items-center">
                    <p className="text-gray-300 text-xs mb-1">Preview:</p>
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-16 w-16 rounded-full object-cover border border-gray-600"
                    />
                  </div>
                )}
                
                <div className="flex space-x-2 w-full">
                  <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className={`flex-1 px-3 py-2 rounded-lg text-xs text-white transition-colors ${
                      selectedFile && !isUploading
                        ? "bg-red-700 hover:bg-red-600 cursor-pointer"
                        : "bg-zinc-700 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                  
                  {user?.profile_picture_url && (
                    <button
                      onClick={handleRemove}
                      disabled={isUploading}
                      className="flex-1 px-3 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-xs text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isUploading ? "Removing..." : "Remove"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="mt-6">
            <p className="text-white text-sm">
              Your privacy is our top priority — always secure.
            </p>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-red-900/30 border border-red-600 rounded-lg"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-green-900/30 border border-green-600 rounded-lg"
              >
                <p className="text-green-400 text-sm">{success}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/3 flex flex-col space-y-9"
        >
          <h1 className="text-3xl font-bold text-red-600 mt-8 md:mt-0">
            Welcome, <span className="text-white">{user?.name}</span>
          </h1>

          <div className="space-y-6">
            <div>
              <p className="text-red-500 font-semibold text-lg">Email:</p>
              <p className="text-white">{user?.email}</p>
            </div>
            <div>
              <p className="text-red-500 font-semibold text-lg">Role:</p>
              <p className="text-white capitalize">{user?.role || "Guest"}</p>
            </div>

            <button
              className="w-[120px] mt-5 cursor-pointer p-2 bg-red-700 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-white"
              onClick={handleLogout}
            >
              Logout
            </button>

            <div
              className={`mt-5 p-4 rounded-xl border relative overflow-hidden transition-all duration-300 ${
                plan === "premium"
                  ? "bg-gradient-to-r from-yellow-500 to-amber-500 border-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-zinc-900 border-zinc-700"
              }`}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-x-4 flex items-center space-x-3 -mt-5">
                {[0.5, 0.7, 0.9, 1.1, 1.3].map((delay, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay, duration: 0.3 }}
                    className={`transform ${
                      index === 2 ? 'translate-y-0' : 
                      index === 1 || index === 3 ? 'translate-y-2' : 
                      'translate-y-4'
                    }`}
                  >
                    <Star
                      className={`${
                        index === 2 ? 'h-6 w-6' :
                        index === 1 || index === 3 ? 'h-5 w-5' :
                        'h-4 w-4'
                      } ${
                        plan === "premium" 
                          ? index === 2 ? "text-yellow-100" :
                            index === 1 || index === 3 ? "text-yellow-300" :
                            "text-yellow-200"
                          : index === 2 ? "text-red-300" :
                            index === 1 || index === 3 ? "text-red-500" :
                            "text-red-400"
                      }`}
                      fill="currentColor"
                    />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-red-500 mb-3">
                Current Plan
              </h2>

              {plan && (
                <>
                  <p className="mb-4 text-white">
                    Plan:{" "}
                    <span className="text-red-500 font-medium capitalize">
                      {plan}
                    </span>
                  </p>
                  <button
                    className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg text-white text-sm cursor-pointer transition-colors"
                    onClick={() => navigate("/subscription")}
                  >
                    Explore Plan
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;