import React, { useEffect, useState, useRef } from 'react';

import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';

import Input from './Input';

import '../css/Header.css';
import history from '../history';

const Header = (props) => {
    const { 
        list,
        title,
        useEditButton, 
        editMode, 
        toggleEditMode, 
        setShowReadOnlySnackbar, 
        setShowInvalidPinSnackbar,
        isViewOnly } = props;

    const pageUrlLayout = [
        "/login",
        "/home",
        "/list/:id"
    ]

    const back = () => {
        var url = window.location.pathname;

        if (url.includes("/list")) {
            const listId = url.match(/(\/list\/)+([a-z0-9]+)/)[2];

            url = url.replace(listId, ":id");    
        }

        const index = pageUrlLayout.indexOf(url);

        const previousUrl = pageUrlLayout[index - 1];

        history.push(previousUrl)
    }

    const openReadOnlySnackbar = () => {
        setShowInvalidPinSnackbar(false);

        setShowReadOnlySnackbar(true);
    }

    const titleFormatted = window.Utils.capitalize(list ? list.name : title);

    return (
        <AppBar position="static">
            <Toolbar>
                { !isViewOnly && <IconButton edge="start" className="backButton" color="inherit" aria-label="back" onClick={back}>
                    <BackIcon />
                </IconButton> }

                <Title titleFormatted={titleFormatted} {...props} />

                { (!isViewOnly && useEditButton) && 
                <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" style={styles.editButton(editMode)} onClick={toggleEditMode}>
                    <EditIcon />
                </IconButton> }

                { isViewOnly && <IconButton edge="end" className="readOnly" color="inherit" aria-label="read-only" onClick={openReadOnlySnackbar}>
                    <LockIcon />
                </IconButton> 
                }
            </Toolbar>
        </AppBar>
    )
}

Header.defaultProps = {
    useRenameList: false,
}

const Title = ({ titleFormatted, listId, useRenameList, editMode, isViewOnly, renameList }) => {  
    return (
        <Typography variant="h6" className="title" style={styles.title(isViewOnly)}>
            { (editMode && useRenameList) ? 
                // Input
                <TitleInput title={titleFormatted} renameList={renameList} listId={listId} /> :
                // Static text
                titleFormatted
            }
        </Typography>
    )
}

const TitleInput = ({ title, renameList, listId }) => {
    const [titleInput, setTitleInput] = useState(title);
    const [canRename, setCanRename] = useState(true);

    const inputElement = useRef(null);

    useEffect(() => setTitleInput(window.Utils.capitalize(title)), [title]);
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
                onChange={(event) => setTitleInput(window.Utils.capitalize(event.target.value))}
                onBlur={rename} />
        </form> 
    )
}

const styles = {
    title: (isViewOnly) => ({
        width: `calc(100% - ${!isViewOnly ? 64 : 0}px)`
    }),
    titleEditButton: {
        display: "inline-block"
    },
    editButton: (editMode) => ({ color: !editMode ? "#fff" : "#c32160" })
}

export default Header;