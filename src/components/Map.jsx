import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { motion } from 'framer-motion';
import Sidebar from './utility/SideBar';
import RoutingControl from './utility/RoutingControl';
import facultyColors from './constants/facultyColor';
import translations from './constants/translations';

// Define custom font classes
const fontStyles = {
  comic: 'font-comic',
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
  fancy: 'font-fancy'
};

const themes = {
  vibrant: {
    name: 'Vibrant',
    mapBorder: 'border-4 border-yellow-400',
    sidebarBg: 'bg-gradient-to-b from-blue-100 to-blue-900',
    sidebarText: 'text-purple-500',
    button: 'bg-gradient-to-r from-blue-900 to-purple-900 text-white',
    legendBg: 'bg-white bg-opacity-100',
    legendText: 'text-blue-900',
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    font: 'font-sans',
    select: 'text-lg'
  },
  midnight: {
    name: 'Midnight',
    mapBorder: 'border-4 border-indigo-800',
    sidebarBg: 'bg-gradient-to-b from-gray-900 to-blue-300',
    sidebarText: 'text-blue-700',
    button: 'bg-gradient-to-r from-blue-600 to-indigo-800 text-white',
    legendBg: 'bg-gray-800 bg-opacity-90',
    legendText: 'text-blue-600',
    tileLayer: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    font: 'font-sans',
    select: 'text-lg'
  },
  nature: {
    name: 'Nature',
    mapBorder: 'border-4 border-green-500',
    sidebarBg: 'bg-gradient-to-b from-green-50 to-teal-100',
    sidebarText: 'text-green-900',
    button: 'bg-gradient-to-r from-green-600 to-teal-600 text-white',
    legendBg: 'bg-white bg-opacity-90',
    legendText: 'text-green-900',
    tileLayer: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    font: 'font-comic',
    select: 'text-lg'
  },
  classic: {
    name: 'Classic',
    mapBorder: 'border-4 border-amber-700',
    sidebarBg: 'bg-gradient-to-b from-amber-50 to-orange-100',
    sidebarText: 'text-amber-900',
    button: 'bg-gradient-to-r from-amber-600 to-orange-600 text-white',
    legendBg: 'bg-white bg-opacity-90',
    legendText: 'text-amber-900',
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    font: 'font-serif',
    select: 'text-lg'
  }
};

