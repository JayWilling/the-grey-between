import { Params } from "react-router-dom";
import { CelestialBody } from "../components/threeJs/Objects/CelestialBody";
import { Planet } from "../components/threeJs/Planet";
import { Node } from "../models/UniverseGraph";
import { CBProps } from "../interfaces";
import { Star } from "../models/Star";

export const BASE_URL = `http://localhost:5000/`;

// Stars API

export async function getStars() {
	const response = await fetch(BASE_URL + `star`);
	if (!response.ok) {
		const message = `An error occured: ${response.statusText}`;
		window.alert(message);
		return;
	}
	const stars: Star[] = await response.json();
	return stars;
}

export async function onUploadStarList(stars: Star[]) {
	await fetch(BASE_URL + "star/addList", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(stars),
	})
		.catch((error) => {
			window.alert(error);
			return;
		})
		.then((response) => {
			console.log(response);
			alert(response);
		});
}

// Graph API

export async function getNodeById(id: string) {
	const response = await fetch(BASE_URL + `nodes/${id}`);
	if (!response.ok) {
		// const message = `An error has occurred retrieving node of ID ${id} : ${response.statusText}`;
		// console.log(message);
		// alert(message);
		return null;
	}
	const node = await response.json();
	if (!node) {
		console.warn(`Node with id ${id} not found.`);
		return;
	}
	return node;
}

export async function addNode(node: Node<Star>) {
	// const newNode = { ...node };
	await fetch(BASE_URL + "nodes/add", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(node),
	})
		.catch((error) => {
			window.alert(error);
			return;
		})
		.then((response) => {
			console.log(response);
		});
}

export async function editNode(node: Node<Star>) {}

export async function onEditCelestialBody(
	editedPlanet: CelestialBody,
	params: Readonly<Params<string>>
) {
	await fetch(BASE_URL + `update/${params.id}`, {
		method: "POST",
		body: JSON.stringify(editedPlanet),
		headers: {
			"Content-Type": "application/json",
		},
	});
}
