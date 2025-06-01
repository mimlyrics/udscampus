import React, {useState, useEffect} from 'react'
import {useVerifyEmailCodeMutation} from "../../slices/auth/usersApiSlice"
const VerifyEmailCode = () => {
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [myCode, setMyCode] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const [verifyEmailCode, {isLoading}] = useVerifyEmailCodeMutation();

  const handleChangeMyCode = (e) => setMyCode(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await verifyEmailCode({myCode}).unwrap()
    }catch(err) {
        setErrMsg(err?.data?.message);
    }
  }

  return (
    <div>
        {errMsg ? <div>{errMsg}</div> : null}
        <form className='mx-2' onSubmit={handleSubmit}>
            <div className='py-2'>
                <label className="block">Enter Code</label>
                <input type="text" 
                    value={myCode} onChange={handleChangeMyCode} 
                    className='border block p-2'
                />
                <button className=' py-2 mt-2 w-[55%] border rounded-md hover:bg-indigo-200 hover:translateY-[1px]' type="submit" >Submit</button>
            </div>
        </form>
    </div>
  )
}

export default VerifyEmailCode
