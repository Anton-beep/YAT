import React, {useEffect, useState} from 'react';
import Auth from "../../pkg/auth";
import {ReactComponent as Bib} from '../../icons/bib.svg';
import {ReactComponent as Bob} from '../../icons/bob.svg';

const iconComponents = {
    "bib.svg": Bib,
    "bob.svg": Bob,
};

const AddActivityForm = ({activity = null, onClose}) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(Object.keys(iconComponents)[0]);
    const [color, setColor] = useState('#000000');
    const [editMode, setEditMode] = useState(!!activity);

    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setIcon(activity.icon_name);
            setColor(activity.icon_color);
        }
    }, [activity]);

    const handleSubmit = (event) => {
        event.preventDefault();

        const url = 'api/v1/homepage/activities/';
        const method = activity ? 'put' : 'post';
        const data = {
            name: name,
            icon_name: icon,
            icon_color: color
        };

        if (activity) {
            data.id = activity.id;
        }

        Auth.axiosInstance[method](url, data).then((response) => {
            console.log(response.data);
            setName('');
            setIcon(Object.keys(iconComponents)[0]);
            setColor('#000000');
            onClose();
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleDelete = () => {
        Auth.axiosInstance.put(`api/v1/homepage/activities/`, {
                id: activity.id,
                visible: false
            }
        )
            .then(() => {
                onClose();
            })
            .catch((error) => {
                console.log(error.request)
                console.error(error);
            });
    };

    const SelectedIcon = iconComponents[icon];

    return (
        <div>
            <h2 className="mt-3">{activity ? 'Редактировать активность' : 'Добавить активность'}</h2>
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
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <SelectedIcon fill={color} style={{width: '50%', height: 'auto', marginTop: "20px"}}/>
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="color" className="form-label">Цвет:</label>
                    <input type="color" className="form-control" id="color" value={color}
                           onChange={(e) => setColor(e.target.value)}/>
                </div>
                <button type="submit" className="button-green button-gap">Сохранить</button>
                {editMode && <button type="button" className="button-red button-gap" onClick={handleDelete}>Удалить</button>}
                <button type="button" className="button-orange" onClick={onClose}>Назад</button>
            </form>
        </div>
    );
};

export default AddActivityForm;