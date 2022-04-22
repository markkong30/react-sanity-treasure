export const userQuery = (userID) => {
	const query = `*[_type == 'user' && _id == '${userID}']`;

	return query;
};

export const chatUserQuery = (username) => {
	const query = `*[_type == 'user' && username == '${username}']`;

	return query;
};

export const searchQuery = (searchTerm) => {
	const query = `*[_type == 'pin' && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
		image {
			asset -> {
				url
			}
		},
		_id,
		destination,
		postedBy -> {
			_id,
			username,
			image
		},
		save[] {
			_key,
			postedBy -> {
				_id,
				username,
				image
			},
		},
	}`;

	return query;
};

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
	image{
		asset->{
			url
		}
	},
		_id,
		destination,
		postedBy->{
			_id,
			username,
			image
		},
		save[]{
			_key,
			postedBy->{
				_id,
				username,
				image
		},
	},
} `;

export const pinDetailQuery = (pinId) => {
	const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      username,
      image
    },
   save[]{
      postedBy->{
        _id,
        username,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        username,
        image
      },
    }
  }`;
	return query;
};

export const recommendPinQuery = (pin) => {
	const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        username,
        image
      },
    },
  }`;
	return query;
};

export const userCreatedPinsQuery = (userID) => {
	const query = `*[_type == "pin" && userID == '${userID}']  | order(_createdAt desc) {
    image {
      asset-> {
        url
      }
    },
    _id,
    title,
    about,
    destination,
    category,
    postedBy ->{
      _id,
      username,
      image,
    },
    save[] {
      postedBy -> {
        _id,
        username,
        image
      }
    }
  }`;

	return query;
};

export const userSavedPinsQuery = (userId) => {
	const query = `*[_type == 'pin' && '${userId}' in save[].userID ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      image
    },
    save[]{
      postedBy->{
        _id,
        username,
        image
      },
    },
  }`;
	return query;
};

export const followedQuery = (users) => {
	const query = `*[_type == 'pin' && userID in [${users}]] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      username,
      image
    },
    save[]{
      postedBy->{
        _id,
        username,
        image
      },
    },
  }`;

	return query;
};
