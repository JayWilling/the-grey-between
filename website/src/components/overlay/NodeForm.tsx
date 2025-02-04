import React, { useContext, useEffect, useMemo, useState } from "react";
import { Star } from "../../models/Star";
import { OverlayState } from "../../interfaces";
import { Collection, INode, Node } from "../../models/UniverseGraph";
import { starComparator } from "../../utils";
import { addNode } from "../../api/nodesApi";
import { IStarMapContext, StarMapContext } from "../../pages/StarMapContext";

interface INodeFormProps {}

export const NodeForm = (props: INodeFormProps) => {
	const { states, handlers } = useContext(StarMapContext) as IStarMapContext;

	const [nodeValues, setNodeValues] = useState<INode | null>(null);

	useEffect(() => {
		if (!states.currentStar) return;
		setNodeValues({
			data: states.currentStar,
			parentId: states.currentStar._id,
			name: states.currentStar.n,
			description: "",
			collection: Collection.Stars,
			adjacent: [],
			children: [],
		});
	}, [states.currentStar]);

	function handleNodeSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!states.currentStar || !nodeValues) return;
		const node: Node<Star> = new Node<Star>(
			nodeValues.data,
			nodeValues.parentId,
			nodeValues.name,
			nodeValues.description,
			Collection.Stars
			// nodeValues.comparator
		);
		addNode(node);
	}

	function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		handlers.updateOverlayState(e, OverlayState.StarMap);
	}

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		if (!nodeValues) return;
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
		setNodeValues({ ...nodeValues, [e.target.name]: e.target.value });
	}

	if (!states.currentStar) return <div>Loading</div>;

	const CreateNodeForm = () => {
		if (!states.currentStar) return <div>Loading</div>;
		return (
			<form onSubmit={(e) => handleNodeSubmit(e)}>
				<h1>{states.currentStar.n}</h1>
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
					<button type="button" onClick={(e) => handleCancel(e)}>
						Cancel
					</button>
				</div>
			</form>
		);
	};

	const NodeSummary = () => {
		if (!states.currentNode || !states.currentStar)
			return <div>CLASSIFIED</div>;
		return (
			<table>
				<tr>
					<td>Origin</td>
					<td>{states.currentNode.data.n}</td>
				</tr>
				<tr>
					<td>Name</td>
					<td>{states.currentNode.name}</td>
				</tr>
				<tr>
					<td>Description</td>
					<td>{states.currentNode.description}</td>
				</tr>
			</table>
		);
	};

	const FormController = () => {
		switch (states.overlayState) {
			case OverlayState.CreateNode:
				return <CreateNodeForm />;
			case OverlayState.ViewNode:
				return <NodeSummary />;
			default:
				return <></>;
		}
	};

	return (
		<div
			className="form"
			style={
				states.overlayState === OverlayState.CreateNode ||
				states.overlayState === OverlayState.ViewNode
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
				<FormController />
			</div>
		</div>
	);
};
