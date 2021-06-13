import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import React from "react";

const defaultLinkStyling = "button w-min mx-2";

const Footer = () => {
  return (
    <footer
      data-testid="footer"
      className="bg-purple-700 mx-auto w-auto pb-4 shadow-bot flex justify-center"
    >
      <span className="text-2xl self-center pt-2 mx-2">
        website made by Jan Koziński
      </span>

      <div className={defaultLinkStyling + " bg-black hover:bg-gray-900"}>
        <a href="http://www.github.com/jan-kozinski" target="blank">
          <FontAwesomeIcon className="text-purple-700" icon={faGithub} />
        </a>
      </div>
      <div className={defaultLinkStyling + " bg-blue-500 hover:bg-blue-700"}>
        <a href="http://www.linkedin.com/in/jan-kozinski" target="blank">
          <FontAwesomeIcon className="text-purple-700" icon={faLinkedinIn} />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
