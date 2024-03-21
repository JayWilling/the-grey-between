import {
	DropdownProps,
	SearchableDropdown,
} from "../../SearchableDropdown/SearchableDropdown";
import "./SearchBar.css";

export const SearchBar = (props: DropdownProps) => {
	return (
		<div className="searchBar">
			<SearchableDropdown
				options={props.options}
				label={props.label}
				id={props.id}
				selectedValue={props.selectedValue}
				handleChange={props.handleChange}
			/>
		</div>
	);
};
