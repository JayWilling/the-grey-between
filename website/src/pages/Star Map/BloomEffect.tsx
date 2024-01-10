import React from "react";
import * as THREE from "three";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
// import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { UnrealBloomPass, BloomPass } from "three-stdlib";
import { Node, extend } from "@react-three/fiber";
import { Effects } from "@react-three/drei";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";

extend({ UnrealBloomPass, OutputPass });

declare module "@react-three/fiber" {
	interface ThreeElements {
		unrealBloomPass: Node<UnrealBloomPass, typeof UnrealBloomPass>;
		outputPass: Node<OutputPass, typeof OutputPass>;
	}
}

export const TestBloom = () => {
	return (
		// <EffectComposer>
		// 	<unrealBloomPass
		// 		intensity={1.0} // The bloom intensity.
		// 		blurPass={undefined} // A blur pass.
		// 		kernelSize={KernelSize.SMALL} // blur kernel size
		// 		luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
		// 		luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
		// 		mipmapBlur={false} // Enables or disables mipmap blur.
		// 		resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
		// 		resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
		// 	/>
		// </EffectComposer>
		<Effects disableGamma>
			<unrealBloomPass threshold={1.0} strength={0.4} radius={0.0} />
			{/* @ts-ignore */}
			<outputPass args={[THREE.ACESFilmicToneMapping]} />
		</Effects>
	);
};
