import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./StarMap.css";

import * as THREE from "three";
import {
	Canvas,
	useFrame,
	useThree,
	ThreeElements,
	useLoader,
	ThreeEvent,
} from "@react-three/fiber";
import {
	Bounds,
	CameraControls,
	Grid,
	OrbitControls,
	OrbitControlsProps,
	PerspectiveCamera,
	useBounds,
} from "@react-three/drei";
import TWEEN from "@tweenjs/tween.js";
import Stars from "./data/bsc5p_3d.json";

// Interfaces & Types

interface JSONStar extends SharedArrayBuffer {
	i: number;
	n: string | null;
	x: number | null;
	y: number | null;
	z: number | null;
	p: number | null;
	N: number | null;
	K?: undefined | RGBColours;
}

interface RGBColours {
	r: number;
	g: number;
	b: number;
}

// Create a component
const Star = (props: ThreeElements["mesh"]) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);

	const camera = useThree((state) => state.camera);
	// useFrame((state, delta) => (ref.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => setClicked(!clicked)}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<pointLight position={props.position} intensity={100} />
			<sphereGeometry args={[100, 16, 16]} />
			{/* <circleGeometry args={[3, 4]} /> */}
			<meshStandardMaterial
				emissive="red"
				emissiveIntensity={20}
				color={hovered ? "hotpink" : "orange"}
			/>
		</mesh>
	);
};

const Planet = (props: ThreeElements["mesh"]) => {
	const ref = useRef<THREE.Mesh>(null!);
	const [clicked, setClicked] = useState<boolean>(false);
	const [hovered, setHovered] = useState<boolean>(false);
	// useFrame((state, delta) => (ref.current.rotation.x += delta));

	return (
		<mesh
			{...props}
			ref={ref}
			// scale={clicked ? 1.5 : 1}
			onClick={(event: any) => setClicked(!clicked)}
			onPointerOver={(event) => setHovered(true)}
			onPointerOut={(event) => setHovered(false)}
		>
			<sphereGeometry args={[1, 16, 16]} />
			<meshStandardMaterial color={hovered ? "hotpink" : "green"} />
		</mesh>
	);
};

// This component wraps children in a group with a click handler
// Clicking any object will refresh and fit bounds
function SelectToZoom({ children }: any) {
	const api = useBounds();
	return (
		<group
			onClick={(e) => (
				e.stopPropagation(), e.delta <= 2 && api.refresh(e.object).fit()
			)}
			onPointerMissed={(e) => e.button === 0 && api.refresh().fit()}
		>
			{children}
		</group>
	);
}

interface StarPointProps {
	starsBuffer: StarsBufferAttributes;
	pointerPos: THREE.Vector2;
	highlightIndex: number | null;
	setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
	cameraControlsRef: any;
}

interface StarsBufferAttributes {
	positions: THREE.BufferAttribute;
	colours: THREE.BufferAttribute;
	sizes: THREE.BufferAttribute;
}

