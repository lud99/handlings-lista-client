import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import { setListCompleted, createList } from '../../redux/user';
import { toggleEditMode, setEditMode } from '../../redux/editMode';
import { getCurrentList } from '../../redux/currentList';
import { setShowReadOnlySnackbar } from '../../redux/showReadOnlySnackbar';  
import { setShowInvalidPinSnackbar } from '../../redux/showInvalidPinSnackbar';  
import { setShowListCompleteDialog } from '../../redux/showListCompleteDialog';

import BackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import LockIcon from '@material-ui/icons/Lock';
import history from '../../history';
import Utils from '../../Utils';
import Title from './Title';
import ActionsMenu from './ActionsMenu';

import './Header.css';

const Header = (props) => {
    const { 
        title,
        useEditButton, 
        useRenameList,
        useListCompletedButton,
        useSortButton,
        editMode, 
        toggleEditMode, 
        setShowReadOnlySnackbar, 
        setShowInvalidPinSnackbar,
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

    //const completeList = () => !list.completed && setShowListCompleteDialog(true);

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
                    <EditButton editMode={editMode} toggleEditMode={toggleEditMode} />
                    {
                        /*(function() {
                            switch (latestButtonUsed) {
                                case "edit": 
                                    return (
                                        <EditButton editMode={editMode} toggleEditMode={toggleEditMode} />
                                    );

                                case "completed": 
                                    return (
                                        <ListCompletedButton 
                                            onClick={completeList} style={styles.listCompletedButton(list && list.completed)} />
                                    );

                                case "sort": 
                                    return (
                                        <SortButton />
                                    );

                                default: 
                                    return (
                                        <EditButton editMode={editMode} toggleEditMode={toggleEditMode} />
                                    ); 
                            }
                        })()*/
                    }
                    </>
                 }

                <ActionsMenu 
                    useEditButton={useEditButton} 
                    useListCompletedButton={useListCompletedButton}
                    useSortButton={useSortButton}  />

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
    useEditButton: true,
    useListCompletedButton: false,
    useSortButton: true,
}

const EditButton = ({ editMode, toggleEditMode }) => {
    const [color, setColor] = useState(editMode ? "#c32160" : "#fff");
    useEffect(() => {
        setColor(editMode ? "#c32160" : "#fff");
    }, [editMode])

    const onClick = () => {
        toggleColors();

        toggleEditMode();
    }

    const toggleColors = () => {
        if (color === "#fff")
            setColor("#c32160");
        else if (color === "#c32160")
            setColor("#fff");
    }

    return (
        <IconButton edge="end" className="editButton" color="inherit" style={{ color }} 
            onClick={onClick}>
            <EditIcon />
        </IconButton> 
    );
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
    setShowListCompleteDialog,
    setListCompleted,
    createList 
};

export default connect(mapStateToProps, mapDispatch)(Header);