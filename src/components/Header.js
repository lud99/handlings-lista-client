import React, { useEffect, useState, useRef } from 'react';

import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';

import Input from './Input';

import '../css/Header.css';
import history from '../history';

const Header = ({ title, listId, useEditButton, useRenameList, editButtonState, toggleEditMode, renameList }) => (
    <AppBar position="static">
        <Toolbar>
            <IconButton edge="start" className="backButton" color="inherit" aria-label="back" onClick={history.goBack}>
                <BackIcon />
            </IconButton>
            <Title title={title} editMode={editButtonState} renameList={renameList} useRenameList={useRenameList} listId={listId} />

            { useEditButton && 
            <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" style={styles.editButton(editButtonState)} onClick={toggleEditMode}>
                <EditIcon />
            </IconButton> }
        </Toolbar>
    </AppBar>
)

Header.defaultProps = {
    useRenameList: false,
}

const Title = ({ title, editMode, renameList, listId, useRenameList }) => {    
    return (
        <Typography variant="h6" className="title" style={styles.title}>
            { (editMode && useRenameList) ? 
                // Input
                <TitleInput title={title} renameList={renameList} listId={listId} /> :
                // Static text
                title
            }
        </Typography>
    )
}

const TitleInput = ({ title, renameList, listId }) => {
    const [titleInput, setTitleInput] = useState(title);
    const [canRename, setCanRename] = useState(true);

    const inputElement = useRef(null);

    useEffect(() => setTitleInput(title), [title]);
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
            renameList(listId, titleInput);
        else 
            setCanRename(true);
    }
    
    return (
        <form onSubmit={submit}>
            <Input value={titleInput} id="list-name-input" ref={inputElement}
                onChange={(event) => setTitleInput(event.target.value)}
                onBlur={rename} />
        </form> 
    )
}

const styles = {
    title: {
        width: "calc(100% - 64px)"
    },
    titleEditButton: {
        display: "inline-block"
    },
    editButton: (editButtonState) => ({ color: !editButtonState ? "#fff" : "#c32160" })
}

export default Header;