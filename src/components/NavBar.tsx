import { FC } from "react";
import { Link } from "react-router-dom";

const NavBar: FC = () => {
  return (
    <div className="w-full h-14 fixed bg-gray-200 flex items-center z-20">
      <div className="rounded-full w-9 h-9 bg-gray-900 mx-6"></div>
      <ul className="flex items-center">
        <li className="bg-gray-100 font-bold py-2 px-4 rounded-lg m-2">
          <Link to="/">Home</Link>
        </li>
        <li className="bg-gray-100 font-bold py-2 px-4 rounded-lg m-2">
          <Link to="react_corp">react corp</Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
