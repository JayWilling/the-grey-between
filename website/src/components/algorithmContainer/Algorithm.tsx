import React, { useEffect, useState, useRef } from "react";
import { CustomRadioBtn } from "../CustomRadioBtn";
import { AlgorithmDescription } from "./AlgorithmDescription";
import { AlgorithmDemonstration } from "./AlgorithmDemonstration";
import "./AlgorithmContainer.css";

export interface AlgorithmProps {
	title: string;
	// markdownLocation: string;
	Description: JSX.Element;
	Demonstration: JSX.Element;
}

export const AlgorithmContainer = (props: AlgorithmProps) => {
	// If we want to use Mermaid to show any graphs or charts
	// https://stackblitz.com/edit/react-ts-mermaid?file=index.tsx
	// We would be better off using other TS libraries

	// Something like React flow
	// https://reactflow.dev/docs/examples/nodes/update-node/
	// Use as a visual way to change inputs to the algorithms

	const [markdown, setMarkdown] = useState<null | string>(null);
	const [itemShown, setItemShown] = useState(false);
	const [showDescription, setShowDescription] = useState(true);

	const slideRef = useRef(null);
	const descriptionRef = useRef(null);
	const headerRef = useRef(null);
	const chevronLeftRef = useRef(null);
	const chevronRightRef = useRef(null);

	useEffect(() => {
		// if (
		// 	headerRef.current != null &&
		// 	slideRef.current != null &&
		// 	descriptionRef.current != null
		// ) {
		// 	const slideElement = slideRef.current as HTMLDivElement;
		// 	const descriptionElement = descriptionRef.current as HTMLDivElement;
		// 	const headerElement = headerRef.current as HTMLDivElement;
		// }
		// fetch(props.markdownLocation)
		// 	.then((res) => res.text())
		// 	.then((text) => setMarkdown(text));
	}, []);

	function onHeaderClick() {
		if (
			headerRef.current != null &&
			slideRef.current != null &&
			descriptionRef.current != null &&
			chevronLeftRef.current != null &&
			chevronRightRef.current != null
		) {
			const descriptionElement = descriptionRef.current as HTMLDivElement;
			const chevronLeftElement = chevronLeftRef.current as HTMLElement;
			const chevronRightElement = chevronRightRef.current as HTMLElement;

			if (showDescription) {
				descriptionElement.style.top = "-100%";
				chevronLeftElement.style.rotate = "180deg";
				chevronRightElement.style.rotate = "-180deg";
			} else {
				descriptionElement.style.top = "0%";
				chevronLeftElement.style.rotate = "0deg";
				chevronRightElement.style.rotate = "-0deg";
			}
			setShowDescription(!showDescription);
		}
	}

	return (
		<div className="slideRevealHeader">
			<div
				className="algorithmHeader"
				ref={headerRef}
				onClick={() => onHeaderClick()}
			>
				<i
					className="fa-solid fa-chevron-up chevron-bob"
					ref={chevronLeftRef}
				></i>
				<h1>{props.title}</h1>
				<i
					className="fa-solid fa-chevron-up chevron-bob"
					ref={chevronRightRef}
				></i>
			</div>
			<div className="slideReveal" ref={slideRef}>
				<AlgorithmDescription
					Description={props.Description}
					descRef={descriptionRef}
				/>
				<AlgorithmDemonstration Demonstration={props.Demonstration} />
			</div>
		</div>
	);
};
