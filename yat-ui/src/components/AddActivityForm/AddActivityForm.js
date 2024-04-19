import React, { useState } from 'react';
import Auth from "../../pkg/auth";
import {ReactComponent as Bib} from '../../icons/bib.svg';
import {ReactComponent as Bob} from '../../icons/bob.svg';

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};

const AddActivityForm = () => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(Object.keys(iconComponents)[0]);
    const [color, setColor] = useState('#000000');

    const handleSubmit = (event) => {
        event.preventDefault();

        Auth.axiosInstance.post('api/v1/homepage/activities', {
            name: name,
            icon_name: icon,
            icon_color  : color
        }).then(() => {
            setName('');
            setIcon(Object.keys(iconComponents)[0]);
            setColor('#000000');
            window.location.reload();
        }).catch((error) => {
            console.error(error);
        });
    };

    const SelectedIcon = iconComponents[icon];

return (
    <div>
        <h2 className="mt-3">Добавить активность</h2>
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Название:</label>
                <input type="text" className="form-control" id="name" value={name}
                       onChange={(e) => setName(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label htmlFor="icon" className="form-label">Иконка:</label>
                <select className="form-control" id="icon" value={icon} onChange={(e) => setIcon(e.target.value)}>
                    {Object.keys(iconComponents).map((iconName, index) => (
                        <option key={index} value={iconName}>{iconName}</option>
                    ))}
                </select>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <SelectedIcon fill={color} style={{ width: '50%', height: 'auto', marginTop: "20px" }} />
                </div>
            </div>
            <div className="mb-3">
                <label htmlFor="color" className="form-label">Цвет:</label>
                <input type="color" className="form-control" id="color" value={color}
                       onChange={(e) => setColor(e.target.value)}/>
            </div>
            <button type="submit" className="btn btn-primary">Отправить</button>
        </form>
    </div>
);
};

export default AddActivityForm;