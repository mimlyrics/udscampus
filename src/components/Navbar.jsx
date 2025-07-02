import { useState, useEffect } from "react";
import { FaUser, FaAlignJustify, FaTimes, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";
import { logout } from "../slices/auth/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../public/images/uds_logo.png";
import UserLocationMap from "./UserLocationMap";
import { useCampus } from "./context/AppProvider";
const Navbar = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [errMsg, setErrMsg] = useState(false);
  const { token, userInfo } = useSelector((state) => state.auth) || {};
  const [logOutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let user = userInfo?.user;

const { lang, setLang, t } = useCampus();

const languages = [
  { code: "fr", labelKey: "lang_fr" },
  { code: "en", labelKey: "lang_en" },
  { code: "es", labelKey: "lang_es" },
  { code: "ar", labelKey: "lang_ar" },
  { code: "de", labelKey: "lang_de" },
  { code: "pt", labelKey: "lang_pt" },
];

  const userLocation = localStorage.getItem("userLocation");
  console.log(userLocation);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById("header");
      if (window.scrollY <= 0) {
        header.style.backgroundColor = "transparent";
        header.style.boxShadow = "none";
      } else {
        header.style.backgroundColor = "rgba(30, 58, 138, 0.95)";
        header.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = async () => {
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      setErrMsg(err?.data?.message || "Échec de la déconnexion");
      setTimeout(() => {
        setErrMsg(false);
      }, [3000])
    }
  };

  // Profile dropdown animation variants
  const profileVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {!userLocation && <UserLocationMap/>}
      {/* Main Navbar */}
      <nav
        id="header"
        className="flex items-center justify-between px-4 py-3 transition-all duration-300
         bg-blue-900 text-white"
      >
        {/* Logo and Brand */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Logo UDS"
            className="w-12 h-12 mr-3 cursor-pointer bg-white bg-opacity-20 rounded-lg"
            onClick={() => navigate("/")}
          />
          <span className="text-xl font-bold text-indigo-800 font-sans">UDS Campus</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {token ? (
            <>
              <Link
                to="/map"
                className="hover:text-blue-200 transition-colors px-3 py-2 rounded-lg"
              >
          {t.card}
              </Link>
              
              {/* Profile Button */}
              <div className="relative">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
                >
                  <FaUser className="text-lg" />
                  <span>{t.profile}</span>
                </button>
                    
                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={profileVariants}
                      transition={{ duration: 0.2 }}
                      className="absolute text-white right-0 mt-2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-50"
                    >
                      <div className="p-4 bg-blue-700 text-white">
                        <h3 className="font-bold">{t.myAccount}</h3>
                      </div>
                      <div className="p-4 text-gray-800">
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">{t.username}</p>
                          <p className="font-semibold">{user?.username || "Non disponible"}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">{t.phoneNumber}</p>
                          <p className="font-semibold">{user?.phone || "Non disponible"}</p>
                        </div>
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-500">{t.email}</p>
                          <p className="font-semibold">{user?.email || "Non disponible"}</p>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 text-right">
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center w-full px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <FaSignOutAlt className="mr-2" />
                          {t.logout}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
          {t.register}
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-blue-900 rounded-lg hover:bg-blue-100 transition-colors font-semibold"
              >
                Connexion
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={toggleMobileMenu}
        >
          {showMobileMenu ? <FaTimes /> : <FaAlignJustify />}
        </button>
      </nav>

<div className="absolute z-50 top-16 left-2 mb-8">
<select
  value={lang}
  onChange={(e) => setLang(e.target.value)}
  className="bg-white text-blue-900 font-semibold rounded-lg px-3 py-1 text-sm shadow-md hover:bg-gray-100 transition"
>
  {languages.map((l) => (
    <option key={l.code} value={l.code}>
      {t[l.labelKey] || l.code}
    </option>
  ))}
</select>
</div>
      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-blue-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              {token ? (
                <>
                  <Link
                    to="/map"
                    className="block px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                    {t.card}
                  </Link>
                  <button
                    onClick={toggleProfile}
                    className="flex items-center w-full px-3 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-700 transition-colors text-left"
                  >
                    <FaUser className="mr-2 " />
                    {t.profile}
                  </button>
                  {showProfile && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={profileVariants}
                      className="ml-4 mb-2 p-3 text-lg text-white bg-blue-900 rounded-lg"
                    >
                      <div className="mb-2">
                        <p className=" text-blue-200">{t.username}: {user?.username || "Non disponible"}</p>
                        <p className=" text-blue-200">phone: {user?.phone || "Non disponible"}</p>
                        <p className=" text-blue-200">email: {user?.email || "Non disponible"}</p>
                        
                      </div>

                    </motion.div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition-colors text-left"
                  >
                    <FaSignOutAlt className="mr-2" />
                    {t.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={toggleMobileMenu}
                  >
                   {t.register}
                  </Link>
                  <Link
                    to="/login"
                    className="block px-3 py-2 bg-white text-blue-900 rounded-lg font-semibold text-center"
                    onClick={toggleMobileMenu}
                  >
                    {t.login}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {errMsg && (
        <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
          {errMsg}
        </div>
      )}
    </div>
  );
};

export default Navbar;