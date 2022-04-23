import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { ChatEngineWrapper, Socket, ChatList } from 'react-chat-engine';


const ChatLists = ({ user, handleSidebar }) => {
  const [addChat, setAddChat] = useState(false);


  return (
    <div>
      <div className='chat-list fixed top-0 left-0 md:top- md:w-[300px] md:h-full z-[1000] md:ml-[195px] md:mt-[150px] overflow-y-scroll w-screen h-screen animate-slide-in'>
        <div className='flex justify-between items-center px-4 py-6 bg-white mr-[1px]'>
          {!addChat ?
            <div className='flex gap-4 items-center cursor-pointer' onClick={() => setAddChat(true)}>
              <h4 className='text-xl md:text-lg'>Chats</h4>
              <BsFillPersonPlusFill fontSize={24} />
            </div>
            :
            <div className=''>
              {/* <Select
                  defaultValue={colourOptions[0]}
                  isDisabled={isDisabled}
                  isLoading={isLoading}
                  isClearable={isClearable}
                  isRtl={isRtl}
                  isSearchable={isSearchable}
                  name="color"
                  options={colourOptions}
                /> */}
            </div>
          }
          <AiOutlineClose fontSize={24} className='cursor-pointer' onClick={() => handleSidebar('close')}
          />
        </div>

        <ChatEngineWrapper>
          <Socket
            offset={8}
            projectID={process.env.REACT_APP_CHAT_PROJECT_ID}
            userName={user?.username}
            userSecret={user?._id}
          // onGetMessages={() => console.log('get')}
          />

          <ChatList />
        </ChatEngineWrapper>


      </div>
    </div>
  );
};

export default ChatLists;