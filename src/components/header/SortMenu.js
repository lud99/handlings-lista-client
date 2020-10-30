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

const SortMenu = ({ onOpenClick, onSortTypeClick, sortListItems }) => {
    const [anchorElement, setAnchorElement] = useState(null);

    const list = useSelector(getCurrentList);

    const handleClick = (event) => {
        setAnchorElement(event.currentTarget);

        onOpenClick(event);
    }

    const close = () => setAnchorElement(null);

    const reorder = (sortOrder) => {
        const sortedItems = list.items.slice().sort(Utils.sortByProperty(sortOrder));

        sortListItems({ 
            listId: list._id,
            sortOrder: sortOrder,
            //sortedItems: sortedItems
        });

        close();

        onSortTypeClick();
    }

    return (
        <div>
            <MenuItem className="actionsMenuItem" onClick={handleClick}>
                <ListItemIcon className="menuIcon menuSortButton" style={{ color: "#218cf2" }}>
                    <SortIcon />
                </ListItemIcon>
                <ListItemText primary="Sortera"></ListItemText>
            </MenuItem>

            <Menu
                id="actions-menu"
                anchorEl={anchorElement}
                
                open={Boolean(anchorElement)}
                onClose={close}
            >
                <SortTypeItem onClick={() => reorder("completed")} text={"Inköpta längst ner"} />
                <SortTypeItem onClick={() => reorder("-completed")} text={"Inköpta högst upp"} />
                <SortTypeItem onClick={() => reorder("text")} text={"Namn A-Ö"} />
                <SortTypeItem onClick={() => reorder("-text")}  text={"Namn Ö-A"} />
            </Menu>
        </div>
    );
}

const SortTypeItem = ({ text, onClick }) => {
    return (
        <MenuItem className="actionsMenuItem" onClick={onClick}>
            <ListItemText className="menuSortType" primary={text}></ListItemText>
        </MenuItem>
    );
}

const mapStateToProps = state => ({  })

const mapDispatch = { sortListItems };

export default connect(mapStateToProps, mapDispatch)(SortMenu);