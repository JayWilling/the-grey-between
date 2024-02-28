import { Line } from "@react-three/drei";
import React from "react";
import * as THREE from "three";
import { JSONStar } from "../../assets/data/Stars";

interface TradeRoutesProps {
	selectedStar: JSONStar | null;
	startPos: THREE.Vector3;
	endPos: THREE.Vector3[];
	neighbours: JSONStar[];
}

const TradeRoute = () => {
	return <></>;
};

export const TradeRoutes = (props: TradeRoutesProps) => {
	// const routes = useMemo(() => {

	// });
	if (!props.selectedStar) return <></>;
	const x = props.selectedStar.x;
	const y = props.selectedStar.y;
	const z = props.selectedStar.z;
	if (x && y && z) {
		return (
			<group>
				{props.endPos.map((pos, i) => {
					return (
						<Line
							key={i}
							points={[new THREE.Vector3(x, y, z), pos]}
							dashed
							color={"white"}
							lineWidth={2}
						></Line>
					);
				})}
			</group>
		);
	}
	return (
		<group>
			{props.endPos.map((pos, i) => {
				return (
					<Line
						key={i}
						points={[new THREE.Vector3(0, 0, 0), pos]}
						dashed
						color={"white"}
						lineWidth={2}
					></Line>
				);
			})}
		</group>
	);
};
