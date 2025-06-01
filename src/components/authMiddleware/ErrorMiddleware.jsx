
const ErrorMiddleware = ({errMsg}) => {
  return (
    <section className="md:ml-[20%] md:h-screen">
        {errMsg ? 
            <div className="text-center border shadow rounded-md text-xl
                md:text-3xl font-bold text-gray-800 bg-violet-100">
                <div className="relative w-[80vw] h-[80vh]">
                    <h1 className=" absolute top-[35vh] mx-4 md:mx-60">{errMsg}</h1>  
                    <h1 className=" text-red-500 top-[50vh] absolute mx-4 md:mx-96">401</h1>    
                </div>
            </div> : null
        }    
    </section>
  )
}

export default ErrorMiddleware
