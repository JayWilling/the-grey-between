import React, { useState } from "react";
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

const PageWrapper = (props: {
	backgroundColor: string;
	page: () => JSX.Element;
}) => {
	return (
		<div style={{ backgroundColor: props.backgroundColor }}>
			<props.page />
		</div>
	);
};

function App() {
	const [backgroundColor, setBackgroundColor] = useState<string>("white");

	return (
		<div className="App">
			<Header></Header>
			<div className="app-contents">
				<Sidebar setBackgroundColor={setBackgroundColor} />
				<div
					style={{ backgroundColor: backgroundColor }}
					className="pageContainer"
				>
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
