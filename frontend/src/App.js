import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./containers/Home";
import "./App.css";

function App() {
	return (
		<Routes>
			<Route path="login" element={<Login />}></Route>
			<Route path="/" element={<Home />}></Route>
		</Routes>
	);
}

export default App;
