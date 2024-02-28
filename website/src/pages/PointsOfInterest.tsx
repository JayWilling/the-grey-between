import { useEffect, useState } from "react";
import "./../assets/styling/PointsOfInterest.css";
import { getStars } from "../api/starsApi";

// Load and display star data first
// Load and display planets afterwards

// Potentially include a small threejs canvas of the rotating object

export const PointsOfInterest = () => {
	// Define the data
	const [starData, setStarData] = useState();

	// Load in the POI's
	useEffect(() => {
		async function loadStars() {
			const response = await fetch("http://localhost:5000/star/");
			if (!response.ok) {
				const message = `An error occured: ${response.statusText}`;
				alert(message);
				return;
			}
			// const tempStarList:
		}
	}, []);

	return (
		<div className="page pointsofinterest">
			<div className="table-container">
				<table>
					<tbody>
						<tr>
							<th>Blah</th>
							<th>Blah</th>
						</tr>
						<tr>
							<td>something</td>
							<td>something</td>
						</tr>
						<tr>
							<td>something</td>
							<td>something</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
};
