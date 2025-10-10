import React from "react";
import { NavUser } from "../nav-user";
import { ModeToggle } from './../mode-toggle';
import {  useSelector } from "react-redux";
import { RootState } from "@/store/store"; 

const Navbar: React.FC = () => {
  const { username } = useSelector((state: RootState) => state.user);
  return (
    <header className="sticky top-0 z-50  dark:bg-gray-950  flex items-center justify-between px-4 py-2 bg-white shadow">
      <div className="flex items-center ml-8">
      </div>
      <div className="flex items-center space-x-4">
        {/* <NotificationDropDown/> */}

        <ModeToggle/>
        <NavUser user={{username: username, avatar: 'TP'}} />
      </div>
    </header>
  );
};

export default Navbar;
