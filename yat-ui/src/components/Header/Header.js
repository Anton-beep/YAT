import React, {useContext, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Auth from "../../pkg/auth";

const Header = () => {
    const [user, setUser] = useState("");

    useEffect(() => {
        Auth.axiosInstance.get('/api/v1/users/user/')
            .then(response => {
                setUser(response.data.email);
            })
            .catch(() => {
            });
    }, [user]);

    let navContent;
    if (user !== "") {
        navContent = (
            <>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/dashboard">Панель управления</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/statistics">Статистика</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/logout">Выйти</NavLink>
            </>
        );
    } else {
        navContent = (
            <>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/">Главная страница</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active" to="/login">Войти</NavLink>
                <NavLink className="nav-link" activeclassname="nav-link active"
                         to="/register">Зарегестрироваться</NavLink>
            </>
        );
    }
    return (
        <header>
            <h3>YAT</h3>
            <nav className="nav">
                {navContent}
            </nav>
        </header>
    )
}

export default Header;
