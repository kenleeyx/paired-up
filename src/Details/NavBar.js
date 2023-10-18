import { NavLink } from "react-router-dom";
import StateHelper from "../Components/Helpers/StateHelper";

// Navbar takes in nav, label and src -> please use either label or src to input the header image
const NavBar = ({ nav, label, src }) => {
  return (
    <header className="fixed top-0 z-10 flex w-screen flex-row items-center justify-between bg-background p-3 shadow-lg">
      {nav ? (
        <NavLink to={nav} className="text-[2em]">
          ←
        </NavLink>
      ) : (
        <NavLink to="/" className="text-[2em]">
          ←
        </NavLink>
      )}
      {label && <p className="text-[1.5em]">{label}</p>}
      {src && <img src={src} alt="Header" className="h-[4em] sm:h-[5em]" />}
      {/* <StateHelper /> */}
      <p className="text-transparent">123</p>
    </header>
  );
};

export default NavBar;
