import {useState, useEffect} from "react";
import { selectCurrentToken } from "../../slices/auth/authSlice";
import { useSelector } from "react-redux";
import { Navigate, useLocation, Link } from "react-router-dom";
import { Outlet } from "react-router";
import axios from "../api/axios";
const PROTECT_EDITOR_URL = "/api/v1/jwt/protectEditor";
import ErrorMiddleware from "./ErrorMiddleware";
const RequireEditor = () => {
  const token = useSelector(selectCurrentToken);
  const [errMsg, setErrMsg] = useState("");
  const [isEditor, setIsEditor] = useState(false);
  console.log(token);
  console.log(JSON.parse(localStorage.getItem('userInfo')))
  useEffect(() => {
    const detAdmin = async  () => {
        try {
            const res = await axios.get(PROTECT_EDITOR_URL, 
                {headers: {withCredentials: true, Authorization: `Bearer ${token}`}});
            console.log(res.data.user.role.isEditor);
            setIsEditor(res.data.user.role.isEditor);
        }catch(err) {
            //console.log(err);
            setErrMsg(err?.response?.data?.message);
        }
    }
    detAdmin();
  }, [])
  return (
    <div>
        {isEditor ? 
            <Outlet/> :
            <ErrorMiddleware key={errMsg} errMsg={errMsg} />
        }  
    </div>
  )
}

export default RequireEditor