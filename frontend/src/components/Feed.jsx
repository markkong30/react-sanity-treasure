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
        console.log(data)
        setPins(data);
        setLoading(false);
      })

  }, [categoryId])

  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />
  }

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  );
};

export default Feed;