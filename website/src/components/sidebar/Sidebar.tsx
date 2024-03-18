import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export const Sidebar = (props: {
	setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
}) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const sidebarItemClassName = (isActive: boolean) => {
		return isActive ? "sidebar-item active" : "sidebar-item inactive";
	};

	function itemClickHandler(newColor: string) {
		props.setBackgroundColor(newColor);
		setIsExpanded(false);
	}

	return (
		<div className="sidebar">
			<div
				className={
					isExpanded ? "sidebar-btn upper" : "sidebar-btn lower"
				}
				onClick={() => setIsExpanded(!isExpanded)}
			></div>
			<div
				className={
					isExpanded
						? "sidebar-container expanded"
						: "sidebar-container collapsed"
				}
			>
				<div className="sidebar-content">
					<NavLink
						className={({ isActive }) =>
							sidebarItemClassName(isActive)
						}
						to="/"
						onClick={() => itemClickHandler("white")}
					>
						Home
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							sidebarItemClassName(isActive)
						}
						to="/starmap"
						onClick={() => itemClickHandler("black")}
					>
						Star Map
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							sidebarItemClassName(isActive)
						}
						to="/pointsofinterest"
						onClick={() => itemClickHandler("white")}
					>
						Points of Interest
					</NavLink>
				</div>
			</div>
		</div>
	);
};
