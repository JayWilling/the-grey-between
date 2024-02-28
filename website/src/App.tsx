import React from "react";
import { Route, Routes } from "react-router-dom";

// Styles
import "./App.css";

// Components
import { Header } from "./components/header/Header";
import { Sidebar } from "./components/sidebar/Sidebar";

//Pages
import { Home } from "./pages/Home";
import { StarMapCanvas } from "./pages/StarMap";
import { PointsOfInterest } from "./pages/PointsOfInterest";

function App() {
	return (
		<div className="App">
			<Header></Header>
			<div className="app-contents">
				<Sidebar />
				<div className="pageContainer">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/starmap" element={<StarMapCanvas />} />
						<Route
							path="/pointsofinterest"
							element={<PointsOfInterest />}
						/>
					</Routes>
				</div>
			</div>
		</div>
	);
}

export default App;
