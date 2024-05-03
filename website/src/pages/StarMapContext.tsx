import { createContext, useRef, useState } from "react";
import { Star } from "../models/Star";
import { Node } from "../models/UniverseGraph";
import { CBProps, OverlayState } from "../interfaces";
import * as THREE from "three";

export interface IStarMapContext {
	states: {
		pointerPos: THREE.Vector2;

		highlightedObjectScreenPosition: { x: number; y: number } | null;
		setHighlightedObjectScreenPosition: React.Dispatch<
			React.SetStateAction<{ x: number; y: number } | null>
		>;

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
	refs: {
		circleIdentifierRef: React.RefObject<HTMLDivElement>;
		cameraControlsRef: React.RefObject<any>;
	};
}

export const StarMapContext = createContext<IStarMapContext | null>(null);

export const StarMapProvider = (props: React.PropsWithChildren) => {
	// Star map states
	const pointerPos = new THREE.Vector2();
	const [
		highlightedObjectScreenPosition,
		setHighlightedObjectScreenPosition,
	] = useState<{ x: number; y: number } | null>(null);
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

	// Refs
	const circleIdentifierRef = useRef<HTMLDivElement>(null);
	const cameraControlsRef = useRef<any>(null);

	const contextValues: IStarMapContext = {
		states: {
			pointerPos,
			highlightedObjectScreenPosition,
			setHighlightedObjectScreenPosition,
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
		refs: {
			circleIdentifierRef,
			cameraControlsRef,
		},
	};

	return (
		<StarMapContext.Provider value={contextValues}>
			{props.children}
		</StarMapContext.Provider>
	);
};

export default StarMapProvider;
