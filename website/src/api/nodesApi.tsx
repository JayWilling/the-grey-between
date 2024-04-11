// Graph API

import { Params } from "react-router-dom";
import { CelestialBody } from "../models/CelestialBody";
import { Star } from "../models/Star";
import { Node } from "../models/UniverseGraph";
import { BASE_URL } from "./starsApi";

export async function getNodeById(id: string) {
	const response = await fetch(BASE_URL + `nodes/${id}`);
	if (!response.ok || response.status != 200) {
		// const message = `An error has occurred retrieving node of ID ${id} : ${response.statusText}`;
		// console.log(message);
		// alert(message);
		return null;
	}
	const node = await response.json();
	console.log(node);
	if (!node) {
		console.warn(`Node with id ${id} not found.`);
		return null;
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
