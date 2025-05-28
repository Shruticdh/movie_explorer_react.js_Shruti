import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom"; 
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [user, setUser] = useState<{ name:string; email: string; role: string } | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
    const fetchUserPlan = async () => {
      const plan = localStorage.getItem("userPlan");
      return plan || "basic"; 
    };

    useEffect(() => {
  const checkPremium = async () => {
    const plan = await fetchUserPlan();
    setIsPremium(plan.toLowerCase() === "premium");
  };
  checkPremium();
}, []);



  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);
  const toggleAccountMenu = () => setShowAccountMenu((prev) => !prev);

  const handleSubscribeClick = () => navigate("/subscription");
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userPlan");
    navigate("/");
  };

  const handleMoveToMovies = () => navigate("/all-movies");
  const handleMoveToGenre = () => navigate("/genre");
  const handleMoveToAddMovies = () => navigate("/add-movie");
  const handleHomePage = () => navigate("/dashboard");
  const handleProfilePage = () => navigate("/profile");

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="inset-0 bg-black/50 backdrop-blur-md text-white p-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={handleHomePage} data-testid="logo">
            <div className="text-xl font-bold text-red-600 cursor-pointer">
              M<span className="text-white">OVIEXPO!!</span>
            </div>
          </button>
        </motion.div>

        <div className="flex items-center gap-2 relative">
          <div className="hidden md:flex items-center gap-6 text-md">
            <motion.span
              className={`cursor-pointer ${isActive("/dashboard") ? "text-red-500" : "hover:text-red-500"}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleHomePage}
              data-testid="menu-item"
            >
              Home
            </motion.span>

            <motion.span
              className={`cursor-pointer ${isActive("/all-movies") ? "text-red-500" : "hover:text-red-500"}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleMoveToMovies}
              data-testid="menu-item"
            >
              Movies
            </motion.span>

            <motion.span
              className={`cursor-pointer ${isActive("/genre") ? "text-red-500" : "hover:text-red-500"}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleMoveToGenre}
              data-testid="menu-item"
            >
              Genre
            </motion.span>

            {user?.role === "supervisor" && (
              <motion.span
                className={`cursor-pointer ${isActive("/add-movie") ? "text-red-500" : "hover:text-red-500"}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={handleMoveToAddMovies}
                data-testid="menu-item"
              >
                Add Movies
              </motion.span>
            )}

            <motion.div className="flex items-center gap-5"
             initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}>
              <FiUser
                className={`cursor-pointer ${isActive("/profile") ? "text-red-500" : "hover:text-red-500"}`}
                onClick={toggleAccountMenu}
                data-testid="user-icon-button"
              />

              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 top-12 mt-2 w-70 bg-black/70 text-white rounded-lg shadow-lg p-4 z-50 gap-5"
                >
                  <div className="text-sm">
                    <p className="text-red-600 text-xl font-bold">
                      Welcome To <span className="text-xl font-bold text-red-600 cursor-pointer">
              M<span className="text-white">OVIEXPO!!</span>
            </span>
                    </p>
                    <p className="font-semibold">
                      Role : {user?.role || "Guest"}
                    </p>
                    <p className="text-white-600">Name : {user?.name}</p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex flex-col space-y-2 text-sm">
                    <button
                      className="cursor-pointer p-1 bg-red-600 border border-red-600 rounded-lg hover:text-white-500 cursor-pointer"
                      onClick={handleProfilePage}
                    >
                      More Info
                    </button>
                    <button
                      className="cursor-pointer p-1 bg-red-600 border border-red-600 rounded-lg hover:text-white-500"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}

{isPremium ? (
   <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
                  ⭐ Premium
                </span>
                ) : (
                <motion.button
                  className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold cursor-pointer"
                  onClick={handleSubscribeClick}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  data-testid="subscribe-button"
                >
                    Subscribe Now
                  </motion.button>
)}
            </motion.div>
          </div>

          {/* Mobile Icons */}
          <motion.div
            className="flex md:hidden items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FiUser
              className={`cursor-pointer ${isActive("/profile") ? "text-red-500" : "hover:text-red-500"}`}
              onClick={toggleAccountMenu}
              data-testid="user-icon-button"
            />

            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-12 mt-2 w-70 bg-black/80 text-white rounded-lg shadow-lg p-4 z-50 gap-5"
              >
                <div className="text-sm">
                  <p className="text-red-600 text-xl font-bold">
                    Welcome To <span className="text-xl font-bold text-red-600 cursor-pointer">
              M<span className="text-white">OVIEXPO!!</span>
            </span>
                  </p>
                  <p className="font-semibold">
                    Role : {user?.role || "Guest"}
                  </p>
                  <p className="text-white-600">Name : {user?.name}</p>
                </div>
                <hr className="my-2" />
                <div className="flex flex-col space-y-2 text-sm">
                  <button
                    className="cursor-pointer p-1 bg-red-600 border border-red-600 rounded-lg hover:text-white-500 cursor-pointer"
                    onClick={handleProfilePage}
                  >
                    More Info
                  </button>
                  <button
                    className="cursor-pointer p-1 bg-red-600 border border-red-600 rounded-lg hover:text-white-500"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}

            {showMobileMenu ? (
              <FaTimes
                className="text-2xl cursor-pointer hover:text-red-500"
                onClick={toggleMobileMenu}
                data-testid="close-menu"
              />
            ) : (
              <FaBars
                className="text-2xl cursor-pointer hover:text-red-500"
                onClick={toggleMobileMenu}
                data-testid="hamburger-menu"
              />
            )}
          </motion.div>
        </div>
      </div>
      {showMobileMenu && (
        <motion.div
          className="md:hidden bg-black/95 text-white px-6 py-4 space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {[
            { label: "Home", action: handleHomePage, path: "/dashboard" },
            { label: "Movies", action: handleMoveToMovies, path: "/all-movies" },
            { label: "Genre", action: handleMoveToGenre, path: "/genre" },
            ...(user?.role === "supervisor"
              ? [{ label: "Add Movies", action: handleMoveToAddMovies, path: "/add-movie" }]
              : []),
          ].map((item, index) => (
            <motion.span
              key={item.label}
              className={`block cursor-pointer ${isActive(item.path) ? "text-red-500" : "hover:text-red-400"}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={item.action}
              data-testid="menu-item"
            >
              {item.label}
            </motion.span>
          ))}

          <motion.button
            className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 w-full rounded-full text-sm font-semibold mt-4 cursor-pointer"
            onClick={handleSubscribeClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            data-testid="subscribe-button"
          >
            Subscribe Now
          </motion.button>
        </motion.div>
      )}
    </header>
  );
};

export default Header;