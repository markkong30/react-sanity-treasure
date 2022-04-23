import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userQuery } from '../utils/query'
import { client } from '../client'
import Spinner from './Spinner'
import axios from 'axios'
import { getOrCreateChat, getOrCreateUser } from '../utils/fetchChatroom'
import './Chat.css'
import { ChatEngineWrapper, Socket, ChatHeader, ChatSocket, ChatFeed, } from 'react-chat-engine'

const Chat = ({ user }) => {
  const [chat, setChat] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Initializing chatroom...')
  const { counterpart } = useParams();

  useEffect(() => {
    if (user) {
      const query = userQuery(counterpart);

      client.fetch(query)
        .then(data => {
          setChatUser(data[0])
        })

    }
  }, [user, counterpart])

  useEffect(() => {
    if (chatUser) {

      getOrCreateUser(user, chatUser, (chat) => {
        console.log(chat)
        setChat(chat);
        setMessage('Loading messages...')
        setTimeout(() => {
          setLoading(false);
        }, 2000)

      });
    }
  }, [chatUser])

  return (

    <div id="chat" className='relative w-full min-h-[60vh] md:min-h-[70vh]' >
      {chat && !loading ?
        <>
          <ChatEngineWrapper>
            <ChatSocket
              offset={8}
              projectID={process.env.REACT_APP_CHAT_PROJECT_ID}
              // userName={user.username}
              // userSecret={user._id}
              chatID={chat.id}
              chatAccessKey={chat.access_key}
              senderUsername={user.username}
              title={chatUser.username}
            />
            {/* <ChatList /> */}
            {/* <ChatHeader activeChat={chat.id} title={chatUser.username} /> */}
            <ChatFeed className='flex flex-1 ' renderChatHeader={(chat) => {
              return (
                <div className="font-bold text-2xl pt-6 pb-2 text-red-500 flex justify-center items-center bg-white">{chatUser.username}</div>
              )
            }} />
          </ChatEngineWrapper>
        </>
        :
        <Spinner message={message} />
      }

    </div>


  );
};

export default Chat;