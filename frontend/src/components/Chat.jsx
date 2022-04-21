import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Chat.css'
import { ChatEngineWrapper, Socket, ChatFeed, getOrCreateChat, ChatSettings } from 'react-chat-engine'

const Chat = ({ user }) => {
  const [chat, setChat] = useState(null);
  const { counterpart } = useParams();

  useEffect(() => {
    if (user) {
      console.log(user)
      getOrCreateUser();
    }
  }, [user])

  function getOrCreateUser() {
    const { username, _id } = user;

    axios.put(
      'https://api.chatengine.io/users/',
      { username: username, secret: _id },
      { headers: { "Private-Key": process.env.REACT_APP_CHAT_PRIVATE_KEY } }
    )
      .then((res) => {
        getOrCreateChat();
      })
      .catch(e => console.log('Get or create user error', e))
  }

  function getOrCreateChat() {
    const { username, _id } = user;

    axios.put(
      'https://api.chatengine.io/chats/',
      { usernames: [username, counterpart], is_direct_chat: true },
      {
        headers: {
          "Project-ID": process.env.REACT_APP_CHAT_PROJECT_ID,
          "User-Name": username,
          "User-Secret": _id,
        }
      }
    )
      .then(res => {
        setChat(res)
      })
      .catch(e => console.log('Get or create chat error', e))
  }



  return (

    <div id="chat" className='relative w-full min-h-[60vh] md:min-h-[85vh] ' >
      {user &&
        <>
          <ChatEngineWrapper>
            <Socket
              offset={8}
              projectID={process.env.REACT_APP_CHAT_PROJECT_ID}
              userName={user.username}
              userSecret={user._id}
            />
            <ChatFeed className='flex flex-1' activeChat={chat && chat.id} />
            {/* <ChatSettings className='w-full' /> */}
          </ChatEngineWrapper>
        </>
      }

    </div>


  );
};

export default Chat;