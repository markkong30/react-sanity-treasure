import React, { useEffect, useState, useContext } from 'react';
import { AiOutlineLogout, AiFillMessage } from 'react-icons/ai';
import { BsMessenger } from 'react-icons/bs';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { v4 as uuidv4 } from 'uuid';

import { Link } from 'react-router-dom';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/query';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import { fetchUser } from '../utils/fetchUser';
import UserContext from '../context/UserContext';


const UserProfile = () => {
  const [user, setUser] = useState();
  const [pins, setPins] = useState();
  const [followed, setFollowed] = useState(false);
  const [toggleView, setToggleView] = useState('My posts')
  const navigate = useNavigate();
  const { userID } = useParams();
  const accountUser = fetchUser();

  const { fetchUserInfo } = useContext(UserContext);

  const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-32 outline-none';
  const notActiveBtnStyles = 'bg-gray-100 mr-4 text-black font-bold p-2 rounded-full w-32 outline-none';


  useEffect(() => {
    getUserInfo();

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

  const getUserInfo = () => {
    const query = userQuery(userID);

    client.fetch(query)
      .then(data => {
        console.log(data)
        setUser(data[0]);
        setFollowed(data[0].follower?.find(ele => accountUser.googleId == ele.userID) !== undefined);
        fetchUserInfo(accountUser.googleId);
      })
  }

  const fetchInitialFollow = () => {
    client.patch(user._id)
      .setIfMissing({ follower: [] })
      .insert('after', 'follower[-1]', [{
        _key: uuidv4(),
        userID: accountUser.googleId,
        followedBy: {
          _type: 'followedBy',
          _ref: accountUser.googleId,
        }
      }])
      .commit()
      .then(() => {
        // setFollowed(true)
      })

    client.patch(accountUser.googleId)
      .setIfMissing({ following: [] })
      .insert('after', 'following[-1]', [{
        _key: uuidv4(),
        userID: user._id,
        followTo: {
          _type: 'followTo',
          _ref: user._id,
        }
      }])
      .commit()
      .then(() => {
        // setFollowed(true)
        getUserInfo();
      })
  }

  const handleFollow = () => {
    if (!followed) {
      fetchInitialFollow();
    } else {
      client.patch(user._id)
        .unset([`follower[userID=="${accountUser.googleId}"]`])
        .commit()
        .then(() => {
          // setFollowed(false)
        })

      client.patch(accountUser.googleId)
        .unset([`following[userID=="${user._id}"]`])
        .commit()
        .then(() => {
          // setFollowed(false)
          getUserInfo();
        })
    }

  }

  const logout = () => {
    localStorage.clear();
    navigate('/login', { replace: true })

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
            <div className="information flex flex-col gap-3 justify-center items-center mt-4">
              <div className='relative flex gap-4'>
                <h1 className="font-bold text-2xl lg:text-3xl text-center ">{user.username}</h1>
                {accountUser?.googleId !== userID &&
                  <div className='items-center absolute bottom-[50%] translate-y-1/2 right-0 translate-x-[150%]'>
                    <button
                      className='bg-sky-400 px-3 py-1 text-sm text-white rounded-xl'
                      onClick={handleFollow}
                    >
                      {followed ? 'Followed' : 'Follow'}
                    </button>

                  </div>

                }
              </div>
              <div className='relative flex'>
                {user?.follower?.length > 1 ?
                  <h4 className='text-lg text-gray-600 underline'>
                    {user?.follower?.length} followers
                  </h4>
                  :
                  <h4 className='text-lg text-gray-600 underline'>
                    {user?.follower?.length || 0} follower
                  </h4>
                }
                {accountUser?.googleId !== userID &&
                  <Link to={`/chat/${user._id}`}>
                    <BsMessenger color='#0B86EE' className='absolute right-0 bottom-[50%] translate-y-1/2 translate-x-[250%] cursor-pointer opacity-80' fontSize={32} />
                  </Link>
                }
              </div>

            </div>
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
          <div className="flex justify-center items-center gap-20 mt-12 mb-7">
            <button
              type='button'
              onClick={() => setToggleView('My posts')}
              className={toggleView == 'My posts' ? activeBtnStyles : notActiveBtnStyles}>
              POSTS
            </button>
            <button
              type='button'
              onClick={() => setToggleView('Liked posts')}
              className={toggleView == 'Liked posts' ? activeBtnStyles : notActiveBtnStyles}>
              LIKED
            </button>
          </div>
          {pins?.length ?
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