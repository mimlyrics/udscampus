import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import {
  FiMapPin, FiNavigation, FiMousePointer, FiX, FiClock,
} from 'react-icons/fi';
import { useCampus } from '../context/AppProvider';
import { LuRouter, LuRuler } from 'react-icons/lu';
import {
  FiCornerLeftDown, FiCornerRightDown,
} from 'react-icons/fi';
import {
  MdStraight, MdTurnLeft, MdLocationOn
} from 'react-icons/md';

const RoutingControl = ({ userLocation, errRoutingMessage, setErrRoutingMessage }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const markerRef = useRef(null);
  const intervalRef = useRef(null);
  const [showRouteModal, setShowRouteModal] = useState(true);

  const { t, lang } = useCampus();

  const [mode, setMode] = useState('click');
  const [clickPoints, setClickPoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  useEffect(() => {
    if (userLocation && !localStorage.getItem('userLocation')) {
      localStorage.setItem('userLocation', JSON.stringify(userLocation));
    }
  }, [userLocation]);

  const handleMapClick = (e) => {
    if (mode === 'click') {
      setClickPoints(prev => {
        const updated = [...prev, e.latlng];
        if (updated.length === 2) {
          handleRoute(updated[0], updated[1]);
        }
        return updated.length > 2 ? [e.latlng] : updated;
      });
    } else if (mode === 'current') {
      const stored = localStorage.getItem('userLocation');
      const current = stored ? JSON.parse(stored) : null;
      if (!current) {
        setErrRoutingMessage('Position actuelle introuvable.');
        setTimeout(() => setErrRoutingMessage(false), 3000);
        return;
      }
      handleRoute(L.latLng(current.lat, current.lng), e.latlng);
    }
  };

  useEffect(() => {
    map.on('click', handleMapClick);
    return () => map.off('click', handleMapClick);
  }, [mode]);

  const handleRoute = (origin, destination) => {
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (err) {
        console.warn("Erreur lors du retrait du contrôle :", err);
      }
      routingControlRef.current = null;
      setRouteInfo(null);
    }

    if (!map || !origin || !destination) {
      setErrRoutingMessage("Carte non prête ou coordonnées invalides.");
      setTimeout(() => setErrRoutingMessage(false), 3000);
      return;
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [origin, destination],
      routeWhileDragging: false,
      draggableWaypoints: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      language: 'fr',
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        language: 'fr',
      }),
    })
      .on('routesfound', function (e) {
        const route = e.routes[0];
        const summary = route.summary;
        const instructions = route.instructions?.map(i => i.text) || [];

        setRouteInfo({
          distance: (summary.totalDistance / 1000).toFixed(2),
          duration: (summary.totalTime / 60).toFixed(1),
          steps: `${instructions.length} ${t.steps}`,
          instructions
        });
      })
      .on('routingerror', function (e) {
        console.error('Routing error:', e.error);
        setRouteInfo(null);
      })
      .addTo(map);

    if (markerRef.current) {
      markerRef.current.setLatLng(origin);
    } else {
      const redIcon = L.divIcon({
        className: '',
        html: `<div class="w-[16px] h-[16px] rounded-full bg-red-700 shadow-md border border-white"></div>`,
      });
      markerRef.current = L.marker(origin, { icon: redIcon }).addTo(map);
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const el = markerRef.current.getElement();
      if (el) el.style.visibility = el.style.visibility === 'hidden' ? 'visible' : 'visible';
    }, 700);
  };

  const handleClear = () => {
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
    }
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setClickPoints([]);
    setRouteInfo(null);
  };

  const getIconForInstruction = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('gauche')) return <FiCornerLeftDown className="text-red-600" />;
    if (lower.includes('droite')) return <FiCornerRightDown className="text-blue-600" />;
    if (lower.includes('demi-tour')) return <MdTurnLeft className="text-orange-600" />;
    if (lower.includes('continuez') || lower.includes('tout droit')) return <MdStraight className="text-gray-800" />;
    if (lower.includes('destination')) return <MdLocationOn className="text-pink-600" />;
    return <MdStraight className="text-gray-500" />;
  };

  return (
    <>
      <button
        onClick={() => setShowRouteModal(!showRouteModal)}
        className="absolute mt-36 left-1 z-[1001] bg-white rounded-full p-2 shadow-md hover:scale-105 transition"
        title={showRouteModal ? t.hideRouting : t.showRouting}
      >
        {showRouteModal ? (
          <FiX className="text-red-600" size={20} />
        ) : (
          <LuRouter className="text-blue-700" size={20} />
        )}
      </button>

      {showRouteModal && (
        <div className="absolute mt-40 top-1 left-1 z-[1000] w-[50%] md:w-[90%] max-w-xs md:max-w-sm bg-gradient-to-r from-[rgba(34,34,56,0.4)] to-[rgba(9,9,49,0.9)] backdrop-blur-md p-4 rounded-xl shadow-xl space-y-3 border border-gray-300">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <LuRouter /> {t.routePlanner}
          </h3>

          <div className="text-indigo-700">
            <label className="text-sm font-semibold">{t.selectMode}</label>
            <select
              value={mode}
              onChange={(e) => {
                setMode(e.target.value);
                setClickPoints([]);
              }}
              className="w-full mt-1 p-2 border border-gray-100 rounded text-sm"
            >
              <option value="current">{t.currentToDestination}</option>
              <option value="click">{t.clickPointsOnTheMap}</option>
            </select>
          </div>

          {mode === 'click' && (
            <p className="text-sm text-white flex items-center gap-1">
              <FiMousePointer />
              Cliquez sur {2 - clickPoints.length} point(s) sur la carte
            </p>
          )}

          {mode === 'current' && (
            <p className="text-sm text-white flex items-center gap-1">
              <FiMousePointer />
              Cliquez sur votre destination sur la carte
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleClear}
              className="w-full flex items-center justify-center gap-2 text-white py-2 rounded hover:bg-gray-300 transition font-semibold bg-red-600 hover:bg-red-700"
            >
              <FiX /> Effacer
            </button>
          </div>

          {routeInfo && (
            <div className="text-sm text-black bg-yellow-200 p-3 rounded shadow-inner space-y-2 font-bold max-h-80 overflow-auto">
              <p className="flex items-center gap-2">
                <LuRuler className="text-purple-700" /> Distance: <span>{routeInfo.distance} km</span>
              </p>
              <p className="flex items-center gap-2">
                <FiClock className="text-green-700" /> {t.duration}: <span>{routeInfo.duration} min</span>
              </p>
              <p className="flex items-center gap-2">
                <FiMapPin className="text-blue-700" /> {routeInfo.steps}
              </p>
              <ul className="space-y-1 list-disc list-inside">
                {routeInfo.instructions?.map((step, i) => (
                  <li key={i} className="flex items-center gap-2 text-black">
                    {getIconForInstruction(step)} <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default RoutingControl;