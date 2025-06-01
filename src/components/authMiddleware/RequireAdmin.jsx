import {useState, useEffect} from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Link } from "react-router-dom";
import { Outlet } from "react-router";
import axios from "../api/axios";
import ErrorMiddleware from "./ErrorMiddleware";
const PROTECT_ADMIN_URL = "/api/v1/jwt/protectAdmin";
const RequireAdmin = () => {
  const token = useSelector(selectCurrentToken);
  const [errMsg, setErrMsg] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  //console.log("token: ", token);
  useEffect(() => {
    const detAdmin = async  () => {
        try {
            const res = await axios.get(PROTECT_ADMIN_URL, 
                {headers: {withCredentials: true, Authorization: `Bearer ${token}`}});
            //console.log(res.data);
            setIsAdmin(res.data.user.role.isAdmin);
        }catch(err) {
            //console.log(err?.data);
            setErrMsg(err?.response?.data?.message);
        }
    }
    detAdmin();
  }, [token])
  return (
    <div>
        {isAdmin ? 
            <Outlet/> :
            <ErrorMiddleware key={errMsg} errMsg={errMsg} />
        }  
    </div>
  )
}

export default RequireAdmin
