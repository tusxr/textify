// client/src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src="https://res.cloudinary.com/dnyjk9fjo/image/upload/v1745242765/logo_uyhl44.png" alt="Logo" className="w-28" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
