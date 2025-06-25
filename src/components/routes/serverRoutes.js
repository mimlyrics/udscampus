

//const BASE_URL =  'https://campusuds-api.onrender.com';
//const SU = 'https://campusuds-api.onrender.com/api/v1';


const BASE_URL = "http://localhost:5000";
const SU = "http://localhost:5000/api/v1";

const SERVER_URL = {
    REGISTER_URL: `${SU}/register`,
    LOGIN_URL: `${SU}/login`,
    USERS_URL : `${SU}/users/users`,
    PLOT_URL : `${SU}/plots/plots`,
    SALE_URL : `${SU}/exporters/exporters`,
    COOPERATIVE_URL: `${SU}/cooperatives/cooperatives`,
    EXPORTER_URL : `${SU}/exporters/exporters`,
    PURCHASE_URL : `${SU}/purchases/purchases`,
}

export const  {USERS_URL, COOPERATIVE_URL, REGISTER_URL, SALE_URL, PLOT_URL, EXPORTER_URL, PURCHASE_URL} = SERVER_URL;
console.log(USERS_URL, BASE_URL);
export default BASE_URL;