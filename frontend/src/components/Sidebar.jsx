import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { categories } from '../utils/categories';

const Sidebar = ({ user, setSidebarToggle }) => {

  const closeSidebar = () => {
    if (setSidebarToggle !== 'undefined') {
      setSidebarToggle(false)
    }
  }

  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar'>
      <div className="flex flex-col">
        <Link to="/" className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={closeSidebar}>
          <img src={logo} className='w-full' alt="" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink to="/"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={closeSidebar}>
            <RiHomeFill />
            <span> Home</span>
          </NavLink>
          <h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
          {categories.slice(0, categories.length - 1).map(category => (
            <NavLink to={`/category/${category.name}`}
              key={category.name}
              className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
              onClick={closeSidebar}>
              <img src={category.image} className='w-8 h-8 rounded-full shadow-sm' alt="" />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link to={`user-profile/${user._id}`}
          className='flex mt-5 mb-3 gap-3 p-2 items-center bg-white rounded-lg shadow-lg mx-3'
          onClick={closeSidebar}>
          <img src={user.image} className='w-10 h-10 rounded-full' alt="user-profile" />
          <p className='text-sm xl:text-base'>{user.username}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;