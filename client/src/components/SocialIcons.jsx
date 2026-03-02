import React from "react";
import { Link } from "react-router-dom";
import { 
  InstagramLogo, 
  LinkedinLogo, 
  GithubLogo 
} from "phosphor-react";

const SocialIcons = () => {
  return (
    <div className="flex items-center gap-3 mt-5 ml-1 mb-2 max-md:mt-4">
      
      {/* Instagram */}
      <Link
        target="_blank"
        to="https://www.instagram.com/saifahmad976/"
        className="group transition transform hover:scale-110 text-[#bc2a8d] hover:text-pink-500"
      >
        <InstagramLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>

      {/* LinkedIn */}
      <Link
        target="_blank"
        to="https://www.linkedin.com/in/saif-ahmad-32b202241/"
        className="group transition transform hover:scale-110 text-[#0077b5] hover:text-blue-600"
      >
        <LinkedinLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>

      {/* GitHub */}
      <Link
        target="_blank"
        to="https://github.com/ahmadsaif12"
        className="group transition transform hover:scale-110 text-[#333] hover:text-gray-500"
      >
        <GithubLogo size={34} weight="fill" className="transition-colors duration-300" />
      </Link>

    </div>
  );
};

export default SocialIcons;