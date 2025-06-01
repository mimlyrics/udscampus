import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import FacebookLogo from "../assets/facebook.png";
import GoogleLogo from "../assets/google.png";
import GithubLogo from "../assets/github.png";
import {useDispatch, useSelector} from "react-redux";
import { useLoginMutation } from "../slices/auth/usersApiSlice";
import { setCredentials } from "../slices/auth/authSlice";
import { FaRegEyeSlash, FaRegEye, FaX, FaUser } from "react-icons/fa6";
import { useMimlyrics } from "./context/AppProvider";
import axios from "./api/axios";
import CLIENT_URL from "./routes/clientRoutes";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSucess] = useState(false);
  const [hi, setHi] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {isActiveModalNavbar, setIsActiveModalNavbar} = useMimlyrics();
  //console.log("ISL: ", isActiveModalNavbar);
  const [login, {isLoading} ] = useLoginMutation();
  const {token} = useSelector((state) => state.auth);
  //console.log("tokenxx: ", token);
  const[showPassword, setShowPassword] = useState("");
 
  const handleShowPassword = (e) => {
    e.preventDefault();
    showPassword ? setShowPassword(false) : setShowPassword(true);
    //console.log(setShowPassword);
  };
  
  useEffect(() => { 
    if(token) {
      navigate('/');
    }
  }, [navigate, token]);


  async function handleSubmit(e) {
    e.preventDefault();
    console.log(username);
    try {
      const res = await login({username, password}).unwrap();
      console.log(res);
      //console.log(res);
      dispatch(setCredentials({...res}));
      if(res) {
        window.location.href = CLIENT_URL;
      }
    }catch(error) {
      //console.log(error?.data?.message || error.error);
      setErrMessage(error?.data?.message);
      setSucess(false);
      setTimeout(()=>{
        setHi("");
      }, [2000]);
    }
    // prevent
  }

  const Google = () => {
    window.open(`/auth/google`, "_self");
  }

  const CloseLogin = () => {
    navigate(-1)
  }

  return (
    <section className={ isActiveModalNavbar ? " relative -z-50 mt-24" : " relative my-1 h-screen mt-24"}>
      <form
        className=" py-6 md:w-6/12 md:ml-64 bg-white mx-3 shadow-2xl shadow-indigo-300 rounded flex-col "
        onSubmit={handleSubmit}
      >
          <h2 className="text-center italic text-2xl">
            Connexion
          </h2>
          {/* <FaX onClick={() => CloseLogin()} className=" cursor-pointer w-6 h-6 text-cyan-500 hover:text-cyan-900 "/>   */}
      {errMessage ? <h1 className="font-medium text-center my-3 text-xl text-red-400 md:text-lg ">{errMessage}</h1> : null}
      {success ? <h1 className="font-medium text-center my-3 text-xl text-blue-800 md:text-lg ">{success}</h1> : null}
      {hi ? null : null}
        <p className="mb-3 mt-2 text-center">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="bg-amber-200 rounded">
            Créer un compte
          </Link>
        </p>

      <div className="form-group p-2">
        <label htmlFor="email">Nom d'utilisateur</label>
        <div className="relative">
          <FaUser className="absolute text-black top-1/2 left-2 -translate-y-1/2"/>
          <input
            type="text"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=" p-2 pl-8 border rounded w-full text-amber-600 border-black"
          />
        </div>
      </div>

      <div className="form-group p-2">
        {showPassword ? (
          <div className="">
            <label htmlFor="password">Mot de passe</label>
            <div className="relative">
              <input
                type="text"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" p-2 border rounded w-full text-amber-600 border-black"
                placeholder="Password"
              />

              <div className="absolute top-2 ml-[93%] md:ml-[93%] ">
                <button type="button" onClick={handleShowPassword}>
                  <FaRegEye className="w-5 h-5 md:w-6 md:h-6 " />
                </button>
              </div>
            </div>
          </div>
          ) : (
          <div className="">
            <label htmlFor="password">Mot de passe</label>
              <div className="relative">
              <input
                type="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" p-2 pl-8 border rounded w-full text-amber-600 border-black"
              />
              <div className="absolute top-2 ml-[93%] md:ml-[93%]">
                <button type="button" onClick={handleShowPassword}>
                  <FaRegEyeSlash className=" w-5 h-5 md:w-6 md:h-6 " />
                </button>
              </div>
            </div>
          </div>
        )}
        </div>

        <button
          type="submit"
          className="ml-3 p-2 mt-3 transition ease-in-out delay-150 duration-300 w-48 shadow-lg bg-amber-300  rounded hover:scale-103 hover:translate-y-1 hover:bg-amber-500"
        >
          Se connecter
        </button>
      </form>
    </section>
  );
};

export default Login;
