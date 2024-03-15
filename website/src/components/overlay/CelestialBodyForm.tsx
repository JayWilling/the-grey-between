import { useState } from "react";
import { CBProps, OverlayState } from "../../interfaces";
import "./../../assets/styling/Form.css";
import { CanvasOverlayProps } from "./HUDOverlay";

export const CelestialBodyForm = (props: CanvasOverlayProps) => {
	const [celestialBodyValues, setCelestialBodyValues] = useState<CBProps>({
		name: "",
		description: "",
		starParent: props.selectedStar,
		radius: 5,
		orbitRadius: 5,
		orbitVelocity: 5,
		colour: "red",
	});

	function handleCelestialBodySubmit(e: React.FormEvent<HTMLFormElement>) {
		const data: CBProps = {
			name: "",
			description: "",
			starParent: props.currentStar,
			radius: 5,
			orbitRadius: 5,
			orbitVelocity: 5,
			colour: "green",
		};
		// const newNode = new Node<CBProps>(data);
		// onNewNode()
	}

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {}

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		props.updateOverlayState(e, OverlayState.SolarSystem);
	}

	return (
		<div
			className="form"
			style={
				props.overlayState === OverlayState.CreateCB
					? {
							top: "10%",
							left: "10%",
							width: "80%",
							height: "80%",
							padding: "20px",
					  }
					: {
							top: "50%",
							left: "50%",
							width: "0px",
							height: "0px",
							padding: "0px",
					  }
			}
		>
			<div className="contextMenuAddTopic">
				{props.overlayState === OverlayState.CreateCB ? (
					<form onSubmit={(e) => handleCelestialBodySubmit(e)}>
						<div className="inputField">
							<h3>Celestial Body Name</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="name"
							></input>
						</div>
						<div className="inputField">
							<h3>Type</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="parent"
							></input>
						</div>
						<div className="inputField">
							<h3>Description</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="cards"
							></input>
						</div>
						<div className="buttonField">
							<button type="submit">Save</button>
							<button
								type="button"
								onClick={(e) => handleCancel(e)}
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};
