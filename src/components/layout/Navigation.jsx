import React from "react";
import { Link } from "react-router-dom";

export default function Navigation({ currentPath }) {
  const navItems = [
    { path: "/", label: "Inicio", icon: "🏠" },
    { path: "/equipos", label: "Equipos", icon: "" },
    { path: "/calendario", label: "Calendario", icon: "" },
    { path: "/conocenos", label: "Conócenos", icon: "" },
    { path: "/escuela", label: "Escuela", icon: "🎓" },
  ];

  return (
    <nav className="flex space-x-2 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-300 ${
            currentPath === item.path
              ? "bg-white  font-semibold shadow-md"
              : "text-whit hover:shadow-sm"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="hidden lg:inline">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}