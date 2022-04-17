import React from 'react';
import { urlFor } from '../client';

const Pin = ({ pin }) => {
  const { postedBy, image, _id, destination } = pin;

  return (
    <div>
      <img src={urlFor(image)} className='rounded-lg w-full object-cover' alt="" />
    </div>
  );
};

export default Pin;