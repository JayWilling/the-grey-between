import React, { useMemo, useRef, useContext } from "react";
import "./../../assets/styling/StarMap.css";

import * as THREE from "three";
import { useFrame, useThree, useLoader, ThreeEvent } from "@react-three/fiber";
import Stars from "../../assets/data/bsc5p_3d.json";
import { Selection } from "@react-three/postprocessing";
import { Circle, Text } from "@react-three/drei";
import { StarsBufferAttributes } from "../../pages/StarMap";
import { TestBloom } from "../../effects/BloomEffect";
// import vertexShaderText from "./shaders/bloomVertexShader.vs.glsl";
// import fragmentShaderText from "./shaders/bloomFragmentShader.fs.glsl";
import {
	LensFlareEffect,
	LensFlareParams,
} from "../../assets/shaders/lensFlareTemp.js";
import { objectToScreenPosition, vectorToScreenPosition } from "../../utils";
import { StarMapContext, IStarMapContext } from "../../pages/StarMapContext";

interface StarPointProps {
	starsBuffer: StarsBufferAttributes;
	highlightIndex: number | null;
	setHighlightIndex: React.Dispatch<React.SetStateAction<number | null>>;
	selectedIndex: number | null;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number | null>>;
	onClickEvent: (e: ThreeEvent<MouseEvent>) => void;
	pointsRef: React.RefObject<THREE.Points>;
}

export const StarPoints = (props: StarPointProps) => {
	const { gl, scene, raycaster, camera } = useThree();

	const { states } = useContext(StarMapContext) as IStarMapContext;

	// Define Point Materials
	const vertexShaderText = `
	attribute float size;
	attribute vec3 customColor;

	varying vec3 vColor;
	varying vec2 vUv;

	void main() {

	    vColor = customColor;

	    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

	    gl_PointSize = 0.2 + size * (300.0 / -mvPosition.z);

	    gl_Position = projectionMatrix * mvPosition;

	    vUv = uv;

	}`;

	const fragmentShaderText = `
	uniform vec3 color;
	uniform sampler2D pointTexture;
	uniform sampler2D bloomTexture;
	uniform sampler2D baseTexture;
	uniform float alphaTest;

	varying vec3 vColor;
	varying vec2 vUv;

	void main() {

	    gl_FragColor = vec4( color * vColor * 2.0, 1.0 );

	    gl_FragColor = gl_FragColor * ( texture2D( pointTexture, gl_PointCoord ) + vec4(0.3));

	    if ( gl_FragColor.a < alphaTest ) discard;

	}`;
	const discTexture = useLoader(THREE.TextureLoader, "bigDisc.png");

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

	// Highlight Sphere
	const sphereRef = useRef<THREE.Mesh>(null);
	const selectedStarLabelRef = useRef<THREE.Mesh>(null);
	const circleRef = useRef<THREE.Mesh>(null);
	let starName = "Sol";

	// Lens Flare
	const oldOpacity = { value: 0.8 };
	const colorProp = { colorGain: { value: "#063684" } };

	const lensFlareEffectMaterial = useMemo(() => {
		return LensFlareEffect(
			{
				enabled: true,
				lensPosition: new THREE.Vector3(25, 2, -40),
				opacity: 0.8,
				colorGain: new THREE.Color(colorProp.colorGain.value),
				starPoints: 3,
				glareSize: 0.2,
				flareSize: 0.004,
				flareSpeed: 0.4,
				flareShape: 1.2,
				haloScale: 0.5,
				animated: false,
				anamorphic: true,
				secondaryGhosts: false,
				starBurst: false,
				ghostScale: 0.23,
				aditionalStreaks: false,
				followMouse: false,
			},
			oldOpacity
		);
	}, []);

	// Perform per-frame actions
	useFrame((state, delta, xrFrame) => {
		// Handle stars mouseover
		const points = props.pointsRef.current;
		const highlightSphere = sphereRef.current;
		const highlightCircle = circleRef.current;
		let tempHighlightIndex = props.highlightIndex;

		if (points === null || highlightSphere === null) {
			return;
		}

		// Points geometry
		const geometry = points.geometry;
		const attributes = geometry.attributes;

		// Sphere geometry
		// highlightSphere.position;

		raycaster.setFromCamera(states.pointerPos, camera);
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
				// highlightCircle.position.set(x, y, z);

				// Move camera
				// camera.lookAt(x, y, z);
			}
		} else if (tempHighlightIndex !== null) {
			attributes.size.array[tempHighlightIndex] = 2;
			attributes.size.needsUpdate = true;
			tempHighlightIndex = null;
		}

		// Update highlight position
		// if (props.highlightIndex != null) {
		// 	const x = attributes.position.array[props.highlightIndex * 3];
		// 	const y = attributes.position.array[props.highlightIndex * 3 + 1];
		// 	const z = attributes.position.array[props.highlightIndex * 3 + 2];
		// 	const tempVector = new THREE.Vector3(x, y, z);
		// 	const screenPosition = vectorToScreenPosition(
		// 		tempVector,
		// 		camera,
		// 		gl
		// 	);
		// 	props.setHighlightPosition(screenPosition);
		// }

		props.setHighlightIndex(tempHighlightIndex);
	});

	if (Stars == null) {
		return <></>;
	}
	return (
		<Selection enabled>
			<points
				ref={props.pointsRef}
				onClick={(e) => {
					props.onClickEvent(e);
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
					<bufferAttribute
						attach={"attributes-starIndex"}
						{...props.starsBuffer.index}
					/>
					{/* <bufferAttribute attach={"attrbiutes-material"} /> */}
				</bufferGeometry>
				{/* <pointsMaterial
					size={0.5}
					color={0xff00ff}
					sizeAttenuation={true}
				/> */}
				<shaderMaterial attach={"material"} {...pointMaterial} />
			</points>
			{/* <Html
				as="span"
				style={{
					fontSize: "1.5em",
				}}
				transform
				occlude="blending"
				castShadow
				receiveShadow
				wrapperClass="starLabel"
			>
				Some star
				<h1
					style={{
						margin: 0,
						background: "red",
						borderRadius: "20px",
						color: "black",
					}}
				>
					Some star
				</h1>
			</Html> */}
			<Text anchorX={"left"} anchorY={"top"} ref={selectedStarLabelRef}>
				{starName}
			</Text>
			{/* <lineSegments>
				<bufferGeometry>
					<bufferAttribute
						attach={"attributes-position"}
						{...linesBuffer.positions}
					/>
					<bufferAttribute
						attach={"attributes-color"}
						{...linesBuffer.colours}
					/>
				</bufferGeometry>
				<lineBasicMaterial
					// attach={"material"}
					// {...lineMaterial}
					vertexColors={true}
					blending={THREE.AdditiveBlending}
					transparent={true}
				/>
			</lineSegments> */}
			<mesh ref={sphereRef}>
				<sphereGeometry
					args={[0.7, 16, 16]}
					// attach={"material"}
					// {...lensFlareEffectMaterial}
				/>
				<meshStandardMaterial
					color={"red"}
					wireframe
					emissive={"red"}
					emissiveIntensity={4}
					toneMapped={false}
				/>
			</mesh>
			<TestBloom />
			{/* <Circle ref={circleRef} /> */}
		</Selection>
	);
};
