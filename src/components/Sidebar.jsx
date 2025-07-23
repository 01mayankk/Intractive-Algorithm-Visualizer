import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const linkStyles = "block px-4 py-2 text-gray-200 hover:bg-indigo-700 rounded-md";
  const activeLinkStyles = "bg-indigo-700";

  return (
    <aside className="w-64 bg-indigo-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Algorithm Visualizer</h1>
      <nav>
        <NavLink to="/sorting" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
          Sorting
        </NavLink>
        <NavLink to="/searching" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
          Searching
        </NavLink>
        <NavLink to="/graph" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
          Graph Algorithms
        </NavLink>
        <NavLink to="/data-structures" className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}>
          Data Structures
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
