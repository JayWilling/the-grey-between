import { useEffect, useRef } from "react";
import { JSONStar } from "../../assets/data/Stars";
import { OverlayState } from "../../interfaces";
import { CelestialBodyForm } from "./CelestialBodyForm";
import { StarMapStarMenu } from "./StarMenu/StarMapStarMenu";
import { SolarSystemStarMenu } from "./StarMenu/SolarSystemStarMenu";

export interface CanvasOverlayProps {
	position: { x: number; y: number } | null;
	selectedStar: JSONStar | null;
	setSelectedStar: React.Dispatch<React.SetStateAction<JSONStar | null>>;
	currentStar: JSONStar | null;
	setCurrentStar: React.Dispatch<React.SetStateAction<JSONStar | null>>;
	showStarMap: boolean;
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	overlayState: OverlayState;
	setOverlayState: React.Dispatch<React.SetStateAction<OverlayState>>;
	updateOverlayState: (
		e: React.MouseEvent<HTMLElement>,
		state: OverlayState
	) => void;
}

export const StarMapOverlay = (props: CanvasOverlayProps) => {
	const circleIdentiferRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<HTMLDivElement>(null);

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

		// Update Star name
		if (nameRef.current === null) {
			return;
		}
		// Fetch other identifiers
		const starQuery = `
        SELECT id2.id
        FROM ident AS id1 JOIN ident AS id2 USING(oidref)
        WHERE id1.id = '${props.selectedStar?.n}';
        `;
		const fetchRequestOptions: RequestInit = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				REQUEST: "doQuery",
				PHASE: "RUN",
				FORMAT: "votable",
				LANG: "ADQL",
				query: starQuery,
			}),
		};
		// await fetch(
		// 	"https://simbad.cds.unistra.fr/simbad/sim-tap/sync",
		// 	fetchRequestOptions
		// );
		if (props.selectedStar?.n) {
			nameRef.current.innerHTML = props.selectedStar.n;
		} else {
			// props.currentStar?.n;
		}
	}, [props.position]);

	function renderStarMenu() {
		switch (props.overlayState) {
			case OverlayState.StarMap:
				return <StarMapStarMenu {...props} />;
			case OverlayState.SolarSystem:
				return <SolarSystemStarMenu {...props} />;
			case OverlayState.CreateCB:
				return;
			case OverlayState.Story:
			default:
				alert(
					"Missing case for OverlayState: " +
						props.overlayState +
						" in HUDOverlay."
				);
		}
	}

	return (
		<div className="starmapOverlay">
			<CelestialBodyForm {...props} />
			<div className="starMenu-container expanded">
				<div className="starMenu-searchbar">Search</div>
				<div ref={nameRef} className="starMenu-header">
					{props.selectedStar?.n
						? props.selectedStar.n
						: props.currentStar?.n}
				</div>
				{renderStarMenu()}
			</div>
			<div
				className="starCircleIdentifier"
				ref={circleIdentiferRef}
			></div>
			<div className="solarSystemOverlay"></div>
		</div>
	);
};
