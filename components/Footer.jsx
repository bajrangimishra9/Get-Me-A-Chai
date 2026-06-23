import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white text-center px-5 py-5 shrink-0">
      <p>
        Copyright &copy; {year} Get me a Chai - All rights reserved!
      </p>
    </footer>
  );
};

export default Footer;