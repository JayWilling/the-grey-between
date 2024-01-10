import React from "react";
import { JSONStar } from "./StarMap";
import { Star } from "./Star";
import { Planet } from "./Planet";

interface SolarSystemProps {
	// starInfo: JSONStar;
	// planetList: string[];
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	starData: JSONStar;
}

function onStarClick() {}

export const SolarSystem = (props: SolarSystemProps) => {
	return (
		<group>
			<Star
				onClick={() => {
					props.setShowStarMap(true);
				}}
				position={[0, 0, 0]}
				data={props.starData}
			/>
			<Planet position={[-30, 0, 0]} />
		</group>
	);
};
