import React, { useEffect, useState, useRef } from 'react';

import { connect } from 'react-redux'
import { renameList } from '../../redux/user';

import Input from '../Input';
import Utils from '../../Utils';

const TitleInput = ({ title, renameList, listId }) => {
    const [titleInput, setTitleInput] = useState(title);
    const [canRename, setCanRename] = useState(true);

    const inputElement = useRef(null);

    useEffect(() => setTitleInput(Utils.capitalize(title)), [title]);
    useEffect(() => {
        inputElement.current.addEventListener("manualblur", () => {
            setCanRename(false);

            document.activeElement.blur();
        });
    }, [])

    const submit = (event) => {
        event.preventDefault();

        inputElement.current.blur();
    }

    const rename = () => {
        if (canRename) 
            renameList({ _id: listId, name: titleInput });
        else 
            setCanRename(true);
    }
    
    return (
        <form onSubmit={submit}>
            <Input value={titleInput} id="list-name-input" ref={inputElement}
                onChange={(event) => setTitleInput(Utils.capitalize(event.target.value))}
                onBlur={rename} />
        </form> 
    )
}

const mapDispatch = { renameList }

export default connect(null, mapDispatch)(TitleInput);