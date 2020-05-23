import React, { useState, useEffect } from 'react';

import { List as MaterialList, Button } from '@material-ui/core';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Header from '../Header';
import ListItem from '../ListItem';
import LoadingBackdrop from '../LoadingBackdrop';
import Input from '../Input';

import '../../css/List.css';

const ListPage = (props) => {
    // Destructure the props
    const { list, login, addListItem, renameList, shouldLoad } = props;

    const [editMode, setEditMode] = useState(false);
    const [sortOrder] = useState("-createdAt");

    const refs = {
        input: React.createRef(),
        addItemContainer: React.createRef(),
        list: React.createRef(),
    }

    useEffect(() => {
        login();

        window.Utils.addResizeListener(() => {
            const list = refs.list.current || document.querySelector(".list");
            const addItemContainer = document.querySelector(".add-item-container");
            const header = document.querySelector("header");

            if (!list || !addItemContainer || !header) return;

            // Set the height of the list
            const listStyle = getListStyles();

            list.style.paddingTop = listStyle.paddingTop;
            list.style.paddingBottom = listStyle.paddingBottom;
        }, "ListPage");

        return () => { }
    }, []);

    const getListStyles = () => {
        const addItemContainer = document.querySelector(".add-item-container");
        const header = document.querySelector("header");

        if (!addItemContainer || !header) return;

        return {
            paddingTop: header.offsetHeight + "px",
            paddingBottom: addItemContainer.offsetHeight + 50 + "px"
        }
    }

    const toggleEditMode = () => setEditMode(!editMode);

    return (
        <>
            { (!list || shouldLoad) && <LoadingBackdrop isEnabled={true} /> }

            <Header title={list.name} listId={list._id} useEditButton={true} useRenameList={true}
                editButtonState={editMode}  toggleEditMode={toggleEditMode} renameList={renameList} />

            { isEmpty(list) && <LoadingBackdrop isEnabled={true} /> }

            <List list={list} editMode={editMode} sortOrder={sortOrder} listStyle={getListStyles()} {...props} />

            <AddItem refs={refs} addListItem={addListItem} />
        </>
    );
}

const List = (props) => {
    const { list, reorderListItems, editMode, sortOrder, resetDrag, listStyle } = props;

    // Reorder moved items
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    const onDragEnd = (result) => {
        // Dropped outside the list
        if (!result.destination)
            return;

        // Reorder the items locally first
        const reorderedItems = reorder(list.items, result.source.index, result.destination.index);

        reorderListItems(list._id, result.source.index, result.destination.index, reorderedItems, sortOrder);
    }

    return (
        <>
            { resetDrag ? 
            
            <>b</> : 
            
            editMode ?

            // Static list
            <MaterialList className="list" component="div" style={listStyle}>
                { list.items !==null && list.items.map((item, index) => (
                    <ListItem {...item} {...props} key={index}/>
                ))}
            </MaterialList> :  

            // Draggable list
            <DragDropContext style={styles.container} onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <MaterialList className="list" component="div" style={listStyle} ref={provided.innerRef} {...provided.draggableProps}>
                            { !isEmpty(list) && list.items !== null && list.items.map((item, index) => (
                                <Draggable draggableId={item._id} index={index} key={item._id}>
                                    {(provided, snapshot) => (
                                        <ListItem provided={provided} snapshot={snapshot} {...item} {...props} />
                                    )}
                                </Draggable>)
                            )}
                            {provided.placeholder}
                        </MaterialList>
                    )}
                </Droppable>
            </DragDropContext>
            }
        </>
    )
}

const AddItem = ({ refs, addListItem }) => {
    const [inputValue, setInputValue] = useState("");

    const addItem = (event) => {
        if (event) event.preventDefault(); // Prevent form submission

        if (inputValue !== "") addListItem(inputValue);

        setInputValue("");
    }

    return (
        <div className="add-item-container" ref={refs.addItemContainer}>
            <form onSubmit={event => addItem(event)}>
                <Input placeholder="Föremål" value={inputValue} onChange={event => setInputValue(event.target.value)} autoCapitalize="on"/>

                <Button variant="contained" className="button button-small" onClick={() => addItem()}>
                    Lägg till
                </Button>
            </form>
        </div>
    )
}

const styles = {
    container: {
        height: "calc(100vh - 56px)"
    }
}

const isEmpty = (object) => JSON.stringify(object) === "{}"

export default ListPage;