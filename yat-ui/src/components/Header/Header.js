import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header>
            <h3>YAT</h3>
            <nav className="nav">
                <NavLink className="nav-link" activeclassname="nav-link active" to="/">Главная страница</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/login">Войти</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/register">Зарегестрироваться</NavLink>
            </nav>
        </header>
    )
}

export default Header;
