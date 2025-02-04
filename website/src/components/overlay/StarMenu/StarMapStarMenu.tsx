import { useContext } from "react";
import { OverlayState } from "../../../interfaces";
import { CanvasOverlayProps } from "../HUDOverlay";
import { IStarMapContext, StarMapContext } from "../../../pages/StarMapContext";

export const StarMapStarMenu = (props: CanvasOverlayProps) => {
	const { states, handlers } = useContext(StarMapContext) as IStarMapContext;

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
		if (states.selectedStar != states.currentStar) {
			states.setCurrentStar(states.selectedStar);
		}
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
					await handlers.updateOverlayState(
						e,
						OverlayState.SolarSystem
					)
				}
			>
				View system
			</div>
			{states.currentNode ? (
				<div
					className="starMenu-item"
					onClick={async (e) =>
						await handlers.updateOverlayState(
							e,
							OverlayState.ViewNode
						)
					}
				>
					View Details
				</div>
			) : (
				<></>
			)}
		</div>
	);
};
