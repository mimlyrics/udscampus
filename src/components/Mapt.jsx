import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Popup, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
//import 'leaflet/dist/leaflet.css';
//import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import axios from 'axios';
import { motion } from 'framer-motion';
//import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import Sidebar from './utility/SideBar';
import RoutingControl from './utility/RoutingControl';
import Legend from './utility/Legend';
const facultyColors = {
  'Bâtiments Administratifs': '#f44336',
  'Dortoires Universitaires': '#9e9e9e',
  'F.A.S.A': '#4caf50',
  'F.L.S.H': '#FFB6C1',
  'F.M.S.P': '#2196f3',
  'F.S': '#e91e63',
  'F.S.J.P': '#795548',
  'Complexe Sportifs': '#3AB09E',
  'Toilettes Publiques': '#9932CC',
  'Points de Récréation': '#D2691E',
  'Résidences Privées': 'grey',
  'Restaurants Universitaires': 'brown',
  "Châteaux d’eau": 'purple',
  'Centre de Santé': 'blue',
  'Arrêt Bus': 'lightsalmon',
  'Points Commerciaux': '#DDA0DD',
  'Parking': 'purple',
  'F.L.S.H/F.S': '#FF7F50',
  'F.L.S.H/F.A.S.A/F.S': '#DAA520',
  'default': '#a5d6a7'
};

const translations = {
  en: {
    title: "UDS Campus Map",
    welcome: "Welcome to the Futuristic Map of UDS! Navigate your path with ease and style.",
    buildingInfo: "Building Info",
    selectBuilding: "Select a building to see details.",
    currentWeather: "Current Weather",
    enableRouting: "Enable Routing",
    disableRouting: "Disable Routing",
    clearRoute: "Clear Route",
    searchPlaceholder: "Search building...",
    filterFaculty: "Filter by Faculty"
  },
  fr: {
    title: "Carte du Campus de l'UDS",
    welcome: "Bienvenue sur la carte futuriste de l'UDS ! Naviguez avec style et facilité.",
    buildingInfo: "Informations sur le bâtiment",
    selectBuilding: "Sélectionnez un bâtiment pour voir les détails.",
    currentWeather: "Météo actuelle",
    enableRouting: "Activer le routage",
    disableRouting: "Désactiver le routage",
    clearRoute: "Effacer l'itinéraire",
    searchPlaceholder: "Rechercher un bâtiment...",
    filterFaculty: "Filtrer par faculté"
  }
};

