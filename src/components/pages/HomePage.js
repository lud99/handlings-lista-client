import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Divider, Fab } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import Header from '../Header';
import Delete from '../Delete';
import LoadingBackdrop from '../LoadingBackdrop';

import '../../css/Home.css';

const Home = (props) => {
    const { lists, addList, login, shouldLoad } = props;
    
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        login();

        // Don't make the body fixed (causes problems with scrolling)
        document.body.style.position = "";

        // Disable scrolling on ios
        window.Utils.addResizeListener(async () => {
            const header = document.querySelector("header");
            const listContainer = document.querySelector(".list-container");

            if (!header || !listContainer) return;

            listContainer.style.paddingTop = header.offsetHeight + "px";
            listContainer.style.paddingBottom = "80px";
        }, "Home");
    }, []);

    const addListClick = () => {
        const name = prompt("Namn på listan:");

        if (name) addList(name);
    }

    const toggleEditMode = () => setEditMode(!editMode);

    return (
        <>
            { (!lists || shouldLoad) && <LoadingBackdrop isEnabled={true} /> }
            <Header title="Listor" useEditButton={true} editButtonState={editMode} toggleEditMode={toggleEditMode}/>

            <div className="list-container">
                <List className="list" component="div" style={styles.list}> 
                    { lists && (lists.length === 0 ?
                    // No lists
                    <p className="noLists">Klicka på plusset för att skapa din första lista</p> : 

                    // Lists
                    lists.map(list => <Item list={list} key={list._id} editMode={editMode} {...props} />)) }
                </List>
            </div>
            <Fab color="primary" aria-label="add" size="large" className="addButton" accessKey="+" onClick={addListClick}>
                <AddIcon />
            </Fab> 
        </>
    )
}

const Item = ({ list, openList, editMode, removeList }) => {
    const date = new Date(list.createdAt);
    const today = new Date();

    let dateText = date.toLocaleDateString("sv");

    if (date.toLocaleDateString() === today.toLocaleDateString())
        dateText = "Idag";
    
    if (date.getYear() === today.getYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate() - 1)
        dateText = "Igår";

    return (          
        <>      
            <ListItem button style={styles.listItem} onClick={() => openList(list._id)}>
                <div className="listTopRow" style={styles.topRow(editMode)}>
                    <ListItemText primary={list.name} style={styles.listName}/>
                    <ListItemText primary={dateText} style={styles.date(editMode)}/>
                </div>
                <div className="listBottomRow" style={styles.bottomRow(editMode)}>
                    <ItemTextPreview items={list.items} /> 
                </div>
                { editMode && <Delete style={styles.delete} onClick={() => removeList(list._id)}/> }
            </ListItem>

            <Divider style={styles.divider} />
        </>
    );
}

const ItemTextPreview = ({ items }) => {
    // Filter out the items with no text
    const filteredItems = items.filter(item => item.text !=="");

    const listIsEmpty = filteredItems.length === 0;

    return (
        <ul className="listItemsPreview">
            <li>{ filteredItems.length > 0 ? 

                // There are items
                filteredItems.map((item, i) => {
                    const style = { color: item.completed ? "#5e982a" : "#313131" };

                    const text = (i < filteredItems.length - 1) ? `${item.text}, ` : item.text; 

                    return <span style={style} key={item._id}>{text}</span>
                }) : 

                // There are no items
                "Inga föremål" }</li>
        </ul>
    )
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
    delete: { 
        padding: "0.65rem",
        position: "absolute",
        right: "0.5rem",
    },
    divider: { marginLeft: "1rem" },
}

export default Home;