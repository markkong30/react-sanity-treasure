import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { client } from '../client';
import { categories } from '../utils/categories';
import { followedQuery } from '../utils/query';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const FollowedFeed = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);


  useEffect(() => {
    if (user) {
      setLoading(true);

      let followingUsers = [];
      if (user.following) {
        for (const ele of user.following) {
          followingUsers = [...followingUsers, ...[`'${ele.userID}'`]]
        }
      }

      const query = followedQuery(followingUsers);
      client.fetch(query)
        .then(data => {
          console.log(data)
          setPins(data);
          setLoading(false);
        })
    }

  }, [user])



  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  }

  if (!pins?.length) return <h2 className='ml-2' >No pins posted for your followed users...</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} setPins={setPins} />}
    </div>
  );
};

export default FollowedFeed;