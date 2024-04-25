import { createContext, useState } from "react";
import { Star } from "../models/Star";
import { Node } from "../models/UniverseGraph";
import { CBProps, OverlayState } from "../interfaces";
import * as THREE from "three";

export interface IStarMapContext {
	states: {
		pointerPos: THREE.Vector2;

		stars: Star[];
		setStars: React.Dispatch<React.SetStateAction<Star[]>>;

		selectedStar: Star | null;
		setSelectedStar: React.Dispatch<React.SetStateAction<Star | null>>;

		currentStar: Star | null;
		setCurrentStar: React.Dispatch<React.SetStateAction<Star | null>>;

		currentNode: Node<Star> | null;
		setCurrentNode: React.Dispatch<React.SetStateAction<Node<Star> | null>>;

		showStarMap: boolean;
		setShowStarMap: React.Dispatch<React.SetStateAction<boolean>>;

		overlayState: OverlayState;
		setOverlayState: React.Dispatch<React.SetStateAction<OverlayState>>;
	};
	formValues: {
		celestialBodyData: CBProps | null;
		setCelestialBodyData: React.Dispatch<
			React.SetStateAction<CBProps | null>
		>;
	};
}

export const StarMapContext = createContext<IStarMapContext | null>(null);

export const StarMapProvider = (props: React.PropsWithChildren) => {
	// Star map states
	const pointerPos = new THREE.Vector2();
	const [stars, setStars] = useState<Star[]>([]);
	const [selectedStar, setSelectedStar] = useState<Star | null>(null);
	const [currentStar, setCurrentStar] = useState<Star | null>(null);
	const [currentNode, setCurrentNode] = useState<Node<Star> | null>(null);
	const [showStarMap, setShowStarMap] = useState<boolean>(true);
	const [overlayState, setOverlayState] = useState<OverlayState>(
		OverlayState.StarMap
	);

	// Form data
	const [celestialBodyData, setCelestialBodyData] = useState<CBProps | null>(
		null
	);

	const contextValues: IStarMapContext = {
		states: {
			pointerPos,
			stars,
			setStars: setStars,
			selectedStar,
			setSelectedStar: setSelectedStar,
			currentStar,
			setCurrentStar,
			currentNode,
			setCurrentNode,
			showStarMap,
			setShowStarMap,
			overlayState,
			setOverlayState,
		},
		formValues: {
			celestialBodyData,
			setCelestialBodyData,
		},
	};

	return (
		<StarMapContext.Provider value={contextValues}>
			{props.children}
		</StarMapContext.Provider>
	);
};

export default StarMapProvider;
