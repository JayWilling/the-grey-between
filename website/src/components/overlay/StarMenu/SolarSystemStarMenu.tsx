import { useContext } from "react";
import { OverlayState } from "../../../interfaces";
import { CanvasOverlayProps } from "../HUDOverlay";
import { IStarMapContext, StarMapContext } from "../../../pages/StarMapContext";

export const SolarSystemStarMenu = (props: CanvasOverlayProps) => {
	const { handlers } = useContext(StarMapContext) as IStarMapContext;

	return (
		<div className="starMenu">
			<div
				className="starMenu-item"
				onClick={(e) =>
					handlers.updateOverlayState(e, OverlayState.StarMap)
				}
			>
				Return to star map
			</div>
			<div
				className="starMenu-item"
				onClick={(e) =>
					handlers.updateOverlayState(e, OverlayState.CreateCB)
				}
			>
				Add celestial body
			</div>
		</div>
	);
};
