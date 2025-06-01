//  Register --- Check validation before submiting, Good-custom-design

import {useEffect, useState, useRef} from "react";
import {useSelector, useDispatch} from "react-redux"
import {Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation, useGetEmailCodeMutation, useVerifyEmailCodeMutation } from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye, FaCheck, FaCircle, FaSquare, FaX, FaInfo, FaExclamation } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { useMimlyrics } from "../context/AppProvider";
import Cookiepolicy from "../policy/Cookiepolicy";
import Privacy from "../policy/Privacy";
import Termsofuse from "../policy/Termsofuse";
import axios from "axios";
import { USERS_URL, REGISTER_URL } from "../routes/serverRoutes";

const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const CODE_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX =  /^[A-Za-z]\w{7,14}$/;  /*/^(?=.*[0-9]+.*)(?=.*[a-zA-z]+.*)[0-9a-zA-Z]{6,}$/;*/
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

/*const FIRSTNAME_ERR_MSG = 
const LASTNAME_ERR_MSG = Last name. must start with a letter. No(~!@#$%^&*(_+){}\"'.,:;/?)
const EMAIL_ERR_MSG = invalid email. example: example@gmail.com 
const PASSWORD_ERR_MSG = password. atleast(one lowercase, uppercase letter, digit)
const MOBILENO_ERR_MSG = mobile number. must be 9 digits */

