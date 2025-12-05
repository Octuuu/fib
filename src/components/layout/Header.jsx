import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, Calendar, Info, GraduationCap, Phone } from "lucide-react";
import fibLogo from '../../assets/fib.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const navItems = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/equipos", label: "Equipos", icon: Users },
    { path: "/calendario", label: "Calendario", icon: Calendar },
    { path: "/conocenos", label: "Conócenos", icon: Info },
    { path: "/escuela", label: "Escuela", icon: GraduationCap },
  ];

  const additionalItems = [
    { path: "/contacto", label: "Contacto", icon: Phone },
  ];

  return (
    <>
      {/* Navbar Principal */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-lg px-4 md:px-8 py-5 lg:py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            onClick={closeMenu}
          >
            {/* Logo FIB - Asegúrate de que fib.png esté en la carpeta public o en src/assets */}
            <img 
              src={fibLogo} 
              alt="fib" 
              className="h-10 w-auto md:h-12"
            />
            
          </Link>

          {/* Botón Menú - Siempre visible */}
          <button
            onClick={toggleMenu}
            className="text-white p-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            {!menuOpen ? <Menu size={28} /> : <X size={28} />}
          </button>
        </div>
      </nav>

      {/* Menú Desplegable - Siempre activo */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-500 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del Menú */}
        <div className="bg-primary p-6 text-white">
          <div className="flex items-center space-x-3 mb-2">
            {/* Logo también en el menú desplegable */}
            <img 
              src="/fib.png" 
              alt="Liga Basket Pro Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h2 className="text-xl font-bold">Liga Basket Pro</h2>
              <p className="text-blue-200 text-sm">Menú de Navegación</p>
            </div>
          </div>
        </div>

        {/* Navegación Principal */}
        <div className="flex flex-col p-6 space-y-2">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Navegación Principal
          </h3>
          
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Navegación Secundaria */}
        <div className="flex flex-col p-6 space-y-2 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Enlaces Adicionales
          </h3>
          
          {additionalItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                }`}
              >
                <IconComponent size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}

          {/* Enlaces estáticos */}
          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-300">
            <span>📞</span>
            <span className="font-medium">+34 912 345 678</span>
          </button>
          
          <button className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-primary transition-all duration-300">
            <span>📧</span>
            <span className="font-medium">info@ligabasket.com</span>
          </button>
        </div>

        {/* Footer del Menú */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2024 Liga Basket Pro</p>
            <p className="text-xs mt-1">Todos los derechos reservados</p>
          </div>
        </div>
      </div>

      {/* Overlay para cerrar menú */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={closeMenu}
        />
      )}

      {/* Espacio para el header fixed */}
      <div className="h-20" />
    </>
  );
}