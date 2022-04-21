export default {
	name: "follower",
	title: "Follower",
	type: "document",
	fields: [
		{
			name: "followedBy",
			title: "FollowedBy",
			type: "followedBy",
		},
		{
			name: "userID",
			title: "UserID",
			type: "string",
		},
	],
};
