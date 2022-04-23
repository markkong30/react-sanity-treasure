import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import Select from 'react-select'
import { userQuery } from '../utils/query';
import { client } from '../client';
import { useNavigate } from 'react-router-dom';
import Pins from './Pins';
import { fetchUser } from '../utils/fetchUser';
import treasure from '../assets/treasure.svg'
import './Home.css'


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [showChats, setShowChats] = useState(false);

  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [chatUserOptions, setChatUserOptions] = useState([]);


  useEffect(() => {
    const userInfo = fetchUser();
    // fetchChatUsers();
    scrollRef.current.scrollTo(0, 0);

    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
  }, [])

  const fetchChatUsers = () => {
    const query = `*[_type == 'user' && username !='${user.username}' ]`

    client.fetch(query)
      .then(data => {
        console.log(data)
      })
  }

  const handleSidebar = (action) => {
    if (action == 'close') {
      setShowChats(false);
      setToggleSidebar(false);
      // document.body.style.overflowY = 'scroll';

      scrollRef.current.style.overflowY = 'auto';
    } else {
      setToggleSidebar(true);
      // document.body.style.overflowY = 'hidden';
      scrollRef.current.style.overflowY = 'hidden';
    }

  }

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>


      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} handleSidebar={handleSidebar} showChats={showChats} setShowChats={setShowChats} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="fixed z-[10] p-2 w-full flex flex-row justify-between items-center shadow-md bg-white">
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => handleSidebar('open')} />
          <Link to='/'>
            <img src={treasure} className='w-40' alt="" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} className='w-28' alt="" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-4 mt-2">
              <AiOutlineClose fontSize={28} className='cursor-pointer' onClick={() => handleSidebar('close')} />
            </div>
            <Sidebar user={user && user} handleSidebar={handleSidebar} showChats={showChats} setShowChats={setShowChats} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:userID" element={<UserProfile user={user && user} />}></Route>
          <Route path="/*" element={<Pins user={user && user} />}></Route>
        </Routes>
      </div>

    </div >
  );
};

export default Home;