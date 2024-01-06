import React from "react";
// import * as THREE from "three";
// import { UnrealBloomPass } from "three-stdlib";
// import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
// import { extend } from "@react-three/fiber";
// import { Effects } from "@react-three/drei";

import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlurPass, Resizer, KernelSize, Resolution } from "postprocessing";

// extend({ UnrealBloomPass, OutputPass });

export const TestBloom = () => {
	return (
		<EffectComposer>
			<Bloom
				intensity={1.0} // The bloom intensity.
				blurPass={undefined} // A blur pass.
				kernelSize={KernelSize.SMALL} // blur kernel size
				luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
				luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
				mipmapBlur={false} // Enables or disables mipmap blur.
				resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
				resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
			/>
		</EffectComposer>
	);
};
