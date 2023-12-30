import React from "react";

interface DemonstrationProps {
	Demonstration: JSX.Element;
}

export const AlgorithmDemonstration = (props: DemonstrationProps) => {
	return (
		<div className="algorithmDemonstrationSlide">{props.Demonstration}</div>
	);
};
