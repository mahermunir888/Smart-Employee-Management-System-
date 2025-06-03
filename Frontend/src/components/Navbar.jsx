import React from 'react'
import { useAuth } from '../context/authcontext'

const Navbar = () => {
    const { user, logout } = useAuth()
    return (
        <div className="pt-20">
        <div className="fixed top-0 w-full z-50 bg-teal-600 text-white h-16 px-4 flex items-center  shadow-md">
            <p className="ml-16">Welcome {user.name}</p>
            <button className="bg-white text-teal-600 px-3 py-1 rounded hover:bg-gray-100 ml-180"
            onClick={logout}>Logout</button>
        </div>
      </div>
      
    )
}

export default Navbar

