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

import { IconButton } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

import SortMenu from './SortMenu';

const ActionsMenu = ({ 
    useEditButton, 
    useListCompletedButton, 
    useSortButton, 
    toggleEditMode, 
    setShowListCompleteDialog }) => {
        
    const [anchorElement, setAnchorElement] = useState(null);

    const list = useSelector(getCurrentList);

    const handleClick = (event) => setAnchorElement(event.currentTarget);

    const close = () => setAnchorElement(null);

    const completeList = () => {
        close();

        //setLatestButtonUsed("completed");

        if (!list.completed) setShowListCompleteDialog(true);
    }

    const editButtonHandleClick = () => {
        close();

        //setLatestButtonUsed("edit");

        toggleEditMode();
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

const mapStateToProps = state => ({
    editMode: state.editMode
})

const mapDispatch = { 
    toggleEditMode: () => toggleEditMode(), 
    setShowListCompleteDialog,
    setListCompleted
};

export default connect(mapStateToProps, mapDispatch)(ActionsMenu);