const Mapt= () => {
  const [features, setFeatures] = useState([]);
  const [weather, setWeather] = useState(null);
  const [lang, setLang] = useState('en');
  const [routingEnabled, setRoutingEnabled] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [routeControl, setRouteControl] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const mapRef = useRef();
  const t = translations[lang];
  const [buildingData, setBuildingData] = useState(null);
    useEffect(() => {
    // Fetch building data
    axios
      .get('http://localhost:8080/geoserver/UDS_map/ows', {
        params: {
          service: 'WFS',
          version: '1.0.0',
          request: 'GetFeature',
          typeName: 'UDS_map:UDS_C',
          outputFormat: 'application/json',
        },
      })
      .then((response) => {
        setBuildingData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching building data:', error);
      });
  }, []);

  useEffect(() => {
    axios.get("https://api.open-meteo.com/v1/forecast?latitude=5.448&longitude=10.059&current=temperature_2m,weathercode&timezone=Africa%2FLagos")
      .then(res => setWeather(res.data.current));

    axios.get("http://localhost:8080/geoserver/UDS_map/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=UDS_map%3AUDS_C&outputFormat=application%2Fjson")
      .then(res => setFeatures(res.data.features));
  }, []);

  const onEachFeature = (feature, layer) => {
    const { name, faculty, a_propos, image } = feature.properties;
    const coords = layer.getBounds().getCenter();
    const popupContent = `
      <strong>${name}</strong><br/>
      Faculty: ${faculty}<br/>
      <img src="${image}" style="width:100px;" />
    `;
    layer.bindPopup(popupContent);

    layer.on('click', () => {
      if (routingEnabled) {
        if (!startPoint) {
          setStartPoint(coords);
          alert("Start point set. Click your destination.");
        } else {
          if (routeControl) {
            mapRef.current.removeControl(routeControl);
          }
          const control = L.Routing.control({
            waypoints: [L.latLng(startPoint.lat, startPoint.lng), L.latLng(coords.lat, coords.lng)],
          }).addTo(mapRef.current);
          setRouteControl(control);
          setStartPoint(null);
        }
      }
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        selectedBuilding={selectedBuilding}
        setRoutingEnabled={setRoutingEnabled}
        routingEnabled={routingEnabled}
      />
      <motion.div initial={{ x: -300 }} animate={{ x: 0 }} className="w-full md:w-[360px] p-4 bg-gradient-to-br from-white/80 via-yellow-50/80 to-green-50/80 backdrop-blur-md shadow-xl z-10 border-r-4 border-green-700 flex flex-col gap-4">
        <div className="flex items-center gap-4 border-b-4 border-green-700 pb-2">
          <img src="uds_logo.png" alt="logo" className="w-14 h-14 rounded" />
          <h3 className="text-green-800 text-lg font-bold">{t.title}</h3>
        </div>
        <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-green-800 text-sm font-bold text-center bg-gradient-to-r from-yellow-300 to-lime-400 p-3 rounded-lg">
          {t.welcome}
        </motion.div>
        <input type="text" placeholder={t.searchPlaceholder} className="p-2 rounded border border-gray-300 bg-green-50 focus:outline-none focus:ring focus:ring-green-300" />
        <select className="p-2 rounded border border-gray-300 bg-green-50">
          <option>{t.filterFaculty}</option>
        </select>
        <div className="bg-yellow-50 p-3 rounded border-l-4 border-green-700">
          <h4 className="font-bold mb-2">{t.buildingInfo}</h4>
          <p>{t.selectBuilding}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded border-l-4 border-green-700">
          <h4 className="font-bold mb-2">{t.currentWeather}</h4>
          <p>{weather ? `${weather.temperature_2m}°C, Code: ${weather.weathercode}` : 'Loading...'}</p>
        </div>
        <button onClick={() => setRoutingEnabled(!routingEnabled)} className="mt-2 bg-green-700 text-white p-2 rounded">
          {routingEnabled ? t.disableRouting : t.enableRouting}
        </button>
        <button onClick={() => {
          if (routeControl) {
            mapRef.current.removeControl(routeControl);
            setRouteControl(null);
          }
          setStartPoint(null);
        }} className="mt-2 bg-red-600 text-white p-2 rounded">
          {t.clearRoute}
        </button>
        <select onChange={(e) => setLang(e.target.value)} className="mt-auto bg-green-100 p-2 rounded">
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </motion.div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer center={[5.448, 10.059]} zoom={16} scrollWheelZoom ref={mapRef} className="h-full w-full z-0">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ScaleControl position="bottomleft" />
          <GeoJSON data={features} style={feature => ({
            color: '#2e7d32',
            weight: 0.5,
            fillColor: facultyColors[feature.properties.faculty] || facultyColors.default,
            fillOpacity: 0.85
          })} onEachFeature={onEachFeature} />
          {routingEnabled && <RoutingControl/>}
        </MapContainer>
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white text-sm p-4 rounded-lg border-l-4 border-green-700 max-w-xs z-10">
          {Object.entries(facultyColors).filter(([key]) => key !== 'default').map(([key, color]) => (
            <div key={key} className="flex items-center gap-2 mb-1">
              <div style={{ background: color }} className="w-4 h-4 rounded"></div>
              {key}
            </div>
          ))}
        </div>
        <Legend/>
      </div>
    </div>
  );
};

export default Mapt;
