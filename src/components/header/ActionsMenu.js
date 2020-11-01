import React, { useState, forwardRef } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { setListCompleted } from '../../redux/user';
import { toggleEditMode } from '../../redux/editMode';
import { getCurrentList } from '../../redux/currentList';
import { setShowListCompleteDialog } from '../../redux/showListCompleteDialog';
import { setShowChangeAccountDialog } from '../../redux/basic/showAccountDialog';

import { IconButton } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import SortMenu from './SortMenu';

const ActionsMenu = ({ 
    useEditButton, 
    useListCompletedButton, 
    useSortButton, 
    toggleEditMode, 
    setShowListCompleteDialog,
    setShowChangeAccountDialog }) => {
        
    const [anchorElement, setAnchorElement] = useState(null);

    const list = useSelector(getCurrentList);

    const handleClick = (event) => setAnchorElement(event.currentTarget);

    const close = () => setAnchorElement(null);

    const completeList = () => {
        close();

        if (!list.completed) setShowListCompleteDialog(true);
    }

    const editButtonHandleClick = () => {
        close();

        toggleEditMode();
    }

    const accountButtonHandleClick = () => {
        setShowChangeAccountDialog(true);
        close();
    }

    const sortMenuHandleClose = () => close();

    return (
        <div>
            <IconButton onClick={handleClick} color="inherit">
                <MenuIcon />
            </IconButton>

            <Menu
                id="actions-menu"
                anchorEl={anchorElement}
                
                open={Boolean(anchorElement)}
                onClose={close}

                transitionDuration={150}
            >
                { useEditButton && <EditItem onClick={editButtonHandleClick} /> }
                { useListCompletedButton && <ListCompletedItem onClick={completeList} /> }
                { useSortButton && <SortMenu onSortTypeClick={close} onClose={sortMenuHandleClose} /> }
                { <AccountItem onClick={accountButtonHandleClick} /> }
            </Menu>
        </div>
    );
}

const EditItem = forwardRef(({ onClick }, ref) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemIcon className="menuIcon menuEditButton" style={{ color: "#c32160" }}>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Redigera"></ListItemText>
        </MenuItem>
    );
});

const ListCompletedItem = forwardRef(({ onClick }, ref) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemIcon className="menuIcon menuCompletedButton" style={{ color: "#2ba02f" }}>
                <DoneIcon />
            </ListItemIcon>
            <ListItemText primary="Handlat färdigt"></ListItemText>
        </MenuItem>
    );
});

const AccountItem = forwardRef(({ onClick }, ref) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemIcon className="menuIcon menuAccountButton">
                <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Byt konto"></ListItemText>
        </MenuItem>
    );
});

const mapStateToProps = state => ({
    editMode: state.editMode
})

const mapDispatch = { 
    toggleEditMode: () => toggleEditMode(), 
    setShowListCompleteDialog,
    setListCompleted,
    setShowChangeAccountDialog
};

export default connect(mapStateToProps, mapDispatch)(ActionsMenu);