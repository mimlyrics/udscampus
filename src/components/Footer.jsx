import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className=" bg-zinc-400 mx-1 my-1 md:ml-[20%] ">
      <div className=' m-2 '>
        <div className=''>
          <Link to="/about">About</Link>
        </div>

        <div className=''>
          <Link to="/contact">Contact</Link>
        </div>

        <div className=''>
          <Link to="/privacy">Privacy</Link>
        </div>

        <div className=''>
          <Link to="/terms">Terms of Services</Link>
        </div>
      </div>
      <div className=" m-2 bg-slate-200">
        <h1 className=''>  @copy; copyright 2023. All Rights reserved </h1>
      </div>
    </footer>
  );
}

export default Footer
