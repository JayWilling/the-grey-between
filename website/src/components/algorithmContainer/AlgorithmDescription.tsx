import React from "react";

interface DescriptionProps {
	Description: JSX.Element;
	descRef: React.MutableRefObject<null>;
}

export const AlgorithmDescription = (props: DescriptionProps) => {
	return (
		<div className="algorithmDescriptionSlide" ref={props.descRef}>
			{props.Description}
		</div>
	);
};
