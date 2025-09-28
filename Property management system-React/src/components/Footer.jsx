import React from 'react';

export default function Footer() {
  return (
    <footer className="text-white text-center py-3 mt-5 fixed-bottom" style={{ backgroundColor: '#1c3c6e' }}>

      <div className="container">
        <span className="text-dark-50">
          © {new Date().getFullYear()} Property management system. All rights reserved.
        </span>
      </div>
    </footer>
  );
}