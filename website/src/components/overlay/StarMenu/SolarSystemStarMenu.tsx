import { OverlayState } from "../../../interfaces";
import { CanvasOverlayProps } from "../HUDOverlay";

export const SolarSystemStarMenu = (props: CanvasOverlayProps) => {
	function returnToStarMap(e: React.MouseEvent<HTMLDivElement>) {
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
			<div
				className="starMenu-item"
				onClick={(e) =>
					props.updateOverlayState(e, OverlayState.StarMap)
				}
			>
				Return to star map
			</div>
			<div
				className="starMenu-item"
				onClick={(e) =>
					props.updateOverlayState(e, OverlayState.CreateCB)
				}
			>
				Add celestial body
			</div>
		</div>
	);
};
