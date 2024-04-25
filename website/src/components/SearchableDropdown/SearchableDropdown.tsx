import { useEffect, useRef, useState } from "react";
import { Star } from "../../models/Star";
import "./SearchableDropdown.css";

export interface DropdownProps {
	options: Star[];
	label: string;
	id: string;
	selectedValue: Star | null;
	handleChange: (star: Star) => void;
}

export const SearchableDropdown = (props: DropdownProps) => {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const selectOption = (option: Star) => {
		setQuery("");
		props.handleChange(option);
		setIsOpen(false);
	};

	const filter = (options: Star[]) => {
		return options.filter((option) => {
			return option["n"].toLowerCase().indexOf(query.toLowerCase()) > -1;
		});
	};

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		setQuery(e.target.value);
	}

	return (
		<div className="dropdown">
			<div className="control">
				<div className="selectedValue">
					<input
						className={`${isOpen ? "open" : ""}`}
						ref={inputRef}
						value={query}
						onChange={(e) => {
							onInputChange(e);
						}}
						placeholder="Search..."
						onFocus={() => {
							setIsOpen(true);
						}}
						onBlur={() => {
							setIsOpen(false);
						}}
					/>
					<div className={`arrow ${isOpen ? "open" : ""}`}></div>
				</div>
				<div className="optionsContainer">
					<div className="optionsCover"></div>
					<div className={`options ${isOpen ? "open" : ""}`}>
						{filter(props.options).map((option, index) => {
							return (
								<div
									key={option._id}
									onClick={() => {
										selectOption(option);
									}}
								>
									{option["n"]}
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};
