import { useEffect, useRef } from "react";
import { JSONStar } from "./data/Stars";

interface CanvasOverlayProps {
	position: { x: number; y: number } | null;
	selectedStar: JSONStar | null;
	setSelectedStar: React.Dispatch<React.SetStateAction<JSONStar | null>>;
	currentStar: JSONStar | null;
	setCurrentStar: React.Dispatch<React.SetStateAction<JSONStar | null>>;
	showStarMap: boolean;
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StarMapOverlay = (props: CanvasOverlayProps) => {
	const circleIdentiferRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (circleIdentiferRef.current === null) {
			return;
		}
		if (props.position === null) {
			return;
		}

		// Why 27?
		// height / width of identifier = 50px, border-width = 2px;
		// half plus the border gives 27 to centre the star
		circleIdentiferRef.current.style.top =
			((props.position.y - 27) / window.innerHeight) * 100 + "%";
		circleIdentiferRef.current.style.left =
			((props.position.x - 27) / window.innerWidth) * 100 + "%";
	}, [props.position]);

	function moveToStar(e: React.MouseEvent<HTMLDivElement>) {
		// updateCameraPosition(
		// 	target,
		// 	props.cameraControlsRef.current,
		// 	camera,
		// 	10,
		// 	2000,
		// 	false
		// );
		e.preventDefault();
		console.log("Button is working");
		props.setCurrentStar(props.selectedStar);
		// props.setSelectedStar(null);
	}

	return (
		<div className="starmapOverlay">
			<div className="starMenu-container expanded">
				<div className="starMenu-searchbar">Search</div>
				<div className="starMenu-header">
					{props.selectedStar?.n
						? props.selectedStar.n
						: props.currentStar?.n}
				</div>
				<div className="starMenu">
					<div
						className="starMenu-item"
						onClick={(e) => moveToStar(e)}
					>
						Navigate to system
					</div>
					<div
						className="starMenu-item"
						onClick={(e) => props.setShowStarMap(false)}
					>
						View system
					</div>

					<div></div>
				</div>
			</div>
			<div
				className="starCircleIdentifier"
				ref={circleIdentiferRef}
			></div>
		</div>
	);
};
