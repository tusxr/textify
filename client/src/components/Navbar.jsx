// client/src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary-600">Textify</h1>
          <span className="hidden md:inline-block text-sm text-gray-500">Extract text from images</span>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#help" 
                className="text-gray-600 hover:text-primary-600 transition-colors"
              >
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;