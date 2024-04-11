import React, { useEffect, useMemo, useState } from "react";
import { Star } from "../../models/Star";
import { CBType, OverlayState } from "../../interfaces";
import { CanvasOverlayProps } from "./HUDOverlay";
import { Collection, INode, Node } from "../../models/UniverseGraph";
import { starComparator } from "../../utils";
import { addNode } from "../../api/nodesApi";

export const NodeForm = (props: CanvasOverlayProps) => {
	const [nodeValues, setNodeValues] = useState<INode>({
		// @ts-ignore
		data: props.currentStar,
		// @ts-ignore
		parentId: props.currentStar?._id,
		// @ts-ignore
		name: props.currentStar?.N,
		description: "",
		collection: Collection.Stars,
		adjacent: [],
		children: [],
		comparator: starComparator,
	});

	useEffect(() => {
		if (!props.currentStar) return;
		setNodeValues({
			// @ts-ignore
			data: props.currentStar,
			// @ts-ignore
			parentId: props.currentStar?._id,
			// @ts-ignore
			name: props.currentStar?.N,
			description: "",
			type: CBType.Star,
			adjacent: [],
			children: [],
			comparator: starComparator,
		});
	}, [props.currentStar]);

	function handleNodeSubmit(e: React.FormEvent<HTMLFormElement>) {
		if (!props.currentStar) return;
		// const node: Node<Star> = new Node<Star>(
		// 	props.currentStar,
		// 	props.currentStar._id,
		// 	"",
		// 	"",
		// 	CBType.Star,
		// 	starComparator
		// );
		e.preventDefault();
		const node: Node<Star> = new Node<Star>(
			nodeValues.data,
			nodeValues.parentId,
			nodeValues.name,
			nodeValues.description,
			nodeValues.collection
			// nodeValues.comparator
		);
		addNode(node);
	}

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		props.updateOverlayState(e, OverlayState.StarMap);
	}

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		// let value: string | CBType = e.target.value;
		// if (e.target.name === "type") {
		// 	switch (e.target.value) {
		// 		case "Star":
		// 			value = CBType.Star;
		// 			break;
		// 		case "Planet":
		// 			value = CBType.Planet;
		// 			break;
		// 		default:
		// 			value = CBType.Star;
		// 			break;
		// 	}
		// }
		// console.log(value);
		setNodeValues({ ...nodeValues, [e.target.name]: e.target.value });
	}

	if (!props.currentStar) return <div>Loading</div>;
	return (
		<div
			className="form"
			style={
				props.overlayState === OverlayState.CreateNode
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
				{props.overlayState === OverlayState.CreateNode ? (
					<form onSubmit={(e) => handleNodeSubmit(e)}>
						<h1>{props.currentStar.n}</h1>
						<div className="inputField">
							<h3>System Name</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="name"
							></input>
						</div>
						<div className="inputField">
							<h3>Type</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="collection"
							></input>
						</div>
						<div className="inputField">
							<h3>Description</h3>
							<input
								onChange={(e) => handleValueChanged(e)}
								name="description"
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
