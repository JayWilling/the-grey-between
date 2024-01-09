import React from "react";
import { JSONStar } from "./StarMap";
import { Star } from "./Star";
import { Planet } from "./Planet";

interface SolarSystemProps {
	starInfo: JSONStar;
	planetList: string[];
}

export const SolarSystem = (props: SolarSystemProps) => {
	return (
		<group>
			<Star position={[0, 0, 0]} />
			<Planet position={[-5, -5, 0]} />
		</group>
	);
};
