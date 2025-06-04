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
      window.scrollTo(0, 0);  
    }, []);

  const getPlanStyling = (planValidity) => {
    switch(planValidity) {
      case '1_day':
        return {
          gradient: 'from-gray-800 to-gray-900',
          borderColor: 'border-gray-600',
          shadowColor: 'shadow-gray-600/50',
          starColors: {
            center: 'text-gray-300',
            middle: 'text-gray-400', 
            outer: 'text-gray-500'
          }
        };
      case '7_days':
        return {
          gradient: 'from-red-900 to-pink-900',
          borderColor: 'border-none',
          shadowColor: 'shadow-red-600/50',
          starColors: {
            center: 'text-red-300',
            middle: 'text-red-400',
            outer: 'text-red-500'
          }
        };
      case '1_month':
        return {
          gradient: 'bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-500 ',
          borderColor: 'border-yellow-600',
          shadowColor: 'shadow-yellow-600/50',
          starColors: {
            center: 'text-yellow-100',
            middle: 'text-yellow-400',
            outer: 'text-yellow-300'
          }
        };
      case 'premium':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          borderColor: 'border-yellow-500',
          shadowColor: 'shadow-yellow-500/50',
          starColors: {
            center: 'text-yellow-100',
            middle: 'text-yellow-300',
            outer: 'text-yellow-200'
          }
        };
      default:
        return {
          gradient: 'from-zinc-900 to-black',
          borderColor: 'border-zinc-700',
          shadowColor: 'shadow-zinc-700/50',
          starColors: {
            center: 'text-red-300',
            middle: 'text-red-500',
            outer: 'text-red-400'
          }
        };
    }
  };

  const formatPlanValidity = (planValidity) => {
    if (!planValidity) return 'Basic';
    return planValidity.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFieldLabel = (fieldName) => {
    const labelMap = {
      updated_at: "Member Since",
      expires_at: "Plan Expires",
      role: "Role",
      email: "Email",
      plan_validity: "Plan Duration"
    };
    return labelMap[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/_/g, ' ');
  };

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

      const planType = response.data.plan_type || "basic";
      setPlan(planType);
      localStorage.setItem("userPlan", planType);
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
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setPlan(userData.plan_type || "basic");
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
      const response = await axios.put(
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

      const updatedUser = {
        ...user,
        ...response.data,
        updated_at: response.data.updated_at || user?.updated_at,
        expires_at: response.data.expires_at || user?.expires_at,
        role: response.data.role || user?.role,
        email: response.data.email || user?.email,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
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
  }, [selectedFile, navigate, user]);

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
      await axios.delete(
        `${API_BASE_URL}/api/v1/remove_profile_picture`,
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
      <div className="min-h-screen bg-black text-white px-4 flex flex-col">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const planStyling = getPlanStyling(user?.plan_validity || plan);
  return (
    <div className="min-h-screen bg-black text-white px-4 flex flex-col">
      <Header />
      <div className="flex-1 gap-10 backdrop-blur-sm max-w-4xl mx-auto bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-2xl shadow-xl w-full p-6 md:p-10 flex flex-col md:flex-row mb-5 mt-5">
        <motion.div initial="hidden" animate="visible" variants={fadeIn(0)}>
          <h2 className="text-3xl font-bold mb-10">
            Profile
            <span className="text-red-600"> M</span>OVIEXPO!
          </h2>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-5/6 rounded-lg overflow-hidden flex items-center justify-center"
          >
            <div className="flex flex-col w-full items-center justify-center">
              <motion.div
                key={user?.profile_picture_url || 'default'}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-40 h-40 bg-black border-4 border-red-500 rounded-full flex items-center justify-center overflow-hidden"
              >
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
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
              
              <div className="mt-4 w-full max-w-xs flex flex-col items-center space-y-3 mt-5">
                {!user?.profile_picture_url && (
                  <>
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
                    
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile || isUploading}
                      className={`w-full px-3 py-2 rounded-lg text-xs text-white transition-colors mt-5 ${
                        selectedFile && !isUploading
                          ? "bg-red-700 hover:bg-red-600 cursor-pointer"
                          : "bg-zinc-700 cursor-not-allowed opacity-50"
                      }`}
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  </>
                )}
                
                {user?.profile_picture_url && (
                  <button
                    onClick={async () => {
                      await handleRemove();
                      await fetchUser();
                    }}
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-red-700 mt-8 hover:bg-red-600 rounded-lg text-xs text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading ? "Removing..." : "Remove Picture"}
                  </button>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user && ['role', 'email', 'updated_at', 'expires_at'].map((field) => {
                if (!user[field] && field !== 'plan_validity') return null;
                
                const isDateField = field.includes('_at');
                let value;
                if (field === 'plan_validity') {
                  value = formatPlanValidity(user[field]);
                } else if (isDateField) {
                  value = formatDate(user[field]);
                } else {
                  value = user[field];
                }
                
                return (
                  <div key={field}>
                    <p className="text-red-500 font-semibold text-lg">
                      {getFieldLabel(field)}:
                    </p>
                    <p className={`text-white ${['role', 'plan_type', 'plan_validity'].includes(field) ? 'capitalize' : ''}`}>
                      {value || "N/A"}
                    </p>
                  </div>
                );
              })}
                <button
              className="w-[120px] mt-5 cursor-pointer p-2 bg-red-700 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
           <button
                    className="w-[120px] mt-5 cursor-pointer p-2 bg-red-700 border border-red-600 rounded-lg hover:bg-red-600 transition-colors text-white"
                    onClick={() => navigate("/subscription")}
                  >
                    Explore Plan
                  </button>
            </div>

            <div
              className={`mt-5 p-4 rounded-xl border relative overflow-hidden transition-all duration-300 bg-gradient-to-r ${planStyling.gradient} ${planStyling.borderColor} shadow-lg ${planStyling.shadowColor}`}
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
                        index === 2 ? planStyling.starColors.center :
                        index === 1 || index === 3 ? planStyling.starColors.middle :
                        planStyling.starColors.outer
                      }`}
                      fill="currentColor"
                    />
                  </motion.div>
                ))}
              </div>

              <h2 className="text-lg font-semibold text-red-500 mb-3">
                Current Plan
              </h2>

              {(plan || user?.plan_validity) && (
                <>
                  <p className="mb-4 text-white">
                    Plan:{" "}
                    <span className="text-red-500 font-medium capitalize">
                      {user?.plan_validity ? formatPlanValidity(user.plan_validity) : plan}
                    </span>
                  </p>
                  {/* {user?.plan_type && (
                    <p className="mb-4 text-white">
                      Type:{" "}
                      <span className="text-red-500 font-medium capitalize">
                        {user.plan_type}
                      </span>
                    </p>
                  )} */}
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