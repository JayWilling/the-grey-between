import { useContext, useState } from "react";
import { CBProps, OverlayState } from "../../interfaces";
import "./../../assets/styling/Form.css";
import { CanvasOverlayProps } from "./HUDOverlay";
import { IStarMapContext, StarMapContext } from "../../pages/StarMapContext";

export const CelestialBodyForm = (props: CanvasOverlayProps) => {
	const { states, handlers, formValues } = useContext(
		StarMapContext
	) as IStarMapContext;

	function handleCelestialBodySubmit(e: React.FormEvent<HTMLFormElement>) {
		const data: CBProps = {
			name: "",
			description: "",
			starParent: states.currentStar,
			radius: 5,
			orbitRadius: 5,
			orbitVelocity: 5,
			colour: "green",
		};
		// const newNode = new Node<CBProps>(data);
		// onNewNode()
	}

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
		if (!formValues.celestialBodyData) return;
		formValues.setCelestialBodyData({
			...formValues.celestialBodyData,
			[e.target.name]: e.target.value,
		});
	}

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		handlers.updateOverlayState(e, OverlayState.SolarSystem);
	}

	if (!formValues.celestialBodyData) return <>Loading</>;

	return (
		<div
			className="form"
			style={
				states.overlayState === OverlayState.CreateCB
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
			{states.overlayState === OverlayState.CreateCB ? (
				<form
					className="outerContents"
					onSubmit={(e) => handleCelestialBodySubmit(e)}
				>
					<div className="formHeading fixedContents">
						<input
							onChange={(e) => handleValueChanged(e)}
							name="name"
							value={formValues.celestialBodyData.name}
						></input>
					</div>
					<div className="formContents innerContents">
						<div className="inputField">
							<h3>Description</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="description"
								value={formValues.celestialBodyData.description}
							></input>
						</div>
						<div className="inputField">
							<h3>Star Parent</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="starParent"
								value={
									formValues.celestialBodyData.starParent
										? formValues.celestialBodyData
												.starParent.n
										: ""
								}
							></input>
						</div>
						<div className="inputField">
							<h3>Radius</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="radius"
								value={formValues.celestialBodyData.radius}
							></input>
						</div>
						<div className="inputField">
							<h3>Orbit Radius</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="orbitRadius"
								value={formValues.celestialBodyData.orbitRadius}
							></input>
						</div>
						<div className="inputField">
							<h3>Orbit Velocity</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="orbitVelocity"
								value={
									formValues.celestialBodyData.orbitVelocity
								}
							></input>
						</div>
						<div className="inputField">
							<h3>Colour</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="colour"
								value={formValues.celestialBodyData.colour}
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
