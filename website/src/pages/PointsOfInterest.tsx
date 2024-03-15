import { useEffect, useState } from "react";
import "./../assets/styling/PointsOfInterest.css";
import { getStars } from "../api/starsApi";
import { Star } from "../assets/data/Star";
import { CustomButton } from "../components/customButton";

// Load and display star data first
// Load and display planets afterwards

// Potentially include a small threejs canvas of the rotating object

export enum DisplayCategory {
	Stars,
	Actors,
	Landmarks,
}

export const PointsOfInterest = () => {
	// Define the data
	const [starData, setStarData] = useState<Star[]>([]);
	const [category, setCategory] = useState<DisplayCategory>(
		DisplayCategory.Stars
	);

	// Load in the POI's
	useEffect(() => {
		const promise = getStars();
		promise.then((data) => {
			if (!data) return;
			setStarData(data);
		});
	}, []);

	function onButtonClick(clickedCategory: DisplayCategory) {
		setCategory(clickedCategory);
		if (clickedCategory === DisplayCategory.Stars) {
		}
		if (clickedCategory === DisplayCategory.Actors) {
		}
		if (clickedCategory === DisplayCategory.Landmarks) {
		}
		console.log(clickedCategory);
	}

	return (
		<div className="page pointsofinterest">
			<div className="button-container">
				<CustomButton
					label="Stars"
					selected={DisplayCategory.Stars}
					onClick={onButtonClick}
					state={category}
				/>
				<CustomButton
					label="Actors"
					selected={DisplayCategory.Actors}
					onClick={onButtonClick}
					state={category}
				/>
				<CustomButton
					label="Landmarks"
					selected={DisplayCategory.Landmarks}
					onClick={onButtonClick}
					state={category}
				/>
			</div>
			<div className="table-container">
				<table>
					<tbody>
						<tr>
							<th>Index</th>
							<th>Name</th>
							<th>p Value</th>
							<th>Colour</th>
							<th>N Value</th>
							<th>Position</th>
						</tr>
						{starData.map((star, index) => {
							return (
								<tr key={index}>
									<td>{star.i}</td>
									<td>{star.n}</td>
									<td>{star.p}</td>
									<td>
										{star.K ? star.K.toString() : "None"}
									</td>
									<td>{star.N}</td>
									<td>
										{"[ " +
											star.x +
											", " +
											star.y +
											", " +
											star.z +
											" ]"}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};
