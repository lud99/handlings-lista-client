import React, { Component, useState, useEffect, useRef, forwardRef } from 'react';

import { ListItem, ListItemText, Divider, IconButton } from '@material-ui/core';

import DragHandle from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';

import Input from './Input';
import Delete from './Delete';

const Item = (props) => {
    const { _id, listId, text, completed, isViewOnly, snapshot, provided, toggleListItemCompleted, removeListItem, hideDeleteIcon } = props;

    const editIconElement = useRef(null);
    const nameInput = useRef(null);

    const click = () => toggleListItemCompleted(listId, _id); 

    const focusOnText = () => nameInput.current.focus();

    const textFormatted = window.Utils.capitalize(text);

    const isEditMode = snapshot !== null;

    // Make the item draggable if not in view only and the correct props exist
    if (snapshot && !isViewOnly) { 
        // Only allow vertical dragging
        if (provided.draggableProps.style.transform) {
            try {
                const y = provided.draggableProps.style.transform.split(", ")[1].split(")")[0];
                provided.draggableProps.style.transform = `translate(0px, ${y})`;
            } catch {}
        }

        return (
            <div className="listItem" ref={provided.innerRef} {...provided.draggableProps} >
                <ListItem button style={styles.item(snapshot.isDragging, completed)} onClick={click}>
                    <ListItemText primary={textFormatted} className="listItemText" />
                    <Handle {...provided.dragHandleProps} />
                </ListItem>
                <Divider style={styles.divider(completed)} />
            </div>
        );  
    // Make the item static if it is not in view only mode
    } else if (!isViewOnly) {
        return (
            <div className="listItem">
                <ListItem button style={styles.item(false, completed, isEditMode)}>
                    <Text {...props} ref={nameInput} editIconElement={editIconElement}/>
                    <div style={{ whiteSpace: "nowrap" }}>
                        <ItemEdit text={textFormatted} ref={editIconElement} onClick={focusOnText} /> 
                        <Delete onClick={() => removeListItem(listId, _id)} style={styles.deleteIcon(hideDeleteIcon)} {...props} />
                    </div>
                </ListItem>
                <Divider style={styles.divider(completed)} />
            </div>
        );  
    } else if (isViewOnly) { // Static, no editing (view only)
        return (
            <div className="listItem">
                <ListItem button style={styles.item(false, completed)}>
                    <ListItemText primary={textFormatted} className="listItemText" />
                </ListItem>
                <Divider style={styles.divider(completed)} />
            </div>
        );  
    }
};

Item.defaultProps = {
    hideDeleteIcon: false
}

const Handle = (props) => {
    const click = (event) => event.stopPropagation();

    return (
        <IconButton edge="end" className="listItemHandle" color="inherit" aria-label="move" onClick={click} {...props}>
            <DragHandle />
        </IconButton>
    )
}

const Text = forwardRef(({ listId, _id, text, localText, isAddItem, renameListItem, renameListItemLocal, editIconElement, addListItem }, inputElement) => {
    const [canRename, setCanRename] = useState(true);

    const placeholderText = "Lägg till ett föremål...";

    if (!isAddItem) 
        var [inputText, setInputText] = [
            localText != null ? localText : text, 
            (text) => renameListItemLocal(listId, _id, window.Utils.capitalize(text))
        ];
    else 
        var [inputText, setInputText] = useState("");

    useEffect(() => setInputText(text), [text]);

    // Listen for custom blur events
    useEffect(() => {
        inputElement.current.addEventListener("manualblur", () => {
            setCanRename(false);

            inputElement.current.blur();
        })
    }, []);

    const hideEditIcon = () => editIconElement.current.style.visibility = "hidden";
    const showEditIcon = () => {
        editIconElement.current.style.visibility = "";
        editIconElement.current.style.cursor = "default";
    }

    const submit = (event) => {
        event.preventDefault();

        inputElement.current.blur();
    }

    const rename = () => {
        // Refocus on the input if the text is empty
        if (inputText === "") return inputElement.current.focus();

        showEditIcon();

        if (!isAddItem) {
            if (canRename) renameListItem(listId, _id, inputText);
            else setCanRename(true);
        } else {
            if (canRename) addListItem(listId, inputText);
            else setCanRename(true);
        }
    }

    const inputTextFormatted = window.Utils.capitalize(inputText);

    return (
        <form onSubmit={submit}>
            {
                !isAddItem ? 
                    <Input className="listItemNameInput" 
                        value={inputTextFormatted} id={_id} ref={inputElement}
                        onChange={(event) => setInputText(event.target.value)}
                        onFocus={hideEditIcon}
                        onBlur={rename}
                        onClick={(event) => event.stopPropagation()} />
                : 
                    <Input className="listItemNameInput" 
                        placeholder={placeholderText} id={_id} ref={inputElement}
                        onChange={(event) => setInputText(event.target.value)}
                        onFocus={hideEditIcon}
                        onBlur={rename}
                        onClick={(event) => event.stopPropagation()} />
            }
        </form>
    );
});

const ItemEdit = forwardRef(({ onClick }, ref) => (
    <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" onClick={onClick} ref={ref}>
        <EditIcon  /> 
    </IconButton>
));

class ItemHandler extends Component {
    shouldComponentUpdate(nextProps) {
        const props = this.props;

        // Don't rerender if neither the completed state, the text has changed, the drag position has changed or the items drag state has changed
        if (props.provided) {
            if ((props.provided.draggableProps.style.transform === nextProps.provided.draggableProps.style.transform) &&
                (props.snapshot && props.snapshot.isDragging === nextProps.snapshot.isDragging)) {
                    if ((props.completed === nextProps.completed) && 
                        (props.text === nextProps.text) &&
                        (props.localText === nextProps.localText) &&
                        (props.editMode === nextProps.editMode)) {

                        return false
                    }
                }
        } else if ((props.completed === nextProps.completed) && 
                (props.text === nextProps.text) &&
                (props.localText === nextProps.localText) &&
                (props.editMode === nextProps.editMode)) {

            return false
        }
    

        return true;
    }

    render() { return <Item {...this.props} /> }
}

const styles = {
    item: function(isBeingDragged, completed, isEditMode = false) { 
        return { 
            backgroundColor: isBeingDragged ? `${completed ? "#95da56" : "#fff"}` : `${completed ? "var(--completed-color)" : "#fff"}`,
            paddingTop: isEditMode ? "0px" : "",
            paddingBottom: isEditMode ? "0px" : ""
        }
    },
    divider: (completed) => ({
        backgroundColor: completed ? "var(--completed-color)" : "",
        marginLeft: completed ? "0" : "1rem"
    }),
    deleteIcon: (hide) => ({
        visibility: hide ? "hidden" : "visible"
    })
}

export default ItemHandler;