import React, { FormEvent, useState } from "react";
import "./ContextMenu.css";
import { JsxElement } from "typescript";
// import { Context } from "../../algorithms/graphs/flashCardApp/FlashCardApplication";

export type Context = null | "3DBackground" | "topicNode";

interface ContextMenuProps {
	top: number;
	left: number;
	context: Context;
	setContextOptionSelected: React.Dispatch<React.SetStateAction<boolean>>;
	loadNewTopics: () => void;
	deleteTopic: (id: number) => void;
}

interface ContextMenuItemProps {
	handleOptionSelected: (option: string) => void;
	option: string;
	selectedOption: string;
	slideContents: () => JSX.Element;
}

interface AddTopicWindowProps {
	backNavigation: () => void;
	saveNewTopic: () => void;
}

interface TopicFormValues {
	topic: string;
	parent: string;
	cards: string[];
	subtopics: string[];
}

const AddTopic = (props: AddTopicWindowProps) => {
	const [formValues, setFormValues] = useState<TopicFormValues>({
		topic: "",
		parent: "",
		cards: [],
		subtopics: [],
	});

	function handleValueChanged(e: React.ChangeEvent<HTMLInputElement>) {
		console.log(e.target.value);
		setFormValues({ ...formValues, [e.target.name]: e.target.value });
	}

	async function handleCancel(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		props.backNavigation();
	}

	async function handleTopicSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (formValues.topic === "") {
			alert("Please provide a name for the new topic");
			return;
		}

		console.log("New topic submitted");
		await fetch("http://localhost:5000/topic/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formValues),
		})
			// .catch((error) => {
			// 	window.alert(error);
			// 	return;
			// })
			.then((response) => {
				console.log("New topic saved");
				props.saveNewTopic();
				console.log("New topic fetched");
				// May need to elevate this function to the parent FlashCardApplication
				// props.saveNewTopic();
			});
	}

	return (
		<div className="contextMenuAddTopic">
			<form onSubmit={(e) => handleTopicSubmit(e)}>
				<div className="inputField">
					<h3>Topic Name</h3>
					<input
						onChange={(e) => handleValueChanged(e)}
						name="topic"
					></input>
				</div>
				<div className="inputField">
					<h3>Parent Topic</h3>
					<input
						onChange={(e) => handleValueChanged(e)}
						name="parent"
					></input>
				</div>
				<div className="inputField">
					<h3>Add cards</h3>
					<input
						onChange={(e) => handleValueChanged(e)}
						name="cards"
					></input>
				</div>
				<div className="buttonField">
					<button type="submit">Save</button>
					<button type="reset" onClick={(e) => handleCancel(e)}>
						Cancel
					</button>
				</div>
			</form>
		</div>
	);
};

// Context menu item with slide reveal on select
const ContextMenuItem = (props: ContextMenuItemProps) => {
	var cssClass = "";
	if (props.selectedOption === props.option) {
		cssClass = "selected";
	} else if (props.selectedOption != "") {
		cssClass = "deselected";
	}

	return (
		<div
			className={"contextOption " + cssClass}
			onClick={
				cssClass === "selected"
					? () => {}
					: () => props.handleOptionSelected(props.option)
			}
		>
			<div className="titleContent">
				<div>{props.option}</div>
			</div>
			<div className="optionContent">{props.slideContents()}</div>
		</div>
	);
};

export const ContextMenu = (props: ContextMenuProps) => {
	const [showAddTopic, setShowAddTopic] = useState<boolean>(false);
	const [selectedOption, setSelectedOption] = useState<string>("");

	function handleOptionSelected(option: string) {
		console.log("option select: " + option);

		setSelectedOption(selectedOption === option ? "" : option);
		setShowAddTopic(!showAddTopic);
		props.setContextOptionSelected(!showAddTopic);
	}

	// This may need to be passed in as a prop from the parent FlashCardApplication
	async function submitNewTopic() {
		handleOptionSelected(""); // Close the add new topic window on submit
		props.loadNewTopics(); // Load new topics in primary graph
	}

	return (
		<div
			className="contextMenu"
			style={
				!showAddTopic
					? {
							top: props.top + "px",
							left: props.left + "px",
							transition: "all 0.6s ease-in-out",
					  }
					: {
							top: "10%",
							left: "10%",
							width: "80%",
							height: "80%",
							transition: "all 0.6s ease-in-out",
					  }
			}
		>
			<div className="contextMenuSlideContainer"></div>
			<div
				className={
					showAddTopic
						? "contextMenuOptions addTopicDisplay"
						: "contextMenuOptions"
				}
			>
				<ContextMenuItem
					option="Add topic"
					selectedOption={selectedOption}
					handleOptionSelected={handleOptionSelected}
					slideContents={() =>
						AddTopic({
							backNavigation: () => {
								handleOptionSelected("Add topic");
							},
							saveNewTopic: () => {
								submitNewTopic();
							},
						})
					}
				/>
				<ContextMenuItem
					option="Remove topic"
					selectedOption={selectedOption}
					// isSelected={
					// 	selectedOption === "Remove topic" ||
					// 	selectedOption === ""
					// }
					handleOptionSelected={handleOptionSelected}
					slideContents={() =>
						AddTopic({
							backNavigation: () => {
								handleOptionSelected("Remove topic");
							},
							saveNewTopic: () => {
								submitNewTopic();
							},
						})
					}
				/>
			</div>
		</div>
	);
};
