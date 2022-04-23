import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { BsFillArrowUpRightCircleFill, BsHeart, BsFillHeartFill } from 'react-icons/bs';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { recommendPinQuery, pinDetailQuery } from '../utils/query';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [morePins, setMorePins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false)

  useEffect(() => {
    fetchPinDetails();
    console.log(user)
  }, [pinId])

  useEffect(() => {
    if (user !== null && pinDetail !== null) {
      setAlreadySaved(pinDetail.save?.find(ele => ele.postedBy._id == user._id) !== undefined)
    }
  }, [user, pinDetail])

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query)
        .then(data => {
          setPinDetail(data[0])

          if (data[0]) {
            query = recommendPinQuery(data[0]);

            client.fetch(query)
              .then(data => {
                setMorePins(data)

              })
          }
        })
    }
  }

  const savePin = e => {
    e.stopPropagation();

    if (!alreadySaved) {
      client.patch(pinId)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userID: user._id,
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          setAlreadySaved(true)
          fetchPinDetails();
        })
    } else {
      client.patch(pinId)
        .unset([`save[userID=="${user._id}"]`])
        .commit()
        .then(() => {
          setAlreadySaved(false)
          fetchPinDetails();

        })

    }
  }



  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client.patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{
          comment,
          _key: uuidv4(),
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        })
    }
  }


  if (!pinDetail) return <Spinner message={"Loading pin detail..."} />



  return (
    <>
      <div className='flex flex-col xl:flex-row m-auto bg-white max-w-[1500px] rounded-[32px]' >
        <div className="flex justify-center items-center md:items-start flex-initial lg:pt-5">
          <img src={pinDetail?.image && urlFor(pinDetail.image)}
            className='rounded-t-3xl rounded-b-lg'
            alt="image" />
        </div>
        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">

              <button className='' onClick={savePin}>
                {alreadySaved ?
                  <BsFillHeartFill fontSize={24} color="red" />
                  :
                  <BsHeart fontSize={24} />
                }
              </button>
              {pinDetail?.save?.length ?
                <h4>
                  <span className='font-bold'>{pinDetail?.save.length} </span>
                  <span>{pinDetail?.save.length == 1 ? ' like' : 'likes'}</span>
                </h4>
                :
                <h4>Be the first one to like...</h4>

              }
            </div>
            <div className='flex gap-3'>
              <a href={pinDetail.destination} target="_blank" rel="noreferrer"
                className='rounded-2xl bg-gray-100 px-4 py-2 '>
                Check the article
              </a>
              <a
                href={`${pinDetail.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75"
              >
                <MdDownloadForOffline />
              </a>
            </div>

          </div>
          <div className='description py-2'>
            <h1 className="text-4xl font-bold break-words mt-3">{pinDetail.title}</h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>
          <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="flex gap-2 mt-5 items-center bg-white rounded-lg ">
            <img src={pinDetail?.postedBy.image} className="w-10 h-10 rounded-full" alt="user-profile" />
            <p className="font-bold">{pinDetail?.postedBy.username}</p>
          </Link>
          <h2 className="mt-10 text-2xl">Comments</h2>
          <div className="min-h-[50px] max-h-570 overflow-y-auto">
            {pinDetail?.comments?.map((item) => (
              <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={uuidv4()}>
                <Link to={`/user-profile/${item.postedBy?._id}`}>
                  <img
                    src={item.postedBy?.image}
                    className="w-10 h-10 mr-2 rounded-full cursor-pointer"
                    alt="user-profile"
                  />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-sm">{item.postedBy?.username}</p>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between flex-wrap mt-6 gap-3 items-center">
            <div className='flex flex-1'>
              <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="bg-white rounded-lg mr-2">
                <img src={user.image} className="w-10 h-10 rounded-full object-cover" alt="user-profile" />
              </Link>
              <input
                className='basis-11/12 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
                type="text"
                value={comment}
                placeholder='Leave your comment...'
                onChange={e => setComment(e.target.value)} />
            </div>

            <button className=' bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
              onClick={addComment}>
              {addingComment ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div >
      {morePins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More like this
        </h2>
      )}
      {morePins ? (
        <MasonryLayout pins={morePins} />
      ) : (
        <Spinner message="Loading more pins" />
      )}
    </>
  );
};

export default PinDetail;