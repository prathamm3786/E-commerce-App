import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'


const Navbar = () => {
    const [visible, setvisible] = useState(false)
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

    const logout = () => {
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
        navigate('/login')
    }
    const location = useLocation()
    return (
        <div className='flex items-center justify-between py-5 font-medium'>
            <Link to={"/"}> <img src={assets.logo} className='w-36' alt="" /></Link>
            <ul className='hidden sm:flex items-center gap-5 text-sm text-gray-700'>
                <NavLink to={"/"} className={`flex flex-col items-center gap-1 ${location.pathname === "/" ? "font-bold" : ""}`}>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"/collection"} className={`flex flex-col items-center gap-1 ${location.pathname === "/collection" ? "font-bold" : ""}`}>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"/about"} className={`flex flex-col items-center gap-1 ${location.pathname === "/about" ? "font-bold" : ""}`}>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to={"/contact"} className={`flex flex-col items-center gap-1 ${location.pathname === "/contact" ? "font-bold" : ""}`}>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <a target='_blank' href='https://forever-admin-chi-one.vercel.app' className={` border border-gray-700  px-4 flex flex-col items-center gap-1 rounded-full h-full   py-2`}>ADMIN PANEL</a>

            </ul>
            <div className="flex items-center gap-6">
                <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
                <div className="group relative">

                    <img onClick={() => token ? null : navigate('/login')} src={assets.profile_icon} className='w-5 cursor-pointer' alt="" />
                   
                   {
                    token &&  <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-200 text-gray-500 rounded">
                        <p className='cursor-pointer hover:text-black'>My Profile</p>
                        <p onClick={() => navigate('/orders')} className='cursor-pointer hover:text-black'>Orders</p>
                        <p onClick={logout} className='cursor-pointer hover:text-black'>Logout</p>
                    </div>
                </div>
                   }
                </div>
                <Link to="/cart" className="relative">

                    <img src={assets.cart_icon} className='w-5 min-w-5 cursor-pointer' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>

                </Link>
                <img onClick={() => setvisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
            </div>
            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? "w-full" : "w-0"}`}>
                <div className="flex flex-col text-gray-600 ">
                    <div onClick={() => setvisible(false)} className="flex items-center gap-4 p-3 cursor-pointer">
                        <img src={assets.dropdown_icon} className='h-4 rotate-180 ' alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setvisible(false)} to={"/"} className={"py-2 pl-6 border-b border-gray-400"} >
                        HOME
                    </NavLink>
                    <NavLink onClick={() => setvisible(false)} to={"/collection"} className={"py-2 pl-6 border-b border-gray-400"} >
                        COLLECTION
                    </NavLink>
                    <NavLink onClick={() => setvisible(false)} to={"/about"} className={"py-2 pl-6 border-b border-gray-400"} >
                        ABOUT
                    </NavLink>
                    <NavLink onClick={() => setvisible(false)} to={"/contact"} className={"py-2 pl-6 border- border-gray-400"}  >
                        CONTACT
                    </NavLink>
                   
                </div>

            </div>
        </div>
    )
}

export default Navbar
