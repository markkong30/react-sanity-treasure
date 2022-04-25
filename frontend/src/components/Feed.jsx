import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client } from '../client';
import { categories } from '../utils/categories';
import { feedQuery, searchQuery } from '../utils/query';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);
    const query = categoryId ? searchQuery(categoryId) : feedQuery;
    client.fetch(query)
      .then(data => {
        // console.log(data)
        setPins(data);
        setTimeout(() => {
          setLoading(false);
        }, 1500)
      })

  }, [categoryId])



  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  }

  if (!pins?.length) return <h2>Sorry, no pins available...</h2>

  return (
    <div>
      {pins && <MasonryLayout pins={pins} setPins={setPins} />}
    </div>
  );
};

export default Feed;