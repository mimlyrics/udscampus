import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";
import { BsPlus, BsX } from "react-icons/bs";
const APP_DATA_URL = "/api/v1/appData";
const PostAppData = () => {
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [Hi, setHi] = useState("");
  const [showCategory, setShowCategory] = useState(true);
  const [categoryField, setCategoryField] = useState([{category: '', show: true}]);
  const [aboutField, setAboutField] = useState([{about: '', showAbout: true}]);
  const [aboutArr, setAboutArr] = useState([]);
  const [categories, setCategories] = useState([]);
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    console.log("POSSSt");
    try {
        if(categoryField && aboutField) {
            let arr1 = [];
            let arr2 = [];
            for(let i=0;i<categoryField.length;i++) {
              arr1.push(categoryField[i].category);
            }
            for(let j=0;j<aboutField.length;j++) {
              arr2.push(aboutField[j].about);
            }
            setCategories([...arr1]);
            setAboutArr([...arr2]);
            console.log(categories);
            console.log(aboutArr);
            //setCategories(arr1);
            //setAboutArr(arr2);
            if(categories && aboutArr) {
              const res = await axios.post(APP_DATA_URL, 
                {about: aboutArr, genres: categories}, 
                {headers: {"Content-Type": "application/json"}, 
                withCredentials: true});
                console.log(res.data);
            }
            
        }else {
            console.log("All fields are required");
        }
    }catch(err) {
        setErrMsg(err?.data?.message);
        console.log(err?.data?.message);
    }
  }

  const AddMoreAbout = (e, index) => {
    let newFieldx = {about: '', showAbout: true};
    let data = [...aboutField];
    setAboutField([...aboutField, newFieldx]);
    for(let index=data.length-1; index>=0; index--) {
        data[index]['showAbout'] = false;
        console.log('yep');
    }
    data[index]['showAbout'] = true
    setAboutField(data);
  }

  const AddMoreCategory = (e, i) => {
    let newField = {category: '', show: true};
    let data = [...categoryField];
    setCategoryField([...categoryField, newField]);
    for(let i=data.length-1; i>=0; i--) {
        data[i]['show'] = false;
        console.log('yep');
    }
    data[i]['show'] = true
    setCategoryField(data);
  }
  

  const onChangeCategory = (e,i) => {
    console.log(e.target.value);
    let data = [...categoryField];
    data[i][e.target.name] = e.target.value;
    console.log(data);
    setCategoryField(data);
  }

  const onChangeAbout = (e, index) => {
    console.log(e.target.value);
    let dataAbout = [...aboutField];
    dataAbout[index][e.target.name] = e.target.value;
    console.log(dataAbout);
    setAboutField(dataAbout);
  }


  return (
    <section className=" md:mt-16  visible w-[99vw] md:w-[55vw] bg-purple-100 md:absolute md:top-0 md:left-40 lg:left-60 xl:left-64 mx-2 px-1">
      <div className="mb-8 mt-1 bg-gradient-to-l from-fuchsia-400 ">
        <h1 className="text-2xl text-center ">Post_static_appdata</h1>
      </div>
      {/** Get videos to post */}
      <form className=" mx-2 ">
            {Hi ? null : null}      
            {errMsg ? <div className="font-bold text-lg text-red-500"><h1>{errMsg}</h1></div> : null}
            {successMsg ? <div className="font-bold text-lg text-green-500"><h1>{successMsg}</h1></div> : null}
        <div className=" flex mx-2">
          <div className="  ">
              {aboutField.map((a,index) => {
              return (
              <div key={index} className=" flex  space-x-1 text-lg">  
                  <h1 className="m-2 mt-3">{index+1}</h1>          
                  <input  
                      name="about" 
                      placeholder="about" 
                      className=" h-11 border w-full rounded-md 
                          py-2 md:py-3 shadow p-2 outline-1"
                      type="text"
                      autoComplete="off" 
                      value={a.about} 
                      onChange={e=>onChangeAbout(e, index)}
                      onKeyDown={(e)=>e.key === 'Enter' ? null: null}
                  />
                  { a.showAbout ? 
                  <button onClick={() => AddMoreAbout(index)} 
                      className="border my-1 rounded-md px-3 py-1 bg-blue-200 hover:bg-indigo-300">
                      <BsPlus className="md:w-9 md:h-9"/>
                  </button> : null} 
              </div>)})}
          </div>
          <div className="  ">
              {categoryField.map((cat,i) => {
              return (
              <div key={i} className=" flex  space-x-1 text-lg">  
                  <h1 className="m-2 mt-3">{i+1}</h1>          
                  <input 
                      name="category"
                      placeholder="category" 
                      autoComplete="off"
                      className=" h-11 border w-full rounded-md py-2 md:py-3 shadow p-2 outline-1"
                      type="text" 
                      value={cat.category} 
                      onKeyDown={(e)=>e.key==='Enter' ? null : null}
                      onChange={e=>onChangeCategory(e, i)}/>
                      { cat.show ? <button onClick={() => AddMoreCategory(i)} 
                          className="border my-1 rounded-md px-3 py-1 bg-indigo-50 hover:bg-indigo-300">
                          <BsPlus className="md:w-9 md:h-9"/>
                      </button> : null} 
              </div>)})}
          </div>
        </div>

        <div onClick={(e) => handlePostSubmit(e)} className=" mx-[30%] w-48 py-4 md:my-1">
          <button className=" w-40 p-1 text-lg animation delay-150 duration-500 border rounded-md shadow-sm bg-indigo-300 hover:bg-indigo-400 hover:translate-y-[1px]" type="submit">Submit</button>
        </div>
      </form>
    </section>
  )
}

export default PostAppData
