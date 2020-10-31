import React, { useState } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { getCurrentList } from '../../redux/currentList';
import { sortListItems } from '../../redux/user';

import SortIcon from '@material-ui/icons/Sort';

import Utils from '../../Utils';

const SortMenu = ({ lists, onOpenClick, onSortTypeClick, onClose, sortListItems }) => {
    const [anchorElement, setAnchorElement] = useState(null);

    const list = useSelector(getCurrentList);

    const handleClick = (event) => {
        setAnchorElement(event.currentTarget);

        if (onOpenClick) onOpenClick(event);
    }

    const handleClose = () => {
        setAnchorElement(null);
        onClose();
    }

    const reorder = (sortOrder) => {
        // Sort list items
        if (list) {
            const sortedItems = list.items.slice().sort(Utils.sortByProperty(sortOrder)); // Sort by property

            sortListItems({ 
                listId: list._id,
                sortOrder: sortOrder,
                sortedItems: sortedItems
            });
        }

        setAnchorElement(null);

        if (onSortTypeClick) onSortTypeClick();
    }

    return (
        <div>
            <MenuItem className="actionsMenuItem" onClick={handleClick}>
                <ListItemIcon className="menuIcon menuSortButton" style={{ color: "#218cf2" }}>
                    <SortIcon />
                </ListItemIcon>
                <ListItemText primary="Sortera"></ListItemText>
            </MenuItem>

            <Menu anchorEl={anchorElement} open={Boolean(anchorElement)} onClose={handleClose} transitionDuration={150}>
                <SortTypeItem onClick={() => reorder("completed")} text={"Inköpta längst ner"} />
                <SortTypeItem onClick={() => reorder("-completed")} text={"Inköpta högst upp"} />
                <SortTypeItem onClick={() => reorder("-createdAt")} text={"Nyast högst upp"} />
                <SortTypeItem onClick={() => reorder("createdAt")}  text={"Nyast längst ner"} />
            </Menu>
        </div>
    );
}

const SortTypeItem = React.forwardRef(({ text, onClick }, ref) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemText className="menuSortType" primary={text}></ListItemText>
        </MenuItem>
    );
});

const mapStateToProps = state => ({ lists: state.user.lists })

const mapDispatch = { sortListItems };

export default connect(mapStateToProps, mapDispatch)(SortMenu);