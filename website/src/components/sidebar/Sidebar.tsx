import React, { useState } from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const sidebarItemClassName = (isActive: boolean) => {
		return isActive ? "sidebar-item active" : "sidebar-item inactive";
	};

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
						to="/the-grey-between"
					>
						Home
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							sidebarItemClassName(isActive)
						}
						to="/the-grey-between/starmap"
					>
						Star Map
					</NavLink>
				</div>
			</div>
		</div>
	);
};
