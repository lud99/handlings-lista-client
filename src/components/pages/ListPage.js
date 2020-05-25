import React, { useState, useEffect, useRef } from 'react';

import { List as MaterialList, Button } from '@material-ui/core';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Header from '../Header';
import ListItem from '../ListItem';
import LoadingBackdrop from '../LoadingBackdrop';
import Input from '../Input';
import ReadOnlySnackbar from '../ReadOnlySnackbar';

import '../../css/List.css';

const ListPage = (props) => {
    // Destructure the props
    const { list, login, addListItem, shouldLoad, setOpenSnackbar, isViewOnly, setIsViewOnly, isSnackbarOpen } = props;

    const [editMode, setEditMode] = useState(false);

    const refs = {
        input: React.createRef(),
        addItemContainer: React.createRef(),
        list: React.createRef(),
    }

    useEffect(() => {
        login();

        if (isViewOnly) setOpenSnackbar(true); 
    }, []);

    const toggleEditMode = () => setEditMode(!editMode);

    console.log((list && !shouldLoad), isSnackbarOpen)

    return (
        <>
            { (!list || shouldLoad) && <LoadingBackdrop isEnabled={true} /> }

            <Header 
                title={list.name} 
                listId={list._id} 
                isViewOnly={isViewOnly}
                useEditButton={true} 
                useRenameList={true}
                editButtonState={editMode} 
                toggleEditMode={toggleEditMode} 
                {...props} />

            { isEmpty(list) && <LoadingBackdrop isEnabled={true} /> }

            <List list={list} editMode={editMode} isViewOnly={isViewOnly} {...props} />

            {  !isViewOnly ? 
            
            <AddItem refs={refs} listId={list._id} addListItem={addListItem} /> :
            
            (list && !shouldLoad) && <ReadOnlySnackbar 
                isOpen={isSnackbarOpen} 
                setOpen={setOpenSnackbar}
                listId={list._id}
                login={login} 
                setIsViewOnly={setIsViewOnly} /> 

            }
        </>
    );
}

const List = (props) => {
    const { list, reorderListItems, editMode, isViewOnly, resetDrag } = props;

    // Reorder moved items
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const onDragEnd = (result) => {
        // Dropped outside the list
        if (!result.destination)
            return;

        // Reorder the items locally first
        const reorderedItems = reorder(list.items, result.source.index, result.destination.index);

        reorderListItems(list._id, result.source.index, result.destination.index, reorderedItems);
    }

    /*const newListItem = {
        completed: false,
        listId: list && list._id, 
        text: "",
        hideDeleteIcon: true,
        addListItem: addListItem,
        isAddItem: true
    }*/

    return (
        <>
            { resetDrag ? 
            
            <></> : 
            
            (editMode || isViewOnly) ?

            // Static editable list
            list.items != null && <MaterialList className="list items-list" component="div">
                { list.items.map((item, index) => (
                    <ListItem isViewOnly={isViewOnly} {...item} {...props} key={index}/>
                ))}
            </MaterialList> :  

            // Draggable editable list
            <DragDropContext style={styles.container} onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <MaterialList className="list items-list" component="div" ref={provided.innerRef} {...provided.draggableProps}>
                            { !isEmpty(list) && list.items !== null && list.items.map((item, index) => (
                                <Draggable draggableId={item._id} index={index} key={item._id}>
                                    {(provided, snapshot) => (
                                        <ListItem provided={provided} snapshot={snapshot} isViewOnly={isViewOnly} {...item} {...props} />
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

const AddItem = ({ refs, listId, addListItem }) => {
    const [inputValue, setInputValue] = useState("");

    const input = useRef(null);

    const addItem = (event) => {
        if (event) event.preventDefault(); // Prevent form submission

        if (inputValue !== "") addListItem(listId, inputValue);

        setInputValue("");

        input.current.focus();
    }

    return (
        <div className="add-item-container" ref={refs.addItemContainer}>
            <form onSubmit={event => addItem(event)}>
                <Input placeholder="Föremål" value={inputValue} onChange={event => setInputValue(event.target.value)} ref={input} autoCapitalize="on"/>

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