const Register = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validUsername, setValidUsername] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [validMatch, setValidMatch] = useState("");
  const [errMessage, setErrMessage] = useState("");
  const [success, setSucess] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const usernameRef = useRef();
  const [usernameFocus, setUsernameFocus] = useState("");
  const [emailFocus, setEmailFocus] = useState("");
  const [codeFocus, setCodeFocus] = useState("");
  const [phoneFocus, setPhoneFocus] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [passwordFocus, setPasswordFocus] = useState("");
  const errRef = useRef();

  const {isActiveModalNavbar, setIsActiveModalNavbar} = useMimlyrics();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {userInfo} = useSelector((state) => state.auth);
  const [register, {isLoading}] = useRegisterMutation();

  const [showEmail, setShowEmail] = useState(false);
  const [steps, setSteps] = useState([1,2,3,4])

  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(username);
    //console.log(result);
    setValidUsername(result);
  }, [username]);

  useEffect(() => {
    const result = CODE_REGEX.test(code);
    setValidCode(result);
  }, [code])

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    //console.log(result);
    setValidEmail(result);
  }, [email]);


  useEffect(() => {
    const result = PASSWORD_REGEX.test(password);
    //console.log(result);
    setValidPassword(result);
  }, [password]);

  const handleShowPassword = (e) => {
    e.preventDefault();
    showPassword ? setShowPassword(false) : setShowPassword(true);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      console.log(code, username, phone, username, password);
      if(isChecked && validCode && validEmail && validUsername && validPassword) {
        const res = await register({code, username, phone, email, password}).unwrap();
        /*dispatch(setCredentials({ ...res }));*/
        //const res = await axios.post(REGISTER_URL, {code, username, phone, email, password }, {headers: {"Content-Type": "application/json", withCredentials: true}});
        if(res) {
          console.log(res.data);
        }
        setSucess(true);
        navigate("/");
      }
      else if(!isChecked) {
        console.log("terms of services must be checked");
        setErrMsg("Terms of services must be checked");
        setSucess(false);
      }
      else {
        setErrMsg("Make sure all fields are checked");
      }
    }catch(error) {
      console.log('herre');
      console.log(error);
      console.log(error?.response?.data?.message || error.error);
      setSucess(false);
      setErrMsg(error?.response?.data?.message);
    }
  }

  return (
    <section className={ isActiveModalNavbar ? " relative opacity-60 -z-50 mt-24 p-auto" : " -z-50 mt-24 p-auto"}>
    {errMsg ? 
      <div className=" animate transition ease-in-out duration-500 absolute -top-9 right-2 
      border-b-4 border-b-white-700 shadow font-semibold rounded text-center text-lg bg-amber-500 h-9 w-60 ">
        <p>Registration failed - {errMsg}</p>
      </div>
      : 
      null
    }
      {errMsg ? <div className=" animate-bounce font-bold text-lg text-red-500"><h1>{errMsg}</h1></div> : null}
      {success ? <div className=" animate-bounce font-bold text-lg text-green-500"><h1>{success}</h1></div> : null}
    <div className=" my-1 text-gray-950">
      <form
        className=" py-6 bg-gray-100 md:w-6/12 md:ml-64 md:py-9 mx-3 
          shadow-2xl shadow-amber-400 rounded flex-col text-lg"
        action="./register"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-medium mt-2 mb-3 italic text-2xl">
          Créer un compte
        </h2>

        <p className=" my-2 text-center">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="bg-amber-200 rounded">
            Connexion
          </Link>
        </p>

        <div className="form-group p-2">
          <label className="flex" htmlFor="email">Nom d'utilisateur
              <span className={validUsername ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validUsername || (!username) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="text"
            autoComplete="off"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-amber-800"
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
            required
          />
            <p className={usernameFocus && username && !validUsername ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid username. {" "}</p>
        </div>

        <div className="form-group p-2">
          <label className="flex" htmlFor="email">Code
              <span className={validCode ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validCode || (!code) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="text"
            autoComplete="off"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-amber-800"
            onFocus={() => setCodeFocus(true)}
            onBlur={() => setCodeFocus(false)}
            required
          />
            <p className={codeFocus && code && !validCode ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid code. {" "}</p>
        </div>


        <div className="form-group p-2">
          <label className="flex" htmlFor="email">Email
              <span className={validEmail ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validEmail || (!email) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
          </label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className=" p-3 border rounded w-full h-8 text-amber-800"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
          />
            
            <p className={emailFocus && email && !validEmail ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             invalid email. example: example@gmail.com{" "}</p>
        </div>

        <div className="ml-2">
          <h1>Numéro de téléphone</h1>
          <div className="">
            <PhoneInput
              className=" "
              defaultCountry={"ua"}
              value={phone}
              onChange={(phone) => setPhone(phone)}
              onFocus={() => setPhoneFocus(true)}
              onBlur={() => setPhoneFocus(false)}
            />
          </div>
        </div>

        <div className="form-group p-2">
          {showPassword ? (
            <div className="">
              <label className="flex" htmlFor="password">Mot de passe
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-amber-800"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={()=> setPasswordFocus(false)}
                  required
                />
                <div className="absolute top-1 right-5 ">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEye />
                  </button>
                </div>
              </div>
            

            <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>
            </div>
          ) : (
            <div className="">
              <label className="flex" htmlFor="password">Mot de passe
              <span className={validPassword ? "visible": "hidden"}><FaCheck className="w-11 h-7 text-purple-500"/></span>
              <span className={validPassword || (!password) ? "hidden": "visible"}><FaX className="w-7 h-5 text-red-400"/></span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded w-full h-8 text-amber-800"
                  onFocus={() => setPasswordFocus(true)}
                  onBlur={() => setPasswordFocus(false)}
                />
                <div className="absolute top-1 right-5">
                  <button type="button" onClick={handleShowPassword}>
                    <FaRegEyeSlash />
                  </button>
                </div>
              </div>
              

              <p className={passwordFocus && password && !validPassword ? " shadow-blue-950 shadow-lg flex mt-1 w-full text-sm text-amber-800 font-medium": "hidden"}> <FaInfo className=" mr-2 w-5 h-6 font-extrabold text-blue-800"/>
             Password must contain atleast a letter, number and should not be less than 8 characters</p>          
            </div>
          )}
        </div>

        <div className="ml-2 relative">
          <input
            type="checkbox"
            value={isChecked}
            className="h-5 w-11 mt-2 "
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <h1 className=" text-base md:text-lg lg:text-xl absolute top-1 ml-11 font-medium">
            You accept the <Link to="/termsofuse" className="cursor-pointer font-bold">Terms of service</Link> and{" "}
            <Link to="/privacy" className="cursor-pointer font-bold">Privacy</Link>
          </h1>
        </div>

        <button
          disabled={!validUsername || !validEmail || !validPassword ? true: false}
          className=" cursor-pointer my-2 mx-4 p-1 mb-2 transition ease-in-out delay-150 duration-300
           w-44 h-11 shadow-lg bg-amber-300 rounded-md hover:scale-103 hover:translate-y-[2px] hover:bg-amber-500"          >
          Sign Up
        </button>
      </form>
    </div>
    </section>
  );
}

export default Register