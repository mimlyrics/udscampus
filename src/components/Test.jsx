import {useState} from "react";

const Test = () => {
  const [file, setFile] = useState();
  //console.log(file);
  //console.log("filename ", file.name);
  return (
    <div className=''>
      <h1>I Know</h1>
      <input type='file' onChange={(e=>setFile(e.target.files[0]))}/>
    </div>
  )
}

export default Test
