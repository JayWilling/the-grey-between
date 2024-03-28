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
		props.setCurrentStar(props.selectedStar);
		// props.setSelectedStar(null);
	}

	return (
		<div className="starMenu">
			<div className="starMenu-item" onClick={(e) => moveToStar(e)}>
				Navigate to system
			</div>
			<div
				className="starMenu-item"
				onClick={async (e) =>
					await props.updateOverlayState(e, OverlayState.SolarSystem)
				}
			>
				View system
			</div>
		</div>
	);
};
