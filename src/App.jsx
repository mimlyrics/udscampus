import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/authUser/Register";
import Login from "./components/Login";
//import Footer from "./components/Footer";
import { Navigate } from "react-router-dom";
import "./index.css";
import Home from "./components/Home";
import Map from "./components/Map";
import { useSelector } from "react-redux";
import Test from "./components/Test";
import AdminUser from "./components/admin/AdminUser";
import AdminDashBoard from "./components/admin/AdminDashBoard";
import AdminAddUser from "./components/admin/AdminAddUser";
import AdminEditUser from "./components/admin/AdminEditUser";

import RequireAuth from "./components/authMiddleware/RequireAuth";

import RequireAdmin from "./components/authMiddleware/RequireAdmin";
import RequireEditor from "./components/authMiddleware/RequireEditor";
import ErrorMiddleware from "./components/authMiddleware/ErrorMiddleware";
import Assistance from "./components/policy/Assistance";
import About from "./components/About";
import Privacy from "./components/policy/Privacy";
import Termsofuse from "./components/policy/Termsofuse";
import Cookiepolicy from "./components/policy/Cookiepolicy";
import Help from "./components/setting/Help";
import Settings from "./components/setting/Settings";
import Location from "./components/Location";
import VerifyEmailCode from "./components/authUser/VerifyEmailCode";
import Profile from "./components/Profile";

import 'leaflet/dist/leaflet.css';
import { HashRouter,BrowserRouter } from "react-router-dom";
function App() {
  const {userInfo} = useSelector(state => state.auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditor, setIsEditor] = useState(false);
  
  //console.log(isAdmin, isEditor);
  return (
   
    <HashRouter basename="/">   
      <Navbar/>
      <Routes>        
      {/**Public routes */}    
        <Route path="/" element={<Home/>} />       
        <Route path="/map" element={<Map/>}/>
        <Route path="/assistance" element={<Assistance/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/termsofuse" element={<Termsofuse/>}/>
        <Route path="/privacy" element={<Privacy/>}/>
        <Route path="/cookie" element={<Cookiepolicy/>}/>
        <Route path="/help" element={<Help/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/location" element={<Location/>}/>
        <Route path="/auth/error" element={<ErrorMiddleware/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/verifyEmailCode" element={<VerifyEmailCode/>}/>   
      </Routes>

        <Routes>
          {/** RequireAuth routes */}
          <Route element={<RequireAuth/>}>
            <Route path="/test" element={<Test/>}/>
            {/** videos, lyric, chats */}
          </Route>
        </Routes>
     

        {/** Protected Admin routes */}
        <Routes>
            <Route element={<RequireAuth/>}>
              <Route path="/profile" element={<Profile/>}/>
              <Route path="/admin/user" element={<AdminUser/>}/>
              <Route path="/admin/dashboard" element={<AdminDashBoard/>}/>
              <Route path="/admin/user/add" element={<AdminAddUser/>}/>
              <Route path="/admin/user/edit" element={<AdminEditUser/>}/>
        

            </Route>      
        </Routes>

        {/**Protected Editor routes */}
        <Routes >
          <Route element={<RequireEditor/>}>  
          </Route>
        </Routes>
    </HashRouter>
  );
}

export default App;