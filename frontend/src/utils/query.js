export const userQuery = (userID) => {
	const query = `*[_type == 'user' && _id == '${userID}']`;

	return query;
};

export const searchQuery = (searchTerm) => {
	const query = `*[_type == 'pin' && title match '${searchTerm}* || category match '${searchTerm}*' || about match '${searchTerm}*']{
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
