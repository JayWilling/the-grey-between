import { useRef, useState } from "react";
import { Star } from "../../assets/data/Star";
import "./SearchableDropdown.css";

interface DropdownProps {
	options: Star[];
	label: string;
	id: string;
	selectedValue: Star;
	handleChange: (star: Star) => void;
}

export const SearchableDropdown = (props: DropdownProps) => {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const inputRef = useRef(null);

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

	function toggle(e: React.MouseEvent<HTMLInputElement>) {
		setIsOpen(e && e.target === inputRef.current);
	}

	function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		e.preventDefault();
		setQuery(e.target.value);
	}

	return (
		<div className="dropdown">
			<div className="control">
				<div className="selectedValue">
					<input
						ref={inputRef}
						onChange={(e) => {
							onInputChange(e);
						}}
						onClick={(e) => {
							toggle(e);
						}}
					/>
					<div className={`arrow ${isOpen ? "open" : ""}`}></div>
				</div>

				<div className={`options ${isOpen ? "open" : ""}`}>
					{filter(props.options).map((option, index) => {
						return (
							<div
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
	);
};
