import React, { useState, useEffect, useRef } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import { userQuery } from '../utils/query';
import { client } from '../client';
import { useNavigate } from 'react-router-dom';
import Pins from './Pins';
import { fetchUser } from '../utils/fetchUser';
import logo from '../assets/logo.png';
import treasure from '../assets/treasure.svg'
import axios from 'axios'
import { chatUserQuery } from '../utils/query';
import { ChatEngineWrapper, Socket, ChatList } from 'react-chat-engine';
import { getOrCreateChat, getOrCreateUser } from '../utils/fetchChatroom'
import './Home.css'


const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [showChats, setShowChats] = useState(false)
  const scrollRef = useRef(null);
  const navigate = useNavigate();


  useEffect(() => {
    const userInfo = fetchUser();
    scrollRef.current.scrollTo(0, 0);

    const query = userQuery(userInfo?.googleId);

    client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
  }, [])

  useEffect(() => {
    if (showChats) {
      console.log('here')
      document.addEventListener('click', checkClickChat)
    }

    return () => {
      document.removeEventListener('click', checkClickChat)
    }

  }, [showChats])

  const checkClickChat = (e) => {
    const activeChat = document.querySelector('.ce-active-chat-card');

    if (activeChat.contains(e.target)) {
      document.removeEventListener('click', checkClickChat)
      // console.log(activeChat.firstChild.firstChild.innerText)
      const chatUsername = activeChat.firstChild.firstChild.innerText;

      const query = chatUserQuery(chatUsername);

      client.fetch(query)
        .then(data => {
          window.location.replace(`/chat/${data[0]._id}`);
          setShowChats(false);
        })

    }
  }

  return (
    <div className='flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out'>
      {showChats && user &&
        <div className='chat-list fixed w-[30vw] h-full z-10 ml-[190px] mt-[150px] overflow-y-scroll '>
          <h1 className='p-4 bg-white'>Chats</h1>

          <ChatEngineWrapper>
            <Socket
              offset={8}
              projectID={process.env.REACT_APP_CHAT_PROJECT_ID}
              userName={user?.username}
              userSecret={user?._id}

            />

            <ChatList />
          </ChatEngineWrapper>

        </div>
      }

      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} setToggleSidebar={setToggleSidebar} showChats={showChats} setShowChats={setShowChats} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />
          <Link to='/'>
            <img src={treasure} className='w-40' alt="" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img src={user?.image} className='w-28' alt="" />
          </Link>
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} setToggleSidebar={setToggleSidebar} showChats={showChats} setShowChats={setShowChats} />
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