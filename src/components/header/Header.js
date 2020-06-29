import React from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { setListCompleted, createList } from '../../redux/user';
import { toggleEditMode, setEditMode } from '../../redux/editMode';
import { getCurrentList } from '../../redux/currentList';
import { setShowReadOnlySnackbar } from '../../redux/showReadOnlySnackbar';  
import { setShowInvalidPinSnackbar } from '../../redux/showInvalidPinSnackbar';  

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import history from '../../history';
import Utils from '../../Utils';
import Title from './Title';
import ListCompletedButton from './ListCompletedButton';

import './Header.css';

const Header = (props) => {
    const { 
        title,
        useEditButton, 
        useRenameList,
        useListDone,
        editMode, 
        toggleEditMode, 
        setShowReadOnlySnackbar, 
        setShowInvalidPinSnackbar,
        setListCompleted,
        createList,
        setEditMode,
        viewOnly } = props;

    const list = useSelector(getCurrentList);

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

        history.push(previousUrl);

        // Disable the edit mode
        setEditMode(false);
    }

    const openReadOnlySnackbar = () => {
        setShowInvalidPinSnackbar(false);

        setShowReadOnlySnackbar(true);
    }

    const completeList = () => {
        if (list) {
            setListCompleted({ _id: list._id, completed: true });

            createList({ name: list.name + " 2", items: list.items });
        }
    }

    const titleFormatted = Utils.capitalize(list ? list.name : title);

    return (
        <AppBar position="static">
            <Toolbar>
                { !viewOnly && <IconButton edge="start" className="backButton" color="inherit" aria-label="back" onClick={back}>
                    <BackIcon />
                </IconButton> }

                <Title titleFormatted={titleFormatted} editMode={editMode} useRenameList={useRenameList} />

                { (!viewOnly && useEditButton) && 
                    <>
                        { useListDone && <ListCompletedButton onClick={completeList} style={styles.listCompletedButton(list.completed)} /> }

                        <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" style={styles.editButton(editMode)} onClick={toggleEditMode}>
                            <EditIcon />
                        </IconButton> 
                    </>
                }

                { viewOnly &&
                    <IconButton edge="end" className="readOnly" color="inherit" aria-label="read-only" onClick={openReadOnlySnackbar}>
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

const styles = {
    editButton: (editMode) => ({ color: !editMode ? "#fff" : "#c32160" }),
    listCompletedButton: (completed) => ({ color: completed ? "#2ba02f" : "#fff"})
}

const mapStateToProps = state => ({
    editMode: state.editMode,
    viewOnly: state.viewOnly,
})

const mapDispatch = { 
    toggleEditMode: () => toggleEditMode(), 
    setEditMode, 
    setShowReadOnlySnackbar, 
    setShowInvalidPinSnackbar, 
    setListCompleted,
    createList 
};

export default connect(mapStateToProps, mapDispatch)(Header);