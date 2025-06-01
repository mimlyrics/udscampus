import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../slices/auth/authSlice";
import { useLogoutMutation } from "../slices/auth/usersApiSlice";

import mapImg from "../assets/map.png";
import analyticsImg from "../assets/purchase.png";
import cocoaBackground from "../../public/images/Campus A/PXL_20250302_060107348.jpg";

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [url, setUrl] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [connectedUsers, setConnectedUsers] = useState(42); // Example data

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logOutApiCall, { isLoading }] = useLogoutMutation();

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem("userInfo"));
    if (userStorage) {
      setUserCode(userStorage.user.code);
    }
  }, []);

  useEffect(() => {
    if (userCode) {
      setUrl(`${window.location.origin}/#/map?code=${userCode}`);
    }
  }, [userCode]);

  const handleLogout = async () => {
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      setErrMsg(err?.data?.message || "Échec de la déconnexion");
    }
  };

  const sidebarVariants = {
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 font-['Inter'] text-gray-900">
      {/* Menu mobile */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-64 z-40 shadow-2xl flex flex-col p-6 bg-gradient-to-b from-blue-100 to-blue-300 text-white"
          >
            <h2 className="text-3xl font-bold mb-10 font-['Poppins']">UDS Campus</h2>

            <nav className="space-y-4 text-lg">
              <Link 
                to="/map" 
                className="block hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-blue-700"
                onClick={() => setSidebarOpen(false)}
              >
                🌍 Carte interactive
              </Link>
              <button 
                className="block hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-blue-700 w-full text-left"
                onClick={handleLogout}
              >
                🔒 Déconnexion
              </button>
            </nav>

            <div className="mt-auto text-sm opacity-75">
              © 2025 UDS Campus
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        {/* En-tête principal */}
        <header className="relative h-80 md:h-96 rounded-b-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/90 z-10"></div>
          <img 
            src={cocoaBackground} 
            alt="Plantation de cacao" 
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Bouton menu mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-6 left-6 z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 md:hidden"
            aria-label="Menu navigation"
          >
            <span className="w-6 h-0.5 bg-white rounded-full transition-all" />
            <span className="w-6 h-0.5 bg-white rounded-full transition-all" />
            <span className="w-6 h-0.5 bg-white rounded-full transition-all" />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-['Poppins'] text-white mb-4">
              UDS Campus
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl">
              Suivi avancé et gestion pour une production durable de cacao
            </p>
          </motion.div>
        </header>

        {/* Contenu principal */}
        <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
          <section className="text-center mb-16 max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold mb-6 font-['Poppins']"
            >
              Bienvenue sur <span className="text-blue-700">UDS Campus</span>
            </motion.h2>
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 max-w-3xl mx-auto">
              Notre plateforme offre des outils complets pour suivre la production de cacao de la ferme au marché.
              Surveillez vos parcelles, analysez la productivité et assurez des pratiques durables.
            </p>
          </section>

          {/* Section des cartes */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 max-w-6xl mx-auto">
            {/* Carte de la carte interactive */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <img src={mapImg} alt="Carte" className="w-32 h-32 object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-blue-900 font-['Poppins']">
                    Carte interactive
                  </h3>
                  <p className="text-gray-600 mb-6 text-lg">
                    Visualisez toutes vos parcelles de cacao avec des limites détaillées, des données de productivité,
                    et des mises à jour en temps réel. Notre interface cartographique offre des contrôles intuitifs.
                  </p>
                  <Link
                    to="/map"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-md"
                  >
                    Ouvrir la carte
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Carte des analytiques */}
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100"
            >
              <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <img src={analyticsImg} alt="Analytiques" className="w-32 h-32 object-contain" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-blue-900 font-['Poppins']">
                    Statistiques
                  </h3>
                  <div className="mb-4">
                    <p className="text-4xl font-bold text-blue-600">{connectedUsers}</p>
                    <p className="text-gray-500">Utilisateurs connectés</p>
                  </div>
                  <p className="text-gray-600 mb-6 text-lg">
                    Consultez les données clés de votre réseau de production et les tendances d'utilisation.
                  </p>
                  <Link
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors shadow-md"
                    to={`/admin/dashboard`}
                  >
                    Voir les statistiques
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Section des fonctionnalités */}
          <section className="max-w-4xl mx-auto mb-16">
            <div className="bg-blue-50 rounded-2xl p-8 md:p-10 border border-blue-200">
              <h3 className="text-2xl md:text-3xl font-bold mb-6 text-center text-blue-900 font-['Poppins']">
                Fonctionnalités clés
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <h4 className="font-bold text-lg mb-2 text-blue-800">Suivi des parcelles</h4>
                  <p className="text-gray-600">
                    Surveillez chaque parcelle avec historique détaillé et indicateurs de productivité.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <h4 className="font-bold text-lg mb-2 text-blue-800">Durabilité</h4>
                  <p className="text-gray-600">
                    Suivez l'impact environnemental et assurez des pratiques agricoles durables.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <h4 className="font-bold text-lg mb-2 text-blue-800">Analyse des données</h4>
                  <p className="text-gray-600">
                    Outils avancés pour prévoir les rendements et analyser la qualité.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {errMsg && (
            <div className="text-center">
              <p className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
                {errMsg}
              </p>
            </div>
          )}
        </main>

        {/* Pied de page */}
        <footer className="bg-blue-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h4 className="font-bold text-lg mb-4 font-['Poppins']">Contactez-nous</h4>
              <p className="mb-2">(+237) 699 450 745</p>
              <p className="mb-2">(+237) 691 143 992</p>
              <p>romarickdeffo@gmail.com</p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 font-['Poppins']">Liens rapides</h4>
              <Link to="/map" className="block mb-2 hover:text-blue-200 transition-colors">
                Carte interactive
              </Link>
              <button onClick={handleLogout} className="hover:text-blue-200 transition-colors text-left">
                Déconnexion
              </button>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4 font-['Poppins']">À propos</h4>
              <p className="text-blue-200">
                UDS campus fournit des solutions numériques pour une culture durable du cacao au Cameroun.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-blue-800">
            <p className="text-center text-sm text-blue-300">
              © 2025 UDS CAMPUS Cameroun. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;