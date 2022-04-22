import React, { useEffect } from "react";
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
		<Routes>
			<Route path="login" element={<Login />}></Route>
			<Route path="/*" element={<Home />}></Route>
		</Routes>
	);
}

export default App;
