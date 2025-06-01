import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../slices/auth/authSlice";
import { useRegisterMutation } from "../../slices/auth/usersApiSlice";
import { FaRegEyeSlash, FaRegEye, FaInfo } from "react-icons/fa6";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^[A-Za-z]\w{7,14}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const AdminAddUser = () => {
  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");
  const [validRole, setValidRole] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusField, setFocusField] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const [register] = useRegisterMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => setValidUsername(USERNAME_REGEX.test(username)), [username]);
  useEffect(() => setValidEmail(EMAIL_REGEX.test(email)), [email]);
  useEffect(() => setValidPassword(PASSWORD_REGEX.test(password)), [password]);
  useEffect(() => setValidRole(["ADMIN", "MANAGER", "USER"].includes(role.toUpperCase())), [role]);

  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validUsername && validEmail && validPassword && validRole) {
      try {
        const res = await register({
          username,
          phone,
          email,
          password,
          role: role.toUpperCase(),
          code,
        }).unwrap();
        setSuccess(true);
        navigate("/admin/user");
      } catch (error) {
        setSuccess(false);
        setErrMessage(error?.data?.message || "Erreur inattendue");
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white to-blue-400 font-sans">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mx-auto w-fit bg-blue-500 py-3 px-5 rounded-xl shadow-lg animate-fade-in">
          <h1 className="text-lg md:text-xl font-extrabold text-white font-heading">Admin: Ajouter un Utilisateur</h1>
        </div>

        {(success || errMessage) && (
          <div
            className={`absolute right-4 top-4 px-4 py-2 rounded shadow transition duration-300 animate-fade-in ${
              success ? "bg-green-400 text-white" : "bg-red-400 text-white"
            }`}
          >
            {success ? "Utilisateur ajouté avec succès!" : `Échec: ${errMessage}`}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md bg-white shadow-xl rounded-xl p-6 mt-8 space-y-4 animate-slide-in"
        >
          <div>
            <label className="block font-medium text-blue-900">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setFocusField({ ...focusField, username: true })}
              onBlur={() => setFocusField({ ...focusField, username: false })}
              className="w-full px-3 py-2 border border-blue-200 rounded text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {!validUsername && focusField.username && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FaInfo className="mr-1" /> Seuls les lettres et chiffres sont autorisés.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusField({ ...focusField, email: true })}
              onBlur={() => setFocusField({ ...focusField, email: false })}
              className="w-full px-3 py-2 border border-blue-200 rounded text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {!validEmail && focusField.email && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FaInfo className="mr-1" /> Format d'email invalide.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Numéro de téléphone</label>
            <PhoneInput
              defaultCountry="cm"
              value={phone}
              onChange={(phone) => setPhone(phone)}
              className="rounded border border-blue-200 w-full focus-within:ring-2 focus-within:ring-blue-500"
              onFocus={() => setFocusField({ ...focusField, phone: true })}
              onBlur={() => setFocusField({ ...focusField, phone: false })}
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3 py-2 border border-blue-200 rounded text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ex: EMP1234"
            />
          </div>

          <div>
            <label className="block font-medium text-blue-900">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusField({ ...focusField, password: true })}
                onBlur={() => setFocusField({ ...focusField, password: false })}
                className="w-full px-3 py-2 border border-blue-200 rounded text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button 
                type="button" 
                className="absolute right-2 top-2 text-blue-500 hover:text-blue-700"
                onClick={handleShowPassword}
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </div>
            {!validPassword && focusField.password && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FaInfo className="mr-1" /> Le mot de passe doit contenir 8–15 caractères et commencer par une lettre.
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-blue-900">Rôle</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onFocus={() => setFocusField({ ...focusField, role: true })}
              onBlur={() => setFocusField({ ...focusField, role: false })}
              className="w-full px-3 py-2 border border-blue-200 rounded text-blue-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Sélectionner un rôle</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="USER">Utilisateur</option>
            </select>
            {!validRole && focusField.role && (
              <p className="text-sm text-red-600 flex items-center mt-1">
                <FaInfo className="mr-1" /> Le rôle doit être ADMIN, MANAGER ou USER.
              </p>
            )}
          </div>

          <button
            disabled={!validUsername || !validEmail || !validPassword || !validRole}
            className={`mt-6 w-full py-3 rounded-lg shadow-md transition duration-300 font-heading font-bold ${
              !validUsername || !validEmail || !validPassword || !validRole
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Ajouter l'utilisateur
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminAddUser;