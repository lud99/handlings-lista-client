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
            <ListItem button style={styles.listItem(list.completed)} onClick={openList}>
                <div className="listTopRow" style={styles.topRow(editMode)}>
                    <ListItemText primary={Utils.capitalize(list.name)}/>
                    <ListItemText primary={dateText} style={styles.date(editMode)}/>
                </div>
                <div className="listBottomRow" style={styles.bottomRow(editMode)}>
                    <ListItemsPreview listCompleted={list.completed} items={list.items} /> 
                </div>
                <Delete className="homeListDelete" enabled={editMode} onClick={() => removeList({ _id: list._id })}/>
            </ListItem>

            <Divider style={styles.divider(list.completed)} />
        </>
    );
}


const styles = {
    listItem: (completed) => ({
        height: "auto",
        justifyContent: "space-between",
        paddingLeft: "1.5rem",
        paddingRight: "0.5rem",
        flexWrap: "wrap",
        backgroundColor: completed ? "var(--completed-color)" : ""
    }),
    topRow: (editMode) => ({ width: editMode ? "calc(100% - 48px)" : "100%" }),
    date: (editMode) => ({ marginRight: editMode ? "0.5rem" : ""}),
    bottomRow: (editMode) => ({ width: editMode ? "calc(100% - 44px)" : "95%" }), 
    divider: (completed) => ({
        backgroundColor: completed ? "var(--completed-color)" : "",
        marginLeft: completed ? "0" : "1rem"
    }),
}

const mapStateToProps = state => ({
    lists: state.user.lists,
    pin: state.user.pin
})

const mapDispatch = { removeList };

export default connect(mapStateToProps, mapDispatch)(List);