import React, { useEffect, useState, useRef } from 'react';

import { AppBar, Toolbar, IconButton, Typography, Chip } from '@material-ui/core';

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';

import Input from './Input';

import '../css/Header.css';
import history from '../history';

const Header = ({ title, listId, useEditButton, useRenameList, editButtonState, toggleEditMode, renameList, setOpenSnackbar, isViewOnly }) => {
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

    return (
        <AppBar position="static">
            <Toolbar>
                { !isViewOnly && <IconButton edge="start" className="backButton" color="inherit" aria-label="back" onClick={back}>
                    <BackIcon />
                </IconButton> }

                <Title 
                    title={title} 
                    listId={listId}
                    editMode={editButtonState} 
                    isViewOnly={isViewOnly}
                    renameList={renameList} 
                    useRenameList={useRenameList} 
                    setOpenSnackbar={setOpenSnackbar}
                    />

                { (!isViewOnly && useEditButton) && 
                <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" style={styles.editButton(editButtonState)} onClick={toggleEditMode}>
                    <EditIcon />
                </IconButton> }
            </Toolbar>
        </AppBar>
    )
}

Header.defaultProps = {
    useRenameList: false,
}

const Title = ({ title, listId, useRenameList, editMode, isViewOnly, renameList, setOpenSnackbar }) => {  
    return (
        <>
            <Typography variant="h6" className="title" style={styles.title(isViewOnly)}>
                { (editMode && useRenameList) ? 
                    // Input
                    <TitleInput title={title} renameList={renameList} listId={listId} /> :
                    // Static text
                    title
                }
            </Typography>

            { isViewOnly && <IconButton edge="end" className="readOnly" color="inherit" aria-label="read-only" onClick={() => setOpenSnackbar(true)}>
                <LockIcon />
            </IconButton> 
            }
        </>
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
    title: (isViewOnly) => ({
        width: `calc(100% - ${!isViewOnly ? 64 : 0}px)`
    }),
    titleEditButton: {
        display: "inline-block"
    },
    editButton: (editButtonState) => ({ color: !editButtonState ? "#fff" : "#c32160" })
}

export default Header;