const StarPoints = (props: StarPointProps) => {
	const { gl, scene, raycaster, camera } = useThree();
	// let intersectIndex: number | null = null;

	// Define Point Materials
	const vertexShaderText = `
    attribute float size;
    attribute vec3 customColor;

    varying vec3 vColor;

    void main() {

        vColor = customColor;

        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

        gl_PointSize = 0.1 + size * ( 300.0 / -mvPosition.z );

        gl_Position = projectionMatrix * mvPosition;

    }`;
	const fragmentShaderText = `
    uniform vec3 color;
    uniform sampler2D pointTexture;
    uniform float alphaTest;

    varying vec3 vColor;

    void main() {

        gl_FragColor = vec4( color * vColor, 1.0 );

        gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

        if ( gl_FragColor.a < alphaTest ) discard;

    }`;
	const discTexture = useLoader(THREE.TextureLoader, "disc.png");
	const pointMaterial = useMemo(
		() => ({
			uniforms: {
				color: { value: new THREE.Color(0xffffff) },
				pointTexture: {
					value: discTexture,
				},
				alphaTest: { value: 0.9 },
			},
			vertexShader: vertexShaderText,
			fragmentShader: fragmentShaderText,
		}),
		[]
	);
	const pointsRef = useRef<THREE.Points>(null);

	// Highlight Sphere
	const sphereRef = useRef<THREE.Mesh>(null);
	// const starPos = new THREE.BufferAttribute(new Float32Array([0, 0, 0]), 3);

	// Handle star select
	function onClickEvent(e: ThreeEvent<MouseEvent>): void {
		const points = pointsRef.current;
		const orbitControls = props.cameraControlsRef.current;
		if (
			points === null ||
			props.highlightIndex === null ||
			orbitControls === null
		) {
			return;
		}

		const positions = points.geometry.attributes.position.array;
		const x = positions[props.highlightIndex * 3];
		const y = positions[props.highlightIndex * 3 + 1];
		const z = positions[props.highlightIndex * 3 + 2];

		const worldScale = new THREE.Vector3();
		points.getWorldScale(worldScale);
		console.log(worldScale);

		const oldPos = camera.position;
		const targetPos = new THREE.Vector3(x, y, z);

		// Tween to new target
		new TWEEN.Tween(orbitControls.target)
			.to(targetPos, 2000)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();

		// Tween to new camera location
		//      Point in-between old and new position

		// Get unit vector
		const unitVector = new THREE.Vector3();
		unitVector.subVectors(oldPos, targetPos).normalize();
		const newPos = new THREE.Vector3(
			targetPos.x + unitVector.x * 10,
			targetPos.y + unitVector.y * 10,
			targetPos.z + unitVector.z * 10
		);

		new TWEEN.Tween(camera.position)
			.to(newPos, 2500)
			.easing(TWEEN.Easing.Cubic.Out)
			.start();
	}

	// Perform per-frame actions
	useFrame((state, delta, xrFrame) => {
		// Handle stars mouseover
		const points = pointsRef.current;
		const highlightSphere = sphereRef.current;
		let tempHighlightIndex = props.highlightIndex;

		if (points === null || highlightSphere === null) {
			return;
		}

		// Points geometry
		const geometry = points.geometry;
		const attributes = geometry.attributes;

		// Sphere geometry
		// highlightSphere.position;

		raycaster.setFromCamera(props.pointerPos, camera);
		const intersectedObjs = raycaster.intersectObject(points);

		if (intersectedObjs.length > 0) {
			if (
				tempHighlightIndex == null &&
				intersectedObjs[0].index &&
				tempHighlightIndex != intersectedObjs[0].index
			) {
				tempHighlightIndex = intersectedObjs[0].index;
				attributes.size.array[tempHighlightIndex] = 3;
				attributes.size.needsUpdate = true;

				// Show highlight sphere
				const x = attributes.position.array[tempHighlightIndex * 3];
				const y = attributes.position.array[tempHighlightIndex * 3 + 1];
				const z = attributes.position.array[tempHighlightIndex * 3 + 2];

				highlightSphere.position.set(x, y, z);

				// Move camera
				// camera.lookAt(x, y, z);
			}
		} else if (tempHighlightIndex !== null) {
			attributes.size.array[tempHighlightIndex] = 2;
			attributes.size.needsUpdate = true;
			tempHighlightIndex = null;
		}
		props.setHighlightIndex(tempHighlightIndex);

		// gl.render(scene, camera);
	});

	// useEffect(() => {
	// 	const tempVertShader =
	// 		document.getElementById("vertexShader")?.textContent;
	// 	const tempFragShader =
	// 		document.getElementById("fragmentShader")?.textContent;

	// 	if (tempVertShader != null) {
	// 		vertexShaderText = tempVertShader;
	// 	}
	// 	if (tempFragShader != null) {
	// 		fragmentShaderText = tempFragShader;
	// 	}

	// 	gl.compile(scene, camera);
	// }, []);

	if (Stars == null) {
		return <></>;
	}
	return (
		<>
			<points
				ref={pointsRef}
				onClick={(e) => {
					onClickEvent(e);
				}}
			>
				<bufferGeometry>
					<bufferAttribute
						attach={"attributes-position"}
						{...props.starsBuffer.positions}
					/>
					<bufferAttribute
						attach={"attributes-customColor"}
						{...props.starsBuffer.colours}
					/>
					<bufferAttribute
						attach={"attributes-size"}
						{...props.starsBuffer.sizes}
					/>
					{/* <bufferAttribute attach={"attrbiutes-material"} /> */}
				</bufferGeometry>
				{/* <pointsMaterial
				size={0.1}
				color={0xff00ff}
				sizeAttenuation={true}
			/> */}
				<shaderMaterial attach={"material"} {...pointMaterial} />
			</points>
			<mesh ref={sphereRef}>
				<sphereGeometry args={[0.7, 16, 16]} />
				{/* <bufferGeometry>
					<bufferAttribute
						attach={"attributes-position"} array={starPos}
					/>
				</bufferGeometry> */}
				<meshStandardMaterial color={"red"} wireframe />
			</mesh>
		</>
	);
};

