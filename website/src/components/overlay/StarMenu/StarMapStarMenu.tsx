import { OverlayState } from "../../../interfaces";
import { CanvasOverlayProps } from "../HUDOverlay";

export const StarMapStarMenu = (props: CanvasOverlayProps) => {
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

	function openStarSystem(e: React.MouseEvent<HTMLDivElement>) {
		e.preventDefault();
		if (props.showStarMap) {
			props.setShowStarMap(false);
			props.setOverlayState(OverlayState.SolarSystem);
		} else {
			props.setShowStarMap(true);
			props.setOverlayState(OverlayState.StarMap);
		}
	}

	return (
		<div className="starMenu">
			<div className="starMenu-item" onClick={(e) => moveToStar(e)}>
				Navigate to system
			</div>
			<div
				className="starMenu-item"
				onClick={(e) =>
					props.updateOverlayState(e, OverlayState.SolarSystem)
				}
			>
				View system
			</div>
		</div>
	);
};
