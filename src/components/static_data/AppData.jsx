import { useState, useEffect } from "react"
import axios from "../api/axios";
const APP_DATA_URL = "/api/v1/appData";
const AppData = () => {
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [about, setAbout] = useState(null);
  const [genres, setGenres] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try{
         const res = await axios.get(APP_DATA_URL, {withCredentials: true});
         setData(res.data.appData);
         console.log(res.data.appData);
         setAbout(res.data.appData.about);
         setGenres(res.data.appData.genre);
        }catch(err) {
            setErrMsg(err?.data?.message);
        }
    }
    getData();
  }, [])
  return (
    <section className="mx-1 md:ml-[23%]">
      <div className="text-center border rounded-md border-indigo-200">
        <h1>Get All Static Data</h1>
      </div>
      <div className="">
        {about ? about.map((a) => {
            return (
                <div key={a._id}>
                    {a}
                </div>
            )
        }) : null}
      </div>

      <div className="">
        {genres? genres.map(genre => {
            return (
                <div key={genre._id}>
                    {genre}
                </div>
            )
        }) : null}
      </div>
    </section>
  )
}

export default AppData
