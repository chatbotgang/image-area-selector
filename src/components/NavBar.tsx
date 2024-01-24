import { FC } from "react";

const NavBar: FC = () => {
  return (
    <div className="w-full h-14 fixed bg-gray-200 flex justify-between items-center z-20">
      <div className="rounded-full w-9 h-9 bg-gray-900 mx-6"></div>
    </div>
  );
};

export default NavBar;