// Grid for reference
const Ground = () => {
	const gridConfig = {
		cellSize: 0.5,
		cellThickness: 0.5,
		cellColor: "#6f6f6f",
		sectionSize: 3,
		sectionThickness: 1,
		sectionColor: "#9d4b4b",
		fadeDistance: 20,
		fadeStrength: 1,
		followCamera: false,
		infiniteGrid: true,
	};
	return (
		<Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
	);
};

// Main canvas
export const StarMap = () => {
	// Refs
	const cameraControlsRef = useRef<any>(null);

	// Raycasting for Point Selection
	const pointerPos = new THREE.Vector2();
	const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	// const raycaster = new THREE.Raycaster();
	// const camera = new THREE.PerspectiveCamera(0, 16 / 9, 0, 2000);
	// const { raycaster, camera } = useThree();

	function onMouseMoveEvent(e: React.MouseEvent<HTMLDivElement>): void {
		var bounds = e.currentTarget.getBoundingClientRect();

		pointerPos.x =
			((e.clientX - bounds.left) / (window.innerWidth - bounds.left)) *
				2 -
			1;
		pointerPos.y =
			(-(e.clientY - bounds.top) / (window.innerHeight - bounds.top)) *
				2 +
			1;

		// pointerPos.x =
		// 	((e.clientX - bounds.left) / (window.innerWidth - bounds.left)) *
		// 		2 -
		// 	1;
		// pointerPos.y =
		// 	(((e.clientY - bounds.top) / (window.innerHeight - bounds.top)) *
		// 		2 -
		// 		1) *
		// 	-1;
	}

	function Tween() {
		useFrame(() => {
			TWEEN.update();
		});
		return <></>;
	}

	// const [colourStates, setColourStates] = useState();

	const starsBuffer = useMemo(() => {
		const starVertices = [];
		const colours: number[] = [];
		const sizes: number[] = [];
		const colour = new THREE.Color();

		const mult = 3;
		for (var i = 0; i < Stars.length; i++) {
			const x = Stars[i].x;
			const y = Stars[i].y;
			const z = Stars[i].z;
			if (x != null && y != null && z != null) {
				starVertices.push(x * mult, y * mult, z * mult);
			}
			colour.setRGB(1, 1, 1);
			// colour.setHSL(0.01 + 0.1 * (i / Stars.length), 1.0, 0.5);
			colour.toArray(colours, i * 3);
			// const colour = new THREE.Color("#f0f");
			// colours.push(colour);
			sizes.push(2);
		}
		// const newStars = { ...Stars, byteLength: 8 };
		const bufferVertices = new THREE.BufferAttribute(
			new Float32Array(starVertices),
			3
		);
		const bufferColours = new THREE.BufferAttribute(
			new Float32Array(colours),
			3
		);
		const bufferSizes = new THREE.BufferAttribute(
			new Float32Array(sizes),
			1
		);
		return {
			positions: bufferVertices,
			colours: bufferColours,
			sizes: bufferSizes,
		};
		// return new THREE.BufferAttribute(new Float32Array(starVertices), 3);
	}, [Stars]);

	const starPointMaterials = new THREE.PointsMaterial({
		color: "white",
		size: 0.1,
		sizeAttenuation: true,
	});

	return (
		<Canvas
			onMouseMove={(e) => {
				onMouseMoveEvent(e);
			}}
		>
			<ambientLight intensity={0.4} />
			<color attach={"background"} args={["black"]} />
			<Ground />
			<Suspense fallback={null}>
				<StarPoints
					starsBuffer={starsBuffer}
					pointerPos={pointerPos}
					highlightIndex={highlightIndex}
					setHighlightIndex={setHighlightIndex}
					cameraControlsRef={cameraControlsRef}
				/>
			</Suspense>
			<OrbitControls
				ref={cameraControlsRef}
				makeDefault
				enablePan={true}
				enableZoom={true}
				enableRotate={true}
				position={[0, 0, 0]}
				minPolarAngle={0}
				maxPolarAngle={Math.PI / 1.75}
			/>
			<PerspectiveCamera />
			<Tween />
			{/* <Star position={[0, 0, 0]} />
			<Planet position={[5, 0, 0]} />
			<Planet position={[-5, 0, 0]} /> */}
		</Canvas>
	);
};
