import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/query';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [toggleView, setToggleView] = useState('My posts')
  const navigate = useNavigate();
  const { userID } = useParams();

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-32 outline-none';
  const notActiveBtnStyles = 'bg-gray-100 mr-4 text-black font-bold p-2 rounded-full w-32 outline-none';


  useEffect(() => {
    const query = userQuery(userID);

    client.fetch(query)
      .then(data => {
        setUser(data[0]);
      })

  }, [])

  useEffect(() => {
    const createdPinQuery = userCreatedPinsQuery(userID);
    const savedPinQuery = userSavedPinsQuery(userID);

    if (toggleView == 'My posts') {
      client.fetch(createdPinQuery)
        .then(data => {
          setPins(data);
        })
    } else {
      client.fetch(savedPinQuery)
        .then(data => {
          setPins(data);
        })
    }

  }, [toggleView])



  const logout = () => {
    localStorage.clear();
    navigate('/login');
  }


  if (!user) return <Spinner message="Loading user profile..." />

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img src="https://source.unsplash.com/1600x900/?nature,photography,technology"
              className='w-full h-370 2xl:h-510 shadow-lg object-cover'
              alt="profile" />
            <img
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
              src={user.image}
              alt="user-pic"
            />
            <h1 className="font-bold text-2xl lg:text-3xl text-center mt-4">{user.username}</h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userID == user._id && (
                <GoogleLogout
                  clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className='bg-white p-2 rounded-full cursor-pointer outline-none'
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <AiOutlineLogout color='grey' fontSize={21} />
                    </button>
                  )}
                  onLogoutSuccess={logout}
                  cookiePolicy='single_host_origin'
                />
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-20 my-7">
            <button
              type='button'
              onClick={() => setToggleView('My posts')}
              className={toggleView == 'My posts' ? activeBtnStyles : notActiveBtnStyles}>
              My posts
            </button>
            <button
              type='button'
              onClick={() => setToggleView('Liked posts')}
              className={toggleView == 'Liked posts' ? activeBtnStyles : notActiveBtnStyles}>
              Liked posts
            </button>
          </div>
          {pins.length ?
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
            :
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">No Pins found!</div>
          }

        </div>
      </div>

    </div>
  );
};

export default UserProfile;