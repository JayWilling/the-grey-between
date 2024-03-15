import React, { useEffect, useState } from "react";
import "./../assets/styling/CustomButton.css";

interface ButtonProps {
	label: string;
	onClick: (state: any) => void;
	state: any;
	selected: any;
}

export const CustomButton = (props: ButtonProps) => {
	const [hovered, setHovered] = useState(false);

	return (
		<button
			className={
				props.state === props.selected || hovered
					? "customButton selected"
					: "customButton"
			}
			onClick={() => props.onClick(props.selected)}
			onMouseOver={() => setHovered(true)}
			onMouseOut={() => setHovered(false)}
		>
			{props.label}
		</button>
	);
};
