import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { userQuery } from '../utils/query'
import { client } from '../client'
import axios from 'axios'
import './Chat.css'
import { ChatEngineWrapper, Socket, ChatHeader, ChatSocket, ChatFeed, ChatList } from 'react-chat-engine'

const Chat = ({ user }) => {
  const [chat, setChat] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const { counterpart } = useParams();

  useEffect(() => {
    if (user !== null && user !== undefined) {

      const query = userQuery(counterpart);

      client.fetch(query)
        .then(data => {
          setChatUser(data[0])
        })

    }
  }, [user])


  useEffect(() => {
    if (chatUser) {
      getOrCreateUser();

    }
  }, [chatUser])

  function getOrCreateUser() {
    const { username, _id, email } = user;
    axios.put(
      'https://api.chatengine.io/users/',
      { username: username, email: email, secret: _id },
      { headers: { "Private-Key": process.env.REACT_APP_CHAT_PRIVATE_KEY } }
    )
      .then((res) => {
        // console.log(res)
        axios.put(
          'https://api.chatengine.io/users/',
          { username: chatUser.username, email: chatUser.email, secret: chatUser._id },
          { headers: { "Private-Key": process.env.REACT_APP_CHAT_PRIVATE_KEY } }
        )
          .then((res) => {
            // console.log(res)
            getOrCreateChat();
            // createDirectChat();
          })
          .catch(e => console.log('Get or create user error', e))

      })
      .catch(e => console.log('Get or create user error', e))


  }

  function getOrCreateChat() {
    const { username, _id } = user;

    axios.put(
      'https://api.chatengine.io/chats/',
      { usernames: [username, chatUser.username], is_direct_chat: true },
      {
        headers: {
          "Project-ID": process.env.REACT_APP_CHAT_PROJECT_ID,
          "User-Name": username,
          "User-Secret": _id,
        }
      }
    )
      .then(res => {
        setChat(res.data)
      })
      .catch(e => console.log('Get or create chat error', e))
  }


  return (

    <div id="chat" className='relative w-full min-h-[60vh] md:min-h-[85vh] ' >
      {chat &&
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
            <ChatFeed className='flex flex-1' renderChatHeader={(chat) => {
              return (
                <div className="font-bold text-2xl pt-6 pb-2 text-red-500 flex justify-center items-center bg-white">{chatUser.username}</div>
              )
            }} />
            {/* <ChatSettings className='w-full' /> */}
          </ChatEngineWrapper>
        </>
      }

    </div>


  );
};

export default Chat;