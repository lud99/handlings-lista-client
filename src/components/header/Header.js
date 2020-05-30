import React from 'react';

import { connect } from 'react-redux'
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { toggleEditMode } from '../../redux/editMode';

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import history from '../../history';
import Utils from '../../Utils';
import Title from './Title';

import './Header.css';

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

    const titleFormatted = Utils.capitalize(list ? list.name : title);

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
                    </IconButton> 
                }

                { isViewOnly && <div onClick={openReadOnlySnackbar}>
                    <IconButton edge="end" className="readOnly" color="inherit" aria-label="read-only">
                        <LockIcon />
                    </IconButton> 
                </div>
                }
            </Toolbar>
        </AppBar>
    )
}

Header.defaultProps = {
    useRenameList: false,
}

const styles = {
    editButton: (editMode) => ({ color: !editMode ? "#fff" : "#c32160" })
}

const mapStateToProps = state => ({
    editMode: state.editMode
})

const mapDispatch = { toggleEditMode: () => toggleEditMode() };

export default connect(mapStateToProps, mapDispatch)(Header);