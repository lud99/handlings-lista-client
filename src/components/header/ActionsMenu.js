import React, { useState } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { setListCompleted } from '../../redux/user';
import { toggleEditMode, setEditMode } from '../../redux/editMode';
import { getCurrentList } from '../../redux/currentList';
import { setShowListCompleteDialog } from '../../redux/showListCompleteDialog';

import { IconButton } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import SortIcon from '@material-ui/icons/Sort';

const ActionsMenu = ({ useEditButton, useListDone, setLatestButtonUsed, toggleEditMode, setEditMode, setShowListCompleteDialog }) => {
    const [anchorElement, setAnchorElement] = useState(null);

    const list = useSelector(getCurrentList);

    const handleClick = (event) => setAnchorElement(event.currentTarget);

    const close = () => setAnchorElement(null);

    const completeList = () => {
        close();

        setLatestButtonUsed("completed");
        setEditMode(false);

        if (!list.completed) setShowListCompleteDialog(true);
    }

    const editButtonHandleClick = () => {
        close();

        setLatestButtonUsed("edit");

        toggleEditMode();
    }

    return (
        <div>
            <IconButton onClick={handleClick}>
                <MenuIcon />
            </IconButton>

            <Menu
                id="actions-menu"
                anchorEl={anchorElement}
                
                open={Boolean(anchorElement)}
                onClose={close}
            >
                { useEditButton && <EditItem onClick={editButtonHandleClick} /> }
                { useListDone && <ListCompletedItem onClick={completeList} /> }
                <SortItem />
            </Menu>
        </div>
    );
}

const EditItem = ({ onClick }) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemIcon className="menuIcon menuEditButton" style={{ color: "#c32160" }}>
                <EditIcon />
            </ListItemIcon>
            <ListItemText primary="Redigera"></ListItemText>
        </MenuItem>
    );
}

const ListCompletedItem = ({ onClick }) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemIcon className="menuIcon menuCompletedButton" style={{ color: "#2ba02f" }}>
                <DoneIcon />
            </ListItemIcon>
            <ListItemText primary="Handlat färdigt"></ListItemText>
        </MenuItem>
    );
}

const SortItem = ({ onClick }) => {
    return (
        <MenuItem className="actionsMenuItem">
            <ListItemIcon className="menuIcon menuSortButton" style={{ color: "#218cf2" }}>
                <SortIcon />
            </ListItemIcon>
            <ListItemText primary="Sortera"></ListItemText>
        </MenuItem>
    );
}

const mapStateToProps = state => ({
    editMode: state.editMode
})

const mapDispatch = { 
    toggleEditMode: () => toggleEditMode(), 
    setShowListCompleteDialog,
    setListCompleted,
    setEditMode
};

export default connect(mapStateToProps, mapDispatch)(ActionsMenu);