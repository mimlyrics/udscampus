import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useMap } from 'react-leaflet';
import {
  FiMapPin, FiNavigation, FiMousePointer, FiX, FiClock,
} from 'react-icons/fi';
import { LuRoute, LuRuler } from 'react-icons/lu';
import { FaPencil } from 'react-icons/fa6';
import { FaMouse } from 'react-icons/fa';

const RoutingControl = ({ userLocation, errRoutingMessage, setErrRoutingMessage }) => {
  const map = useMap();
  const routingControlRef = useRef(null);
  const markerRef = useRef(null);
  const intervalRef = useRef(null);

  const [mode, setMode] = useState('current'); // current | manual | click
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [clickPoints, setClickPoints] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);

  const parseCoords = (str) => {
    const parts = str.split(',').map(s => parseFloat(s.trim()));
    return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])
      ? L.latLng(parts[0], parts[1])
      : null;
  };

  const handleMapClick = (e) => {
    if (mode === 'click') {
      setClickPoints(prev => {
        const updated = [...prev, e.latlng];
        return updated.length > 2 ? [e.latlng] : updated;
      });
    }
  };

  useEffect(() => {
    if (mode === 'click' && clickPoints.length === 2) {
      handleRoute(clickPoints[0], clickPoints[1]);
    }
  }, [clickPoints]);

  useEffect(() => {
    if (mode === 'click') {
      map.on('click', handleMapClick);
    } else {
      map.off('click', handleMapClick);
    }
    return () => map.off('click', handleMapClick);
  }, [mode, clickPoints]);

  const handleRoute = (customStart = null, customEnd = null) => {
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current);
      routingControlRef.current = null;
      setRouteInfo(null);
    }

    let origin, destination;

    if (mode === 'current') {
      if (!userLocation || !end) {
        setErrRoutingMessage('Provide destination.');
        return;
      }
      origin = L.latLng(userLocation.lat, userLocation.lng);
      destination = parseCoords(end);
    } else if (mode === 'manual') {
      origin = parseCoords(start);
      destination = parseCoords(end);
    } else if (mode === 'click') {
      if (!customStart || !customEnd) {
        setErrRoutingMessage('Click two points on the map.');
        return;
      }
      origin = customStart;
      destination = customEnd;
    }

    if (!origin || !destination) {
      setErrRoutingMessage('Cordonee invalid, utiliser le format (lat,lng');
      setTimeout(() => setErrRoutingMessage(false), 3000);
      return;
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [origin, destination],
      routeWhileDragging: false,
      draggableWaypoints: true,
      addWaypoints: false,
      fitSelectedRoutes: true,
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      show: false,
    })
      .on('routesfound', function (e) {
        const route = e.routes[0];
        const summary = route.summary;
        setRouteInfo({
          distance: (summary.totalDistance / 1000).toFixed(2),
          duration: (summary.totalTime / 60).toFixed(1),
          steps: route.instructions?.length || route?.coordinates.length || 'N/A',
        });
      })
      .on('routingerror', function (e) {
        console.error('Routing error:', e.error);
        setRouteInfo(null);
      })
      .addTo(map);

    // Blinking origin marker
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
    setStart('');
    setEnd('');
    setClickPoints([]);
    setRouteInfo(null);
  };

  return (
    <div className="absolute mt-40 top-4 left-4 z-[1000] w-[90%] max-w-xs md:max-w-sm bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl space-y-3 border border-gray-300">
      <h3 className="text-lg font-bold text-blue-800 flex items-center gap-2">
        <LuRoute /> Route Planner
      </h3>

      <div>
        <label className="text-sm font-semibold">Select Mode</label>
        <select
          value={mode}
          onChange={(e) => {
            setMode(e.target.value);
            setClickPoints([]);
          }}
          className="w-full mt-1 p-2 border border-gray-300 rounded text-sm"
        >
          <option value="current">🧍 Current ➝ Destination</option>
          <option value="manual"> <FaPencil className='text-slate-900 text-xl'/> Start ➝ Destination (manual)</option>
          <option value="click"> <FaMouse className='text-slate-900 text-xl'/> Click 2 Points on Map</option>
        </select>
      </div>

      {mode === 'manual' && (
        <input
          type="text"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          placeholder="Start (lat,lng)"
          className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
      )}

      {mode !== 'click' && (
        <input
          type="text"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          placeholder="End (lat,lng)"
          className="w-full border border-gray-300 p-2 rounded text-sm focus:ring-2 focus:ring-blue-500"
        />
      )}

      {mode === 'click' && (
        <p className="text-sm text-gray-600 flex items-center gap-1">
          <FiMousePointer />
          Click {2 - clickPoints.length} point(s) on the map
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handleRoute()}
          disabled={mode === 'click'}
          className={`w-full flex items-center justify-center gap-2 ${mode === 'click' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white py-2 rounded transition font-semibold`}
        >
          <FiNavigation /> Calculate Route
        </button>

        <button
          onClick={handleClear}
          className="w-full flex items-center justify-center gap-2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition font-semibold"
        >
          <FiX /> Clear
        </button>
      </div>

      {routeInfo && (
        <div className="text-sm text-gray-700 bg-gray-100 p-2 rounded shadow-inner space-y-1">
          <p className="flex items-center gap-1">
            <LuRuler /> Distance: <strong>{routeInfo.distance} km</strong>
          </p>
          <p className="flex items-center gap-1">
            <FiClock /> Duration: <strong>{routeInfo.duration} min</strong>
          </p>
          <p className="flex items-center gap-1">
            <FiMapPin /> Steps: <strong>{routeInfo.steps}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default RoutingControl;
