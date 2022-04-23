import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill, BsFillHeartFill } from 'react-icons/bs';
import { client, urlFor } from '../client';
import { fetchUser } from '../utils/fetchUser';


const Pin = ({ pin, setPins }) => {
  const { postedBy, image, _id, destination, save } = pin;
  const [postHovered, setPostHovered] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false)
  const user = fetchUser();
  const getInitialSaved = () => save?.find(item => {
    if (item.postedBy !== null) {
      return setAlreadySaved(item.postedBy?._id == user?.googleId)
    }
    // return setAlreadySaved(false);
  })

  useEffect(() => {
    getInitialSaved();
  }, [])

  const navigate = useNavigate();


  const savePin = e => {
    e.stopPropagation();

    if (!alreadySaved) {
      client.patch(_id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userID: user?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user?.googleId
          }
        }])
        .commit()
        .then(() => {
          setAlreadySaved(true)
        })
    } else {
      client.patch(_id)
        .unset([`save[userID=="${user?.googleId}"]`])
        .commit()
        .then(() => {
          setAlreadySaved(false)
        })

    }
  }

  const deletePin = e => {
    e.stopPropagation();

    client.delete(_id)
      .then(() => {
        window.location.reload();
      })

  }



  return (
    <div className='m-2'>
      <div
        onMouseOver={() => setPostHovered(true)}
        onMouseOut={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out hover:scale-105'
      >
        <img src={urlFor(image)} className='rounded-lg w-full object-cover' alt="" />
        {postHovered && (
          <div className="absolute top-0 w-full h-full flex flex-col justify-between p-2 z-10">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a href={`${image.asset.url}?dl=`}
                  className='bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none'
                  download
                  onClick={e => e.stopPropagation()}>
                  <MdDownloadForOffline />
                </a>
              </div>
              <button className='hover:scale-105' onClick={savePin}>
                <BsFillHeartFill fontSize={20} color={alreadySaved ? 'red' : 'white'}
                  className={alreadySaved ? '' : 'opacity-75 hover:opacity-100'} />
              </button>
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a href={destination} target="_blank" rel='noreferrer'
                  className='bg-white flex items center gap-2 text-black font-bold py-2 px-4 rounded-full opacity-75 hover:opacity-100 hover:shadow-md hover:scale-105'>
                  <BsFillArrowUpRightCircleFill />
                </a>
              )}
              {postedBy?._id == user?.googleId && (
                <button className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none hover:scale-105"
                  onClick={deletePin}>
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-3 items-center">
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize text-gray-700">{postedBy?.username}</p>
      </Link>

    </div >
  );
};

export default Pin;