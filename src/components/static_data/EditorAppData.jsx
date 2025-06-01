import {useState, useEffect} from "react";
import axios from "../api/axios";
import {BsPlus, BsX} from "react-icons/bs";
import {FaArtstation} from "react-icons/fa";
const APP_DATA_URL = "/api/v1/appData";
import { Link } from "react-router-dom";
const EditorAppData = () => {
  const [data, setData] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [about, setAbout] = useState([]);
  const [genres, setGenres] = useState([]);
  useEffect(() => {
    const getData = async () => {
      try{
         const res = await axios.get(APP_DATA_URL, {withCredentials: true});
         setData(res.data.appData);
         console.log(res.data.appData);
         setAbout(res.data.appData[0].about);
         setGenres(res.data.appData[0].genres);
         console.log(about, genres);
        }catch(err) {
            setErrMsg(err?.data?.message);
        }
    }
    getData();
  }, [])
  return (
    <section className=" md:ml-[20%] my-1 mx-1 ">
        <div className=" border rounded-md shadow shadow-blue-200 py-3 text-center text-purple-800 text-lg bg-purple-50 ">
            <h1>Editor AppData</h1>
        </div>
        <div className="flex space-x-3">
            <div className=" mt-4 ">
                <Link className="  border p-3 rounded-e-lg bg-blue-50 hover:bg-blue-300 " 
                to="/editor/post/appData">Add APP_DATA</Link>
            </div>
            <div className=" mt-4 ">
                <Link className="  border p-3 rounded-e-lg bg-green-50 hover:bg-green-300 " 
                to="/editor/edit/appData">Edit APP_DATA</Link>
            </div>
        </div>

    
      <div className=" text-lg mx-2 flex space-x-40 my-2 ">
        <div className=" ">
            {about ? about.map((a) => {
                return (
                    <div key={a._id}>
                        <div className=" flex ">
                            <h1 className=" px-2 py-1">{a}</h1>
                            <BsX className=" cursor-pointer w-7 h-7 my-1 text-blue-500 hover:text-blue-800 "/>                            
                        </div>
                    </div>
                )
            }) : null}
        </div>

        <div className="">
            {genres? genres.map(genre => {
                return (
                    <div key={genre._id}>
                        <div className="hover:bg-zinc-200">
                            <h1 className=" px-1 py-2 ">{genre}</h1>
                        </div>
                    </div>
                )
            }) : null}
        </div>    
      </div>
    </section>
  )
}

export default EditorAppData
