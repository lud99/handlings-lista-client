import React from 'react';

import { connect } from 'react-redux'
import { ListItem, ListItemText, Divider } from '@material-ui/core';
import { removeList } from '../../redux/user';

import Delete from '../Delete';
import ListItemsPreview from './ListItemsPreview';
import Utils from '../../Utils';
import history from '../../history';

const List = ({ list, editMode, removeList }) => {
    const date = new Date(list.createdAt);
    const today = new Date();

    let dateText = date.toLocaleDateString("sv");

    if (date.toLocaleDateString() === today.toLocaleDateString())
        dateText = "Idag";
    
    if (date.getYear() === today.getYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() - 1)
        dateText = "Igår";

    const openList = () => history.push(`/list/${list._id}`);

    return (          
        <>      
            <ListItem button style={styles.listItem} onClick={openList}>
                <div className="listTopRow" style={styles.topRow(editMode)}>
                    <ListItemText primary={Utils.capitalize(list.name)}/>
                    <ListItemText primary={dateText} style={styles.date(editMode)}/>
                </div>
                <div className="listBottomRow" style={styles.bottomRow(editMode)}>
                    <ListItemsPreview items={list.items} /> 
                </div>
                { editMode && <Delete className="homeListDelete" onClick={() => removeList({ _id: list._id })}/> }
            </ListItem>

            <Divider style={styles.divider} />
        </>
    );
}


const styles = {
    listItem: {
        height: "auto",
        justifyContent: "space-between",
        paddingLeft: "1.5rem",
        paddingRight: "0.5rem",
        flexWrap: "wrap"
    },
    topRow: (editMode) => ({ width: editMode ? "calc(100% - 44px)" : "100%" }),
    date: (editMode) => ({ marginRight: editMode ? "0.5rem" : ""}),
    bottomRow: (editMode) => ({ width: editMode ? "calc(100% - 44px)" : "95%" }), 
    divider: { marginLeft: "1rem" },
}

const mapStateToProps = state => ({
    lists: state.user.lists,
    pin: state.user.pin
})

const mapDispatch = { removeList };

export default connect(mapStateToProps, mapDispatch)(List);