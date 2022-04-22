import axios from "axios";

export function getOrCreateUser(user, chatUser, callback) {
	const { username, _id, email } = user;
	console.log(username, _id, email);
	axios
		.put(
			"https://api.chatengine.io/users/",
			{ username: username, email: email, secret: _id },
			{ headers: { "Private-Key": process.env.REACT_APP_CHAT_PRIVATE_KEY } }
		)
		.then((res) => {
			// console.log(res)
			axios
				.put(
					"https://api.chatengine.io/users/",
					{ username: chatUser.username, email: chatUser.email, secret: chatUser._id },
					{ headers: { "Private-Key": process.env.REACT_APP_CHAT_PRIVATE_KEY } }
				)
				.then((res) => {
					// console.log(res)
					getOrCreateChat(user, chatUser, callback);
					// createDirectChat();
				})
				.catch((e) => console.log("Get or create user error", e));
		})
		.catch((e) => console.log("Get or create user error", e));
}

export function getOrCreateChat(user, chatUser, callback) {
	const { username, _id } = user;

	axios
		.put(
			"https://api.chatengine.io/chats/",
			{ usernames: [username, chatUser.username], is_direct_chat: true },
			{
				headers: {
					"Project-ID": process.env.REACT_APP_CHAT_PROJECT_ID,
					"User-Name": username,
					"User-Secret": _id,
				},
			}
		)
		.then((res) => {
			// console.log(res.data);
			callback(res.data);
			// setChat(res.data);
			// setLoading(false);
		})
		.catch((e) => console.log("Get or create chat error", e));
}
