import React, { useEffect, useState } from "react";
import "./TreeMenu.css";

export interface TreeMenuProps {
	topMenuItems: string[];
	fullItemList: JsonData | undefined;
	handleItemSelect: (menuItem: ThreeDTopic) => void;
}

export interface JsonNode {
	objectId: string;
	id: number;
	topic: string;
	group: number;
	cards: string[];
	subtopics: string[];
}

interface JsonLink {
	source: string;
	target: string;
	value: number;
}

export interface JsonData {
	nodes: JsonNode[];
	links: JsonLink[];
}

export interface ThreeDTopic {
	topic: string;
	cards: string[];
	subtopics: string[];
}

interface TreeMenuItemProps extends TreeMenuProps {
	expandedDictionary: Map<string, string>;
	setExpandedDictionary: (menuItem: string) => void;
}

const TreeMenuItem = (props: TreeMenuItemProps) => {
	useEffect(() => {}, [props.expandedDictionary]);

	return (
		<div className="treeMenu">
			{props.topMenuItems.map((value, index) => {
				if (props.fullItemList === undefined) {
					return;
				}
				let subTopicNode = props.fullItemList.nodes.find(
					(node, index) => node.topic === value
				);

				if (subTopicNode != null) {
					return (
						<>
							<div key={value} className="item">
								<div
									className="expandBtn"
									onClick={() =>
										props.setExpandedDictionary(value)
									}
								>
									{props.expandedDictionary.has(value)
										? "-"
										: "+"}
								</div>
								<div
									className="text"
									onClick={() =>
										props.handleItemSelect(
											subTopicNode as ThreeDTopic
										)
									}
								>
									{subTopicNode.topic}
								</div>
							</div>
							{props.expandedDictionary.has(value) && (
								<TreeMenuItem
									key={value}
									topMenuItems={subTopicNode.subtopics}
									fullItemList={props.fullItemList}
									handleItemSelect={props.handleItemSelect}
									expandedDictionary={
										props.expandedDictionary
									}
									setExpandedDictionary={
										props.setExpandedDictionary
									}
								/>
							)}
						</>
					);
				}
			})}
		</div>
	);
};

export const TreeMenu = (props: TreeMenuProps) => {
	const [expandedDictionary, setExpandedDictionary] = useState<
		Map<string, string>
	>(new Map());

	const expandMenuItem = (menuItem: string) => {
		let newMap = new Map();
		expandedDictionary.forEach((k, v) => {
			newMap.set(k, v);
		});
		if (!expandedDictionary.has(menuItem)) {
			setExpandedDictionary(newMap.set(menuItem, menuItem));
		} else {
			newMap.delete(menuItem);
			setExpandedDictionary(newMap);
		}
		console.log(expandedDictionary);
	};

	return (
		<TreeMenuItem
			topMenuItems={props.topMenuItems}
			fullItemList={props.fullItemList}
			handleItemSelect={props.handleItemSelect}
			expandedDictionary={expandedDictionary}
			setExpandedDictionary={expandMenuItem}
		/>
	);
};

// {props.topMenuItems.map((value, index) => {
// 	let subTopicNode = props.fullItemList.nodes.find(
// 		(node, index) => node.id === value
// 	);

// 	if (subTopicNode != null) {
// 		return (
// 			<div
// 				key={index}
// 				className="item"
// 				onClick={() =>
// 					props.handleItemSelect(
// 						subTopicNode as ThreeDTopic
// 					)
// 				}
// 			>
// 				<div className="expandBtn">+</div>
// 				<div className="text">{subTopicNode.topic}</div>
// 			</div>
// 		);
// 	}
// })}
