import React, {useEffect, useState} from 'react';


function EventForm({tags = [], icons = {}, initialFactors = {}}) {
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [icon, setIcon] = useState('');
    const [factors, setFactors] = useState([]);

    const handleFactorChange = (name, value) => {
        setFactors(factors.map(factor => factor.name === name ? {...factor, value: Number(value)} : factor));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const handleTagChange = (event) => {
        const selectedTags = Array.from(event.target.selectedOptions, option => option.value);
        setTag(selectedTags);
    };

    useEffect(() => {
        setFactors(Object.entries(initialFactors).map(([id, name, value]) => ({id, name, value})));
    }, [initialFactors]);

    return (
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}/>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Tags:</label>
                <select multiple value={tag.name}
                        onChange={handleTagChange}> {/* Add multiple attribute and update onChange handler */}
                    {Array.isArray(tags) && tags.map(tag => (
                        <option key={tag.id} value={tag.name}>{tag.name}</option>
                    ))}
                </select>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <label>Icon:</label>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <select value={icon} onChange={e => setIcon(e.target.value)}>
                        {Object.keys(icons).map(iconId => (
                            <option key={iconId} value={iconId}>{iconId}</option>
                        ))}
                    </select>
                    {icon && React.createElement(icons[icon])}
                </div>
            </div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
                Factors:
                {Array.isArray(factors) && factors.map(factor => (
                    <div key={factor.name}>
                        <label>{factor.name}:</label>
                        <input type="range" min="-10" max="10" step="1" value={factor.value} onChange={e => handleFactorChange(factor.name, e.target.value)} />
                    </div>
                ))}
            </div>
            <input type="submit" value="Submit"/>
        </form>
    );
}

export default EventForm;