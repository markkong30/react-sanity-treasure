import React, { useEffect } from "react";
import { UserProvider } from "./context/UserContext";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./containers/Login";
import Home from "./containers/Home";
import "./App.css";

function App() {
	const navigate = useNavigate();

	useEffect(() => {
		const User = localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user")) : localStorage.clear();

		if (!User) navigate("/login");
	}, []);

	return (
		<UserProvider>
			<Routes>
				<Route path="/login" element={<Login />}></Route>
				<Route path="/*" element={<Home />}></Route>
			</Routes>
		</UserProvider>
	);
}

export default App;
