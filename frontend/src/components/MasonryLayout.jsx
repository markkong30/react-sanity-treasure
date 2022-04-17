import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

const breakpoints = {
  default: 4,
  3000: 6,
  2000: 5,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({ pins, setPins, currentQuery }) => {
  return (
    <Masonry className="flex animate-slide-fwd" breakpointCols={breakpoints}>
      {pins?.map(pin => (
        <Pin key={pin._id} pin={pin} setPins={setPins} currentQuery={currentQuery} className="w-max" />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;