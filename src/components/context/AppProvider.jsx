import {useState, useContext, createContext} from "react";
const MimlyricsContext = createContext();
export function useMimlyrics () {
    return useContext(MimlyricsContext);
}
const AppProvider = ({children}) => {
  const [language, setLanguage] = useState("");
  const [isActiveModalNavbar, setIsActiveModalNavbar] = useState(false);
  const [isActivePage, setIsActivePage] = useState(false);
  const value = {
    language: language,
    isActiveModalNavbar: isActiveModalNavbar,
    setIsActiveModalNavbar: setIsActiveModalNavbar,
    isActivePage: setIsActivePage,
  }

  return (
    <MimlyricsContext.Provider value={value}>
      {children}
    </MimlyricsContext.Provider>
  )
}

export default AppProvider















/*import axios from "axios";
import {useState, useContext , createContext, useEffect} from "react";
const mimlyricsContext = createContext();
const BASE_URL = "http://localhost:5000/api/v1"
export function useMimlyrics() {
  return useContext(mimlyricsContext);
}

const AppProvider = ({children}) => {
  const [opacity, setOpacity] = useState("");
  const [room, setRoom] = useState("");
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      const res = await axios.get(`${BASE_URL}/room`, {headers: {withCredentials: true}});
      setRooms(res.data.rooms);
    }
    getRooms()
  }, []);

  const value = {
    opacity: opacity,
    setOpacity: setOpacity,
    rooms: rooms,
    setRooms: setRooms,
  }

  return (
    <mimlyricsContext.Provider value={value}>
        {children}      
    </mimlyricsContext.Provider>
  )
}

export default AppProvider*/
