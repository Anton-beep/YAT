import React, {useContext, useEffect, useState} from "react";
import {NavLink} from "react-router-dom";
import Auth from "../../pkg/auth";
import logo from '../../logo.svg';

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
        <header style={{display: 'flex', alignItems: 'center'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "10px", marginLeft: '10px'}}>
                <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                    <img src={logo} alt="Logo" style={{width: '50px', height: '50px'}}/>
                    <h1 style={{fontFamily: 'Lalezar', marginTop: "16px", marginLeft: "10px"}}>YAT</h1>
                </div>
            </div>
            <nav className="nav" style={{marginLeft: 'auto'}}>
                {navContent}
            </nav>
        </header>
    )
}

export default Header;
