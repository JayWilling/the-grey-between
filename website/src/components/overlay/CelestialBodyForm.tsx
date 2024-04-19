import { useState } from "react";
import { CBProps, OverlayState } from "../../interfaces";
import "./../../assets/styling/Form.css";
import { CanvasOverlayProps } from "./HUDOverlay";

export const CelestialBodyForm = (props: CanvasOverlayProps) => {
	const [celestialBodyValues, setCelestialBodyValues] =
		useState<CBProps | null>(props.celestialBodyData);

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

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
		if (!props.celestialBodyData) return;
		props.setCelestialBodyData({
			...props.celestialBodyData,
			[e.target.name]: e.target.value,
		});
	}

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		props.updateOverlayState(e, OverlayState.SolarSystem);
	}

	if (!props.celestialBodyData) return <>Loading</>;

	return (
		<div
			className="form"
			style={
				props.overlayState === OverlayState.CreateCB
					? {
							top: "5%",
							left: "50%",
							width: "45%",
							height: "90%",
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
			{/* <div className="contextMenuAddTopic"> */}
			{props.overlayState === OverlayState.CreateCB ? (
				<form
					className="outerContents"
					onSubmit={(e) => handleCelestialBodySubmit(e)}
				>
					<div className="formHeading fixedContents">
						<input
							onChange={(e) => handleValueChanged(e)}
							name="name"
							value={props.celestialBodyData.name}
						></input>
					</div>
					<div className="formContents innerContents">
						<div className="inputField">
							<h3>Description</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="description"
								value={props.celestialBodyData.description}
							></input>
						</div>
						<div className="inputField">
							<h3>Star Parent</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="starParent"
								value={
									props.celestialBodyData.starParent
										? props.celestialBodyData.starParent.n
										: ""
								}
							></input>
						</div>
						<div className="inputField">
							<h3>Radius</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="radius"
								value={props.celestialBodyData.radius}
							></input>
						</div>
						<div className="inputField">
							<h3>Orbit Radius</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="orbitRadius"
								value={props.celestialBodyData.orbitRadius}
							></input>
						</div>
						<div className="inputField">
							<h3>Orbit Velocity</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="orbitVelocity"
								value={props.celestialBodyData.orbitVelocity}
							></input>
						</div>
						<div className="inputField">
							<h3>Colour</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="colour"
								value={props.celestialBodyData.colour}
							></input>
						</div>
					</div>
					<div className="formFooter fixedContents">
						<button type="submit">Save</button>
						<button type="button" onClick={(e) => handleCancel(e)}>
							Cancel
						</button>
					</div>
				</form>
			) : (
				// <div className="outerContents">
				// 	<div className="fixedContents">
				// 		<button onClick={(e) => handleCancel(e)}>Close</button>
				// 	</div>
				// 	<div className="innerContents">
				// 		<div className="overflowContents"></div>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 		Content<br></br>
				// 	</div>
				// 	<div className="fixedContents">Fixed</div>
				// </div>
				<></>
			)}
			{/* </div> */}
		</div>
	);
};
