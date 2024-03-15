import { ReactNode, useEffect, useMemo, useRef } from "react";
import "./Loader.css";

export const Loader = (props: { loading: boolean }) => {
	const loaderRef = useRef(null);

	const dotCount = 60;

	// const Dot = () => {
	// 	return (
	// 		<div className="arm">
	// 			<div className="dot"></div>
	// 		</div>
	// 	);
	// };

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
		<div className="loader-container">
			<p>LOADING</p>
			<div ref={loaderRef} className="loader">
				{dots.map((dot, index) => {
					return dot;
				})}
			</div>
			<div className={props.loading ? "void" : "void expand"}></div>
		</div>
	);
};
