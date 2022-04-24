import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { BsFillPersonPlusFill } from 'react-icons/bs';
import { ChatEngineWrapper, Socket, ChatList } from 'react-chat-engine';
import Select from 'react-select'
import { client } from '../client';


const ChatLists = ({ user, handleSidebar }) => {
  const [addChat, setAddChat] = useState(false);
  const [chatUserOptions, setChatUserOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    if (addChat) {
      fetchChatUsers();
    }

  }, [addChat])

  const fetchChatUsers = () => {
    const query = `*[_type == 'user' && username !='${user.username}' ]`;
    let options = [];
    client.fetch(query)
      .then(data => {
        for (const ele of data) {
          options = [...options, { value: ele._id, label: ele.username }];
        }
        setChatUserOptions(options)
      })
  }

  return (
    <div>
      <div className='chat-list fixed top-0 left-0 md:top- md:w-[300px] md:h-full z-[1000] md:ml-[195px] md:mt-[150px] overflow-y-scroll w-4/5 h-screen animate-slide-in'>
        <div className='flex justify-between items-center px-4 py-6 bg-white mr-[1px]'>
          {!addChat ?
            <>
              <div className='flex gap-4 items-center cursor-pointer' onClick={() => setAddChat(true)}>
                <h4 className='text-xl md:text-lg'>Messages</h4>
                <BsFillPersonPlusFill fontSize={24} />
              </div>
              <AiOutlineClose fontSize={24} className='cursor-pointer' onClick={() => handleSidebar('closeMessage')}
              />
            </>
            :
            <>
              <div className='w-full mr-4'>
                <Select
                  isClearable
                  isSearchable
                  noOptionsMessage={() => 'User not found'}
                  options={chatUserOptions && chatUserOptions}
                  onChange={(selected) => {
                    setSelectedOption(selected);
                  }}
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary25: '#FF8A80',
                      primary50: '#FF8A80',
                      primary: '#EF5350',
                    },
                  })}
                />
              </div>
              <BsFillPersonPlusFill className='cursor-pointer' fontSize={28} onClick={() => window.location.replace(`/chat/${selectedOption.value}`)} />

            </>

          }

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