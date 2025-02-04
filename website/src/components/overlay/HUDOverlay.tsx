import { useContext, useEffect, useRef } from "react";
import { CBProps, JSONStar, OverlayState } from "../../interfaces";
import { CelestialBodyForm } from "./CelestialBodyForm";
import { StarMapStarMenu } from "./StarMenu/StarMapStarMenu";
import { SolarSystemStarMenu } from "./StarMenu/SolarSystemStarMenu";
import { Star } from "../../models/Star";
import { NodeForm } from "./NodeForm";
import { SearchableDropdown } from "../SearchableDropdown/SearchableDropdown";
import { SearchBar } from "./SearchBar/SearchBar";
import { IStarMapContext, StarMapContext } from "../../pages/StarMapContext";

export interface CanvasOverlayProps {}

export const StarMapOverlay = (props: CanvasOverlayProps) => {
	// const circleIdentiferRef = useRef<HTMLDivElement>(null);
	const nameRef = useRef<HTMLDivElement>(null);

	const { states, refs } = useContext(StarMapContext) as IStarMapContext;

	useEffect(() => {
		if (refs.circleIdentifierRef.current === null) {
			return;
		}
		if (states.highlightedObjectScreenPosition === null) {
			return;
		}

		// Why 27?
		// height / width of identifier = 50px, border-width = 2px;
		// half plus the border gives 27 to centre the star
		refs.circleIdentifierRef.current.style.top =
			((states.highlightedObjectScreenPosition.y - 27) /
				window.innerHeight) *
				100 +
			"%";
		refs.circleIdentifierRef.current.style.left =
			((states.highlightedObjectScreenPosition.x - 27) /
				window.innerWidth) *
				100 +
			"%";

		// Update Star name
		if (nameRef.current === null) {
			return;
		}
		// Fetch other identifiers
		const starQuery = `
        SELECT id2.id
        FROM ident AS id1 JOIN ident AS id2 USING(oidref)
        WHERE id1.id = '${states.selectedStar?.n}';
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
		if (states.selectedStar?.n) {
			nameRef.current.innerHTML = states.selectedStar.n;
		} else {
			// props.currentStar?.n;
		}
	}, [states.highlightedObjectScreenPosition]);

	function renderStarMenu() {
		// Change the options in the side bar depending on state
		switch (states.overlayState) {
			case OverlayState.StarMap:
				return <StarMapStarMenu {...props} />;
			case OverlayState.SolarSystem:
				return <SolarSystemStarMenu {...props} />;
			case OverlayState.CreateCB:
				return;
			case OverlayState.CreateNode:
				return;
			case OverlayState.CreateNode:
				return;
			case OverlayState.Story:
			default:
				alert(
					"Missing case for OverlayState: " +
						states.overlayState +
						" in HUDOverlay."
				);
		}
	}

	return (
		<div className="starmapOverlay">
			<div className="starmapRelativeWrapper">
				<SearchBar
					options={states.stars}
					label={"n"}
					id={"_id"}
					selectedValue={states.currentStar}
					handleChange={(star: Star) => {
						states.setSelectedStar(star);
						states.setCurrentStar(star);
					}}
				/>
				<NodeForm {...props} />
				<CelestialBodyForm {...props} />
				<div className="starMenu-container expanded">
					<div ref={nameRef} className="starMenu-header">
						{states.selectedStar?.n
							? states.selectedStar.n
							: states.currentStar?.n}
					</div>
					{renderStarMenu()}
				</div>
				<div
					className="starCircleIdentifier"
					ref={refs.circleIdentifierRef}
				></div>
				<div className="solarSystemOverlay"></div>
			</div>
		</div>
	);
};
