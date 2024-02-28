import { Params } from "react-router-dom";
import { CelestialBody } from "../components/threeJs/Objects/CelestialBody";
import { Planet } from "../components/threeJs/Planet";

export const BASE_URL = `http://localhost:5000/`;

export async function getStars() {
	const response = await fetch(BASE_URL + `star/`);
	if (!response.ok) {
		const message = `An error occured: ${response.statusText}`;
		window.alert(message);
		return;
	}
	const stars = await response.json();
	return stars;
}

export async function onNewCelestialBody(planet: CelestialBody) {
	const newPlanet = { ...planet };
	await fetch(BASE_URL + "celestialbody/add", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(newPlanet),
	}).catch((error) => {
		window.alert(error);
		return;
	});
}

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
