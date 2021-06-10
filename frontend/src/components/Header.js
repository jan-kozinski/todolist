import React from "react";

const Header = () => {
  return (
    <header
      data-testid="header"
      className="bg-red-500 mx-auto w-auto py-4  shadow-bot"
    >
      <h1 className="mx-auto w-6/12 text-white text-4xl">TODOS</h1>
    </header>
  );
};

export default Header;
