import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Header.css";

function Header() {
  const location = useLocation();
  const { isLogged } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "首页" },
    { to: "/about", label: "关于我" },
    { to: "/projects", label: "项目作品" },
    { to: "/contact", label: "联系我" },
    ...(isLogged
      ? [{ to: "/admin", label: "管理" }]
      : [{ to: "/login", label: "登录" }]),
  ];

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          Portfolio
        </Link>
        <button
          className="nav-toggle"
          aria-label="菜单"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? "active" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
