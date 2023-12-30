import React from "react";
import "./Home.css";

interface ChecklistItemProps {
	item: string;
	checked: boolean;
}

const ChecklistItem = (props: ChecklistItemProps) => {
	return (
		<span className="checklistItem">
			<input type="checkbox" checked={props.checked} />
			<label>{props.item}</label>
		</span>
	);
};

export const Home = () => {
	return (
		<div className="homePage">
			<h1>Understanding Algorithms</h1>
			<p>
				This website is intended as a way to summarise Data Structures,
				algorithms, how they each affect one another.
			</p>
			<p>
				Each algorithm <i>will</i> provide a visual implementation where
				possible. Any pages made available with only a description are a
				work in progress and should be expected to have a functional
				implementation soon.
			</p>
			<p>
				If you have any recommendations, notice any mistakes or wish to
				add your own implementations feel free to reach out at
				jwilling123@gmail.com
			</p>
			<br />
			<h2>Note</h2>
			<p>
				If any of the core concepts do not make sense, or are{" "}
				<i>glossed over</i>, I highly recommend purchasing a copy of The
				Algorithm Design Manual by Steven S. Skiena. Any additional
				information related to the specific article under question will
				include relevant references.
			</p>
			<h1>The Algorithms</h1>
			<p>
				Each listing here may have sub-algorithms or problems which may
				be addressed in their own page or included within the parent
				topic/area
			</p>
			<div className="algorithmChecklist">
				<ChecklistItem checked={false} item="Voronoi Diagrams" />
				<ChecklistItem
					checked={false}
					item="Travelling Salesman Problem (TSP)"
				/>
				<ChecklistItem
					checked={false}
					item="Discrete Fourier Transform (DFT)"
				/>
				<ChecklistItem checked={false} item="String Matching" />
			</div>
		</div>
	);
};
