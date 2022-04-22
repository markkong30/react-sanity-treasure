import React, { useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { BsFillHeartFill, BsMessenger } from 'react-icons/bs';
import { IoIosArrowForward } from 'react-icons/io';
import { AiOutlineLogout } from 'react-icons/ai';
import logo from '../assets/logo.png';
import treasure from '../assets/treasure.svg'
import { categories } from '../utils/categories';
import { GoogleLogout } from 'react-google-login';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ user, setSidebarToggle, setShowChats, showChats }) => {
  const navigate = useNavigate();

  const closeSidebar = () => {
    if (setSidebarToggle !== 'undefined') {
      setSidebarToggle(false)
    }
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }


  const isNotActiveStyle = 'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
  const isActiveStyle = 'flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

  return (
    <div className='flex flex-col justify-between bg-white h-full overflow-y-scroll w-210 hide-scrollbar shadow-lg '>
      <div className="flex flex-col">
        <Link to="/" className='flex px-5 gap-2 my-6 pt-1 w-190 items-center'
          onClick={closeSidebar}>
          <img src={treasure} className='w-[90%]' alt="" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink to="/"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={closeSidebar}>
            <RiHomeFill />
            <span> Home</span>
          </NavLink>
          <NavLink to="/followed"
            className={({ isActive }) => isActive ? isActiveStyle : isNotActiveStyle}
            onClick={closeSidebar}>
            <BsFillHeartFill className='opacity-75' color="red" />
            <span> Followed</span>
          </NavLink>
          <button
            className={showChats ? isActiveStyle : isNotActiveStyle}
            onClick={() => setShowChats(!showChats)}>
            <BsMessenger color='#0B86EE' className='' />
            <span>Messages</span>
          </button>

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
        <div className='relative'>
          <Link to={`user-profile/${user._id}`}
            className='flex mt-7 mb-3 gap-3 p-2 items-center bg-white rounded-lg mx-3'
            onClick={closeSidebar}>
            <img src={user.image} className='w-10 h-10 rounded-full' alt="user-profile" />
            <p className='text-sm xl:text-base'>{user.username}</p>
          </Link>
          <GoogleLogout
            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
            render={(renderProps) => (
              <div className='w-full mt-4 py-2 lborder-t border-gray-200'>
                <button
                  type="button"
                  className='flex items-center bg-white ml-5 p-2 rounded-lg cursor-pointer outline-none'
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <AiOutlineLogout color='grey' fontSize={21} />
                  <span className='ml-3 text-gray-500'>Sign out</span>
                </button>
              </div>
            )}
            onLogoutSuccess={logout}
            cookiePolicy='single_host_origin'
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;