import { ShaderMaterial, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// import bloomFragment from "../shaders/bloomFragment.glsl";
// import bloomVertex from "../shaders/bloomVertex.glsl";

class SelectiveBloom {
	public params: {
		exposure: number;
		bloomStrength: number;
		bloomThreshold: number;
		bloomRadius: number;
	};
	public renderScene: RenderPass;
	public bloomPass: UnrealBloomPass;
	public bloomComposer: EffectComposer;
	public finalPass: ShaderPass;
	public finalComposer: EffectComposer;

	constructor(
		scene: THREE.Scene,
		camera: THREE.Camera,
		renderer: WebGLRenderer
	) {
		this.params = {
			exposure: 1,
			bloomStrength: 3.5,
			bloomThreshold: 0,
			bloomRadius: 0,
		};

		this.renderScene = new RenderPass(scene, camera);

		this.bloomPass = new UnrealBloomPass(
			new Vector2(window.innerWidth, window.innerHeight),
			1.5,
			0.4,
			0.85
		);
		this.bloomPass.threshold = this.params.bloomThreshold;
		this.bloomPass.strength = this.params.bloomStrength;
		this.bloomPass.radius = this.params.bloomRadius;

		this.bloomComposer = new EffectComposer(renderer);
		this.bloomComposer.renderToScreen = false;
		this.bloomComposer.addPass(this.renderScene);
		this.bloomComposer.addPass(this.bloomPass);

		this.finalPass = new ShaderPass(
			new ShaderMaterial({
				uniforms: {
					baseTexture: { value: null },
					bloomTexture: {
						value: this.bloomComposer.renderTarget2.texture,
					},
				},
				// vertexShader: bloomVertex,
				// fragmentShader: bloomFragment,
				defines: {},
			}),
			"baseTexture"
		);
		this.finalPass.needsSwap = true;

		this.finalComposer = new EffectComposer(renderer);
		this.finalComposer.addPass(this.renderScene);
		this.finalComposer.addPass(this.finalPass);
	}
}

export { SelectiveBloom };
