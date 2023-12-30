import React, { Dispatch, SetStateAction, useRef } from "react";
import "./CustomRadioBtn.css";

interface RadioProps {
	option1: string;
	option2: string;
	selected: boolean;
	setSelected: Dispatch<SetStateAction<boolean>>;
}

export const CustomRadioBtn = (props: RadioProps) => {
	const radioBtnBackgroundRef = useRef(null);

	function onClick() {
		props.setSelected(!props.selected);
		if (radioBtnBackgroundRef.current != null) {
			const radioBtnBackgroundDiv =
				radioBtnBackgroundRef.current as HTMLDivElement;
			if (props.selected) {
				radioBtnBackgroundDiv.style.right = "calc(100% - 4vh)";
				// radioBtnBackgroundDiv.style.left = "";
			} else {
				radioBtnBackgroundDiv.style.right = "calc(0% - 2vh)";
				// radioBtnBackgroundDiv.style.right = "";
			}
			// radioBtnBackgroundDiv.style.right = "calc(100% - 4vh)";
		}
	}

	return (
		<div className="custom-radio-btn" onClick={() => onClick()}>
			<div className="radio-options-container">
				<div
					ref={radioBtnBackgroundRef}
					className="radio-option-cover"
				></div>

				<div
					className={
						props.selected
							? "radio-option"
							: "radio-option selected"
					}
				>
					{props.option1}
				</div>
				<div
					className={
						props.selected
							? "radio-option selected"
							: "radio-option"
					}
				>
					{props.option2}
				</div>
			</div>
		</div>
	);
};