const Map = () => {
  const [weather, setWeather] = useState(null);
  const [lang, setLang] = useState('fr');
  const [routingEnabled, setRoutingEnabled] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [routeControl, setRouteControl] = useState(null);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [buildingGeojson, setBuildingGeojson] = useState(null);
  const [limitGeojson, setLimitGeojson] = useState(null);
  const [routesGeojson, setRoutesGeojson] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [currentTheme, setCurrentTheme] = useState('vibrant');
  const [currentFont, setCurrentFont] = useState('sans');
  const mapRef = useRef();
  const t = translations[lang];
  //console.log(t);

  //console.log(translations);
const storedLocation = localStorage.getItem("userLocation");
const userLocation = storedLocation ? JSON.parse(storedLocation) : null;

const { lat, lng } = userLocation ?? { lat: 3.848, lng: 11.502 };
//console.log(userLocation, lat, lng);


  useEffect(() => {
    setRoutingEnabled(routingEnabled);
  }, [routingEnabled])

  const [errRoutingMessage, setErrRoutingMessage] = useState(false);
  
  useEffect(() => {
    // Fetch current weather (unchanged)
    axios
      .get(
        "https://api.open-meteo.com/v1/forecast?latitude=5.448&longitude=10.059&current=temperature_2m,weathercode&timezone=Africa%2FLagos"
      )
      .then((res) => setWeather(res.data.current));

    // Load GeoJSONs
    axios
      .get("/data/UDS_updated.geojson")
      .then((res) => setBuildingGeojson(res.data))
      .catch((err) => console.error("Error loading buildingGeojson:", err));

    axios
      .get("/data/Limit.geojson")
      .then((res) => setLimitGeojson(res.data))
      .catch((err) => console.error("Error loading Limit.geojson:", err));

    axios
      .get("/data/Routes.geojson")
      .then((res) => setRoutesGeojson(res.data))
      .catch((err) => console.error("Error loading Routes.geojson:", err));
  }, []);

const onEachFeature = (feature, layer) => {
  const { name, Faculty, A_propos, IMAGE } = feature.properties;
  const coords = layer.getBounds().getCenter();

  layer.on("click", () => {
    if (routingEnabled) {
      // Routing
      if (!startPoint) {
        setStartPoint(coords);
        alert(t.setStartPoint || "Start point set");
      } else {
        if (routeControl) {
          mapRef.current.removeControl(routeControl);
        }
        const control = L.Routing.control({
          waypoints: [
            L.latLng(startPoint.lat, startPoint.lng),
            L.latLng(coords.lat, coords.lng),
          ],
        }).addTo(mapRef.current);
        setRouteControl(control);
        setStartPoint(null);
      }
    } else {
      // Popup
      setSelectedBuilding({
        name,
        faculty: Faculty,
        description: A_propos,
        image: IMAGE,
      });

      const fontClass = fontStyles[currentFont] || "font-sans";
      const labelFaculty = t?.faculty || "Faculty";
      const labelBuilding = t?.building || "Building";
      const imageUrl = IMAGE || "https://via.placeholder.com/150";

      const popupContent = `
        <div class="${fontClass}">
          <strong class="text-lg">${labelFaculty}: ${Faculty || "N/A"}</strong><br/>
          <span class="font-bold">${labelBuilding}:</span> ${name || "N/A"}<br/>
          <img src="${imageUrl}" class="w-full h-24 object-cover rounded-lg mt-2" />
        </div>
      `;

      L.popup()
        .setLatLng(coords)
        .setContent(popupContent)
        .openOn(mapRef.current);
    }
  });
};


  const theme = themes[currentTheme];

  const handleTheme = (key) => {

    setCurrentTheme(key);
    if (key === "nature") setCurrentFont("comic");
    else if (key === "classic") setCurrentFont("serif");
    else setCurrentFont("sans");
    
  }

  return (
    <div>

     {errRoutingMessage && <div className=' absolute z-50 left-[10%] md:left-[50%] md:top-[10%] text-center text-red-700 text-lg underline animate-bounce'>{errRoutingMessage}</div>}
    <motion.div
      className={`
        flex 
        mt-20 
        flex-col md:flex-row 
        w-full 
        h-screen 
        ${theme.sidebarBg} 
        ${theme.sidebarText} 
        ${fontStyles[currentFont]}
      `}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >

     
      {/* === Sidebar === */}
      <Sidebar
        selectedBuilding={selectedBuilding}
        setRoutingEnabled={setRoutingEnabled}
        routingEnabled={routingEnabled}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        theme={theme}
      />

      {/* === Map Wrapper  THEME === */}
      {/* 
        • On mobile: we give this a fixed 90vh height so that, even if the sidebar pushes content, 
          the map area does not shrink too much.
        • On desktop (md+), it flexes to fill remaining space.
      */}
      <div className="relative h-[200vh] md:flex-1 md:h-auto">
        {/* Theme & Font Buttons (unchanged) */}
        <div className="absolute top-4 left-4 z-50 flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(themes).map(([key, themeObj]) => (
              <button
                key={key}
                onClick={() => handleTheme(key)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all 
                  ${
                    currentTheme === key
                      ? "ring-2 ring-white scale-105"
                      : "opacity-90 hover:opacity-100"
                  } 
                  ${themeObj.button}
                `}
              >
                {themeObj.name}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="bg-white bg-opacity-80 p-2 rounded-lg shadow-md">
              <label className="block font-bold mb-1">{t.fontStyle}:</label>
              <select
                value={currentFont}
                onChange={(e) => setCurrentFont(e.target.value)}
                className={`w-full p-2 rounded border ${theme.select}`}
              >
                {Object.entries(fontStyles).map(([key, _]) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* === The Leaflet MapContainer === */}
        <MapContainer
          center={[5.448, 10.059]}
          zoom={16}
          scrollWheelZoom
          ref={mapRef}
          className={`h-full w-full absolute z-10 inset-0 ${theme.mapBorder} shadow-xl`}
        >
          <TileLayer
            url={theme.tileLayer}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <ScaleControl position="bottomleft" />

          {buildingGeojson &&  (
            <GeoJSON
              key={routingEnabled ? "routing" : "popup"}
              data={{
                ...buildingGeojson,
                features: buildingGeojson.features.filter((feature) => {
                  const faculty = (feature.properties.Faculty || "").trim();
                  return (
                    !selectedFaculty || faculty === selectedFaculty.trim()
                  );
                })
              }}

              style={(feature) => {
                const normalizedFaculty = (
                  feature.properties.Faculty || ""
                ).trim();
                return {
                  color: "white",
                  weight: 1,
                  fillColor:
                    facultyColors[normalizedFaculty] ||
                    facultyColors.default,
                  fillOpacity: 0.85
                };
              }}

              onEachFeature={onEachFeature}
            />
          )}

          {limitGeojson && (
            <GeoJSON
              data={limitGeojson}
              style={{
                color: theme.mapBorder.includes("border-amber")
                  ? "white"
                  : "black",
                weight: 3,
                fillOpacity: 0
              }}
            />
          )}

          {routesGeojson && (
            <GeoJSON
              data={routesGeojson}
              style={{
                color: theme.sidebarText.includes("text-blue-100")
                  ? "rgba(200, 200, 255, 0.7)"
                  : "rgba(100, 100, 100, 0.7)",
                weight: 2,
                dashArray: "5, 5"
              }}
            />
          )}

          {routingEnabled && <RoutingControl errRoutingMessage={errRoutingMessage} setErrRoutingMessage={setErrRoutingMessage} userLocation={userLocation} />}
        </MapContainer>

        {/* === Desktop Legend (hidden on mobile) === */}
        <motion.div
          className={`
            absolute z-30 top-2 right-2
            hidden md:block 
            ${theme.legendBg} ${theme.legendText} 
            p-2 rounded-lg border-l-4 border-purple-500 
            max-w-xs shadow-xl 
            ${fontStyles[currentFont]}
          `}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-2">{t.facultyLegend}</h3>
          {Object.entries(facultyColors)
            .filter(([key]) => key !== "default")
            .map(([key, color]) => (
              <div key={key} className="flex items-center gap-3 mb-2">
                <div
                  style={{ background: color }}
                  className="w-6 h-6 rounded-full border border-white"
                ></div>
                <span className="text-sm font-medium">{key}</span>
              </div>
            ))}
        </motion.div>

        {/* === Mobile Legend (collapsible) === */}
        <div className="absolute bottom-4 right-4 z-20 md:hidden">
          <details className="bg-white bg-opacity-90 p-2 rounded shadow-md">
            <summary className="cursor-pointer text-sm font-semibold">
              {t.facultyLegend}
            </summary>
            <div className="mt-2 space-y-2">
              {Object.entries(facultyColors)
                .filter(([key]) => key !== "default")
                .map(([key, color]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div
                      style={{ background: color }}
                      className="w-4 h-4 rounded-full border border-gray-400"
                    ></div>
                    <span className="text-xs">{key}</span>
                  </div>
                ))}
            </div>
          </details>
        </div>

      </div>



    </motion.div>
        
      {/* <motion.div
          className={`
            md:hidden 
            ${theme.legendBg} ${theme.legendText} 
            p-4 rounded-lg border-l-4 border-purple-500 
            max-w-xs z-50 shadow-xl 
            ${fontStyles[currentFont]}
          `}
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-2">{t.facultyLegend}</h3>
          {Object.entries(facultyColors)
            .filter(([key]) => key !== "default")
            .map(([key, color]) => (
              <div key={key} className="flex items-center gap-3 mb-2">
                <div
                  style={{ background: color }}
                  className="w-6 h-6 rounded-full border border-white"
                ></div>
                <span className="text-md font-medium">{key}</span>
              </div>
            ))}
        </motion.div>
      */}

    </div>
  );
};

export default Map;

