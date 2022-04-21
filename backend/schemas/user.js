export default {
	name: "user",
	title: "User",
	type: "document",
	fields: [
		{
			name: "username",
			title: "Username",
			type: "string",
		},
		{
			name: "image",
			title: "Image",
			type: "string",
		},
		{
			name: "follower",
			title: "Follower",
			type: "array",
			of: [{ type: "follower" }],
		},
		{
			name: "following",
			title: "Following",
			type: "array",
			of: [{ type: "following" }],
		},
	],
};
