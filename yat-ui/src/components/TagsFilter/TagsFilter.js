import React, { useEffect, useState } from 'react';

const TagsFilter = ({ tags, onTagSelection }) => {
    const [selectedTags, setSelectedTags] = useState([]);

    const handleTagClick = (tagId) => {
        const isSelected = selectedTags.includes(tagId);
        if (isSelected) {
            setSelectedTags(selectedTags.filter(id => id !== tagId));
        } else {
            setSelectedTags([...selectedTags, tagId]);
        }
    };

    useEffect(() => {
        onTagSelection(selectedTags);
    }, [selectedTags]);

    return (
        <div>
            <h2>Теги для фильтрации</h2>
            {tags.map((tag) => (
                <div key={tag.id} style={{ borderBottom: '1px solid gray', paddingBottom: '10px', marginBottom: '10px' }}>
                    <input
                        type="checkbox"
                        id={`tag-${tag.id}`}
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagClick(tag.id)}
                        style={{ marginRight: '5px'}}
                    />
                    <label htmlFor={`tag-${tag.id}`}>{tag.name}</label>
                </div>
            ))}
        </div>
    );
};

export default TagsFilter;