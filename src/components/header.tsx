import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  const navigate = useNavigate();

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
    navigate("/");
  };

  const handleMoveToMovies = () => navigate("/all-movies");
  const handleMoveToGenre = () => navigate("/genre");
  const handleMoveToAddMovies = () => navigate("/add-movie");
  const handleHomePage = () => navigate("/dashboard");

  return (
    <header className="inset-0 bg-black/50 backdrop-blur-md text-white p-4 shadow-md sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={handleHomePage}>
            <div className="text-xl font-bold text-red-600 cursor-pointer">
              M<span className="text-white">OVIEXPO</span>
            </div>
          </button>
        </motion.div>

        <div className="flex items-center gap-2 relative">
            <div className="hidden md:flex items-center gap-6 text-md">
            <motion.span
              className="hover:text-red-500 cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={handleHomePage}
            >
              Home
            </motion.span>

            <motion.span
              className="hover:text-red-500 cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleMoveToMovies}
            >
              Movies
            </motion.span>

            <motion.span
              className="hover:text-red-500 cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={handleMoveToGenre}
            >
              Genre
            </motion.span>

            <motion.span
              className="hover:text-red-500 cursor-pointer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Contact
            </motion.span>

            {user?.role === "supervisor" && (
              <motion.span
                className="hover:text-red-500 cursor-pointer"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                onClick={handleMoveToAddMovies}
              >
                Add Movies
              </motion.span>
            )}
            <motion.div className="flex items-center gap-5">
              <FiUser
                className="cursor-pointer hover:text-red-500"
                onClick={toggleAccountMenu}
              />

              {showAccountMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 top-12 mt-2 w-70 bg-black/70 text-white rounded-lg shadow-lg p-4 z-50"
                >
                  <div className="text-sm">
                    <p className="text-red-600 text-xl font-bold">
                      Welcome To MovieExpo
                    </p>
                    <p className="font-semibold">
                      Role : {user?.role || "Guest"}
                    </p>
                    <p className="text-white-600">Email : {user?.email}</p>
                  </div>
                  <hr className="my-2" />
                  <div className="flex flex-col space-y-2 text-sm">
                    <span className="cursor-pointer hover:text-red-500">
                      Billing Statement
                    </span>
                    <button
                      className="cursor-pointer p-1 bg-red-600 border border-red-600 rounded-lg hover:text-white-500"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}

              <motion.button
                className="bg-red-700 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold"
                onClick={handleSubscribeClick}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                Subscribe Now
              </motion.button>
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
              className="cursor-pointer hover:text-red-500"
              onClick={toggleAccountMenu}
            />

            {showAccountMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="absolute right-0 top-12 mt-2 w-70 bg-black/80 text-white rounded-lg shadow-lg p-4 z-50"
              >
                <div className="text-sm">
                  <p className="text-red-600 text-xl font-bold">
                    Welcome To MovieExpo
                  </p>
                  <p className="font-semibold">
                    Role : {user?.role || "Guest"}
                  </p>
                  <p className="text-white-600">Email : {user?.email}</p>
                </div>
                <hr className="my-2" />
                <div className="flex flex-col space-y-2 text-sm">
                  <span className="cursor-pointer hover:text-red-500">
                    Billing Statement
                  </span>
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
              />
            ) : (
              <FaBars
                className="text-2xl cursor-pointer hover:text-red-500"
                onClick={toggleMobileMenu}
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
            { label: "Home", action: handleHomePage },
            { label: "Movies", action: handleMoveToMovies },
            { label: "Contact", action: () => {} },
            ...(user?.role === "supervisor"
              ? [{ label: "Add Movies", action: handleMoveToAddMovies }]
              : []),
          ].map((item, index) => (
            <motion.span
              key={item.label}
              className="block hover:text-red-400 cursor-pointer"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              onClick={item.action}
            >
              {item.label}
            </motion.span>
          ))}

          <motion.button
            className="bg-red-500 hover:bg-red-500 text-white px-4 py-2 w-full rounded-full text-sm font-semibold mt-4"
            onClick={handleSubscribeClick}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            Subscribe Now
          </motion.button>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
