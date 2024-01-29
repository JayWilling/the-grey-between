import React from "react";
import "./Home.css";

interface ChecklistItemProps {
	item: string;
	checked: boolean;
}

const ChecklistItem = (props: ChecklistItemProps) => {
	return (
		<span className="checklistItem">
			<input type="checkbox" checked={props.checked} />
			<label>{props.item}</label>
		</span>
	);
};

export const Home = () => {
	return (
		<div className="homePage">
			<h1>The Grey Between</h1>
			<p>
				The Grey Between is a science fiction story set within the
				confines of the Milky Way galaxy. Current data will be used to
				help establish and define locations and points of interest
				within the universe.
			</p>
			<p>
				Simulations may be run to visualise certain elements such as the
				expected expansion of humanity throughout the universe, or the
				tug of war by rendering regions of varying political control.
			</p>
			<p>
				If you have any recommendations, notice any mistakes or wish to
				add your own implementations feel free to reach out at
				jwilling123@gmail.com
			</p>
			<br />
			<h2>Data</h2>
			<p>
				The current dataset being used is the following:{" "}
				<a>https://github.com/frostoven/BSC5P-JSON-XYZ</a> and is
				derived from the HIPPARCOS dataset:{" "}
				<a>https://heasarc.gsfc.nasa.gov/W3Browse/all/hipparcos.html</a>
			</p>
			<p>
				Star type and distances have estimates tied to them and may be
				incorrect or unreliable.
			</p>
			<p>
				As the project progresses the GAIA dataset will be adapted to
				provide a significantly larger collection of known stars.
			</p>
			<h1>Language, Frameworks and Libraries</h1>
			<ul>
				<li>Typescript</li>
				<li>React</li>
				<li>React Three Fiber</li>
				<li>
					React Force Graph - Can provide nice visualisations and
					force simulations, but has a limited use case due to
					performance.
				</li>
			</ul>
			<p>
				The star map relies heavily upon ThreeJS, using MongoDB and
				expressJS for backend storage and functionality.
			</p>
			<h2>Function Checklist</h2>
			<div className="algorithmChecklist">
				<ChecklistItem checked={false} item="Starmap" />
				<p>
					Users will be able to view the star field, search for stars,
					and view spectral information
				</p>
				<ChecklistItem checked={false} item="Solar system viewer" />
				<p>
					Each system included within the story will have a
					hand-crafted solar system in the absence of available data.
					Celestial bodies of various types and scales will be
					included.
				</p>
				<ChecklistItem checked={false} item="Story navigation" />
				<p>
					Outside of free navigation users will be able to follow the
					story as they read, gathering additional information on each
					location or point in history if they choose to read further.
				</p>
				<ChecklistItem checked={false} item="World simulations" />
				<p>
					To more readily bring the world of The Grey Between to life,
					simulations on human movement, trade and politics will be
					added.
				</p>
				<ChecklistItem checked={false} item="More..." />
			</div>
		</div>
	);
};
