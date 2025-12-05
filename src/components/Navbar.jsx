import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/fib.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-md px-10 py-4 flex items-center">
        <div className="flex items-center w-full">
          <div className="flex items-center space-x-3 w-full">
            <button
              onClick={toggleMenu}
              className="text-white transition-transform duration-500 ease-in-out"
            >
              {!menuOpen ? <Menu size={28} /> : <X size={28} />}
            </button>

            <img
              src={logo}
              alt="Logo"
              className={`h-14 transition-all duration-500 ease-in-out ${
                menuOpen ? "ml-4" : "mx-auto"
              }`}
            />
          </div>

          <div className="hidden md:flex space-x-6 ml-auto">
            <Link
              to="/conocenos"
              className="text-white hover:text-gray-300 font-medium transition-colors duration-300"
            >
              Conocenos
            </Link>
            <Link
              to="/contacto"
              className="text-white hover:text-gray-300 font-medium transition-colors duration-300"
            >
              Contacto
            </Link>
          </div>
        </div>
      </nav>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start mt-20 ml-4 space-y-4">
          <Link
            to="/servicios"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Servicios
          </Link>
          <Link
            to="/blog"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Blog
          </Link>
          <Link
            to="/politicas"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Políticas
          </Link>
          <Link
            to="/ayuda"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Ayuda
          </Link>
          <Link
            to="/faq"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            FAQ
          </Link>
          <Link
            to="/contacto-rapido"
            onClick={toggleMenu}
            className="text-gray-700 hover:text-gray-900 transition-colors duration-300"
          >
            Contacto Rápido
          </Link>
        </div>
      </div>
    </>
  );
}
