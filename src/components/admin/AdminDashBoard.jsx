import React from 'react';
import { Link } from 'react-router-dom';
const AdminDashBoard = () => {
  return (
    <section className='mx-1 md:py-4 md:mx-48 lg:mx-64 md:text-xl mt-28'>
      <div className='border bg-indigo-300 text-white text-center py-2  '>
        <h1>Module d'administration</h1>
      </div>
      <div className='ml-24 font-bold text-blue-700 text-lg py-2'>
        <h1>____Management___*</h1>
      </div>
      <ul className='flex flex-col  border text-center text-[brown] text-lg'>
        <Link className='border-b-2 py-3 md:py-5 hover:bg-indigo-100' to="/admin/user">Utilisateurs</Link>
      </ul>
    </section>
  )
}

export default AdminDashBoard
