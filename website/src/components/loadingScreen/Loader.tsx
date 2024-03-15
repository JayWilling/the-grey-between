import { ReactNode, useEffect, useMemo, useRef } from "react";
import "./Loader.css";

export enum LoadState {
	Loading,
	Transition,
	Loaded,
}

export const Loader = (props: {
	loading: LoadState;
	colorFrom: string;
	colorTo: string;
	loadingText: string;
	loadedText: string;
}) => {
	const loaderRef = useRef(null);

	const dotCount = 60;

	const preHighlight = props.colorFrom === "white" ? "black" : "white";
	const postHighlight = props.colorTo === "white" ? "black" : "white";

	const dots = useMemo(() => {
		const dotList = [];
		for (let i = 0; i < dotCount; i++) {
			dotList.push(
				<div className="arm">
					<div className="dot"></div>
				</div>
			);
		}
		return dotList;
	}, [dotCount]);

	function animate() {
		const rand = Math.floor(Math.random() * 4001) + 1000;
		setTimeout(() => {
			if (!loaderRef.current) return;
			const loader = loaderRef.current as HTMLDivElement;
			const arms = loader.children as HTMLCollectionOf<HTMLDivElement>;
			for (let i = 0; i < arms.length; i++) {
				const armRotation = Math.floor(Math.random() * 541) + 20;
				const armTransition = Math.floor(Math.random() * 6) + 3;
				arms[i].style.transform = "rotate(" + armRotation + "deg)";
				arms[i].style.transition = armTransition + "s ease-out";
			}
			animate();
		}, rand);
	}

	useEffect(() => {
		if (!loaderRef.current) return;
		animate();
	}, []);

	return (
		<div
			style={{ backgroundColor: props.colorFrom, color: preHighlight }}
			className="loader-container"
		>
			<div
				style={{
					backgroundColor: props.colorTo,
					color: postHighlight,
				}}
				className={
					props.loading === LoadState.Loading ? "void" : "void expand"
				}
			>
				<p
					style={{ color: postHighlight }}
					className={
						props.loading === LoadState.Loading
							? "loaded-text"
							: "loaded-text fade"
					}
				>
					{props.loadedText}
				</p>
			</div>
			<p style={{ color: preHighlight }}>{props.loadingText}</p>
			<div ref={loaderRef} className="loader">
				{dots.map((dot, index) => {
					return dot;
				})}
			</div>
		</div>
	);
};
