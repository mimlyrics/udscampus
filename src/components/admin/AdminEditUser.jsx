import { useEffect, useState, useRef } from "react";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye, FaInfo } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import axios from "../api/axios";
import { USERS_URL } from "../routes/serverRoutes";
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const AdminEditUser = () => {
  const [id, setId] = useState("");
  const [user, setUser] = useState({});
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  const [focusField, setFocusField] = useState({});
  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const usernameRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    const query = hash.includes("?") ? hash.split("?")[1] : "";
    const { code } = queryString.parse(query);
    if (code) {
      setId(code);
    }
    console.log(id);
    }, [id] )

  useEffect(() => {
    if (id) {
      const getUserInfo = async () => {
        try {
          const res = await axios.get(`${USERS_URL}/${id}`, {
            headers: { withCredentials: true },
          });
          const data = res.data;
          setUser(data);
          setUsername(data.username || "");
          setEmail(data.email || "");
          setPhone(data.phone || "");
          setCode(data.code || "");
        } catch (err) {
          console.error("Failed to load user", err);
        }
      };
      getUserInfo();
    }
  }, [id]);

  useEffect(() => usernameRef.current?.focus(), []);
  useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
  useEffect(() => setValidPassword(PASSWORD_REGEX.test(password)), [password]);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validEmail) {
        const payload = {
          username,
          email,
          phone,
          code,
        }

        const res = await axios.put(`${USERS_URL}/${id}`, payload, {
          headers: { withCredentials: true },
        });


        if(res?.data) {
            setTimeout(() => {
              setSuccess(true);
              navigate("/admin/user");
            }, [1000])
        }
      }
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setErrMessage(error?.response?.data?.message || "Failed to edit user");
    }
  };

  return (
    <section className="relative mt-20 text-blue-900">
      <div className="text-center mx-[30%] text-white bg-blue-400 py-3 px-5 rounded-xl shadow-lg animate-fade-in">
        <h1 className="text-lg md:text-xl font-extrabold">Admin: Edit User</h1>
      </div>

      {(success || errMessage) && (
        <div
          className={`absolute right-4 top-4 px-4 py-2 rounded shadow transition duration-300 animate-fade-in ${
            success ? "bg-indigo-400 text-white" : "bg-red-400 text-white"
          }`}
        >
          {success ? "User updated successfully!" : `Failed: ${errMessage}`}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mx-3 md:mx-auto md:w-2/3 lg:w-1/2 bg-indigo-100 shadow-md rounded-xl p-6 mt-6 space-y-4 animate-slide-in"
      >
        {/* Username */}
        <div className="bg-white">
          <label className="block font-medium">Username</label>
          <input
            ref={usernameRef}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusField({ ...focusField, username: true })}
            onBlur={() => setFocusField({ ...focusField, username: false })}
            className="w-full px-3 py-2 border rounded text-yellow-800"
            required
          />

        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusField({ ...focusField, email: true })}
            onBlur={() => setFocusField({ ...focusField, email: false })}
            className="w-full px-3 py-2 border rounded text-yellow-800"
            required
          />
          {!validEmail && focusField.email && (
            <p className="text-sm text-red-600 flex items-center">
              <FaInfo className="mr-1" /> Invalid email format.
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium">Phone Number</label>
          <PhoneInput
            defaultCountry="us"
            value={phone}
            onChange={(phone) => setPhone(phone)}
            className="rounded border w-full text-yellow-800"
            onFocus={() => setFocusField({ ...focusField, phone: true })}
            onBlur={() => setFocusField({ ...focusField, phone: false })}
          />
        </div>

        {/* Code */}
        <div>
          <label className="block font-medium">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 border rounded text-yellow-800"
            placeholder="e.g., EMP1234"
          />
        </div>


        {/* Submit */}
        <button
          disabled={!validEmail}
          className="mt-4 w-full py-3 bg-blue-300 hover:bg-indigo-500 hover:cursor-pointer  text-white font-semibold rounded shadow-md transition duration-300"
        >
          Save Changes
        </button>
      </form>
    </section>
  );
};

export default AdminEditUser;

