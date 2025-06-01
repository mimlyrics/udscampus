import {useEffect, useState} from "react";
import {useSelector, useDispatch} from "react-redux"
import {Link,useNavigate } from "react-router-dom";
import { setCredentials } from "../slices/auth/authSlice";
import { FaRegEyeSlash, FaRegEye, FaUpload } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
const FIRSTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const LASTNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX =  /^[A-Za-z]\w{7,14}$/;
const EMAIL_RGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
/*const FIRSTNAME_ERR_MSG = 
const LASTNAME_ERR_MSG = Last name. must start with a letter. No(~!@#$%^&*(_+){}\"'.,:;/?)
const EMAIL_ERR_MSG = invalid email. example: example@gmail.com 
const PASSWORD_ERR_MSG = password. atleast(one lowercase, uppercase letter, digit)
const MOBILENO_ERR_MSG = mobile number. must be 9 digits */
import { useUpdateUserMutation } from "../slices/auth/usersApiSlice";
import axios from "./api/axios";
import { useMimlyrics } from "./context/AppProvider";
const USERS_URL = "/api/v1/users/users";
const Profile = () => {
  console.log("Pic");
  var [usernamex, setUsernamex] = useState("");
  var [codex, setCodex] = useState("");
  var {username, code} = useSelector((state) => state.auth.userInfo);
  useEffect(() => {
    setUsernamex(username);
    setCodex(code);
  }, [usernamex, codex])

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [file, setFile] = useState();
  const [image, setImage] = useState("");
  const [updateProfile, {isLoading}] = useUpdateUserMutation();
  // validating useState
  const [validUsername, setValidUsername] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSucess] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [isRun, setIsRun] = useState(false);
  //const usernameRef = useRef(false);
  const [usernameFocus, SetUsernameFocus] = useState(false);
  useEffect(() => {
    const result = FIRSTNAME_REGEX.test(usernamex);
    //console.log(result);
    setValidUsername(result);
  }, [usernamex]);

  useEffect(() => {
    const result = LASTNAME_REGEX.test(codex);
    //console.log(result);
    setValidCode(result);
  }, [codex]);

  const {isActiveModalNavbar} = useMimlyrics();

  //console.log(firstNamex, lastNamex);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({code: code, username: username}).unwrap();
      dispatch(setCredentials({...res}));
      navigate("/");
    }catch(err) {
      setErrMsg(err?.data?.message);
      setTimeout(() => {
        setErrMsg(false);
      }, [4000])
    }
  }

  //console.log("ISXXX: ", isActiveModalNavbar)
  return (
    <section className= { isActiveModalNavbar ? " relative -z-50 opacity-0 " : " -z-50 h-11 my-3 " }>
      <form
        className=" md:w-6/12 md:ml-64 bg-white ml-4 flex-col text-lg"
      >
        <h2 className="mx-5 my-2 italic text-2xl">
            Update Account
        </h2>

        {errMsg ? <p className="animate animate-bounce text-red-500 md:text-lg">{errMsg}</p> : null}
        {success ? <p className="text-green-300 md:text-lg">{success}</p> : null}

        <div className="">
          <div className="form-group p-2 ">
            <label className="flex" htmlFor="firstName">
              Code
            </label>
            <input
              type="text"
              autoComplete="off"
              value={codex}
              required
              onChange={(e) => setCodex(e.target.value)}
              className=" px-2 border w-[70%] rounded md:w-[50%] lg:w-[55%] mr-5 h-8 text-blue-900 font-mono "
            />
          </div>

          <div className=" p-2 ">
            <label className="flex" htmlFor="lastName">Last Name
            </label>
            <input
              type="text"
              autoComplete="off"
              value={usernamex}
              onChange={(e) => setUsernamex(e.target.value)}
              className="border p-2 w-[70%] rounded mr-5  md:w-[50%] lg:w-[55%]  h-8 text-blue-900 font-mono"
            />
          </div>

        </div>

        <div className="p-2">
          <button
            onClick={handleProfileUpdate}
            type="submit"
            className=" mt-2 p-1 mb-2 transition ease-in-out delay-150 duration-300 w-40 
              shadow-lg bg-blue-300 rounded hover:rounded-md hover:scale-102 hover:translate-y-[2px]
             hover:bg-indigo-500"
            >
            Update Profile
          </button>
        </div>
      </form>
    </section>
  );
}

export default Profile
