import { useEffect, useRef } from "react";
import { CBProps, JSONStar, OverlayState } from "../../interfaces";
import { CelestialBodyForm } from "./CelestialBodyForm";
import { StarMapStarMenu } from "./StarMenu/StarMapStarMenu";
import { SolarSystemStarMenu } from "./StarMenu/SolarSystemStarMenu";
import { Star } from "../../models/Star";
import { NodeForm } from "./NodeForm";
import { SearchableDropdown } from "../SearchableDropdown/SearchableDropdown";
import { SearchBar } from "./SearchBar/SearchBar";

export interface CanvasOverlayProps {
	stars: Star[];
	circleIdentifierRef: React.RefObject<HTMLDivElement>;
	position: { x: number; y: number } | null;
	selectedStar: Star | null;
	setSelectedStar: React.Dispatch<React.SetStateAction<Star | null>>;
	currentStar: Star;
	setCurrentStar: React.Dispatch<React.SetStateAction<Star | null>>;
	showStarMap: boolean;
	setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;
	overlayState: OverlayState;
	setOverlayState: React.Dispatch<React.SetStateAction<OverlayState>>;
	updateOverlayState: (
		e: React.MouseEvent<HTMLElement>,
		state: OverlayState
	) => void;
	celestialBodyData: CBProps | null;
	setCelestialBodyData: React.Dispatch<React.SetStateAction<CBProps | null>>;
}

export const StarMapOverlay = (props: CanvasOverlayProps) => {
	// const circleIdentiferRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (props.circleIdentifierRef.current === null) {
			return;
		}
		if (props.position === null) {
			return;
		}

		// Why 27?
		// height / width of identifier = 50px, border-width = 2px;
		// half plus the border gives 27 to centre the star
		props.circleIdentifierRef.current.style.top =
			((props.position.y - 27) / window.innerHeight) * 100 + "%";
		props.circleIdentifierRef.current.style.left =
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
		// Change the options in the side bar depending on state
		switch (props.overlayState) {
			case OverlayState.StarMap:
				return <StarMapStarMenu {...props} />;
			case OverlayState.SolarSystem:
				return <SolarSystemStarMenu {...props} />;
			case OverlayState.CreateCB:
				return;
			case OverlayState.CreateNode:
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
			<div className="starmapRelativeWrapper">
				<SearchBar
					options={props.stars}
					label={"n"}
					id={"_id"}
					selectedValue={props.currentStar}
					handleChange={(star: Star) => {
						props.setSelectedStar(star);
						props.setCurrentStar(star);
					}}
				/>
				<NodeForm {...props} />
				<CelestialBodyForm {...props} />
				<div className="starMenu-container expanded">
					<div ref={nameRef} className="starMenu-header">
						{props.selectedStar?.n
							? props.selectedStar.n
							: props.currentStar?.n}
					</div>
					{renderStarMenu()}
				</div>
				<div
					className="starCircleIdentifier"
					ref={props.circleIdentifierRef}
				></div>
				<div className="solarSystemOverlay"></div>
			</div>
		</div>
	);
};
