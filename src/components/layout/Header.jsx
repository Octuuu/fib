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

  return (
    <>
    
      <nav className="fixed top-0 left-0 w-full z-50 bg-black shadow-lg px-4 md:px-8 py-5 lg:py-4">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto">

          <Link 
            to="/" 
            className="flex items-center space-x-3"
            onClick={closeMenu}
          >
         
            <img 
              src={fibLogo} 
              alt="fib" 
              className="h-10 w-auto md:h-12"
            />
            
          </Link>

         
          <button
            onClick={toggleMenu}
            className="text-white p-2 rounded-lg hover:bg-black-700 transition-all duration-300"
          >
            {!menuOpen ? <Menu size={28} /> : <X size={28} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed top-0  left-0 h-full w-80 bg-black text-white shadow-2xl transform transition-transform duration-500 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
    
        <div className=" p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
    
  
          </div>
        </div>

        <div className="flex flex-col p-6 space-y-2">
          
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
                    ? " text-white shadow-md"
                    : "text-white-700 "
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


        {/* Footer del Menú */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="text-center text-gray-500 text-sm">
        
            <p className="text-xs mt-1">Federacion Ignaciana de Basquet</p>
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

    
      <div className="h-20" />
    </>
  );
}