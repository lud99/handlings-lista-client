import React, { Component, useRef, forwardRef } from 'react';

import { ListItem, ListItemText, Divider, IconButton } from '@material-ui/core';
import { toggleListItemCompleted, removeListItem } from '../../redux/user';
import { connect } from 'react-redux'

import Grow from '@material-ui/core/Grow';
import DragHandle from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';

import Text from './ListItemText';
import Delete from '../Delete';
import Utils from '../../Utils';

const Item = (props) => { 
    const { _id, text, listId, completed } = props.item;

    const { toggleListItemCompleted, editMode, viewOnly, snapshot, provided, removeListItem } = props;

    const editIconElement = useRef();
    const nameInput = useRef();

    const click = () => !viewOnly && toggleListItemCompleted({ _id, listId }); 
    const remove = () => removeListItem({ _id, listId });
    const focusOnText = () => nameInput.current.focus();

    const textFormatted = Utils.capitalize(text);

    const ref = provided && provided.innerRef;
    const draggableProps = provided && provided.draggableProps;
    const dragHandleProps = provided && provided.dragHandleProps;
    const listItemHandleProps = viewOnly && dragHandleProps;
    const isDragging = snapshot && snapshot.isDragging;

    // Restrict movement to the y-axis only
    if (provided.draggableProps.style.transform) {
        try {
            const y = provided.draggableProps.style.transform.split(", ")[1].split(")")[0];
            provided.draggableProps.style.transform = `translate(0px, ${y})`;
        } catch {}
    }

    return (
        <>
            <div className="listItem" ref={ref} {...draggableProps} {...listItemHandleProps}>
                <ListItem button style={styles.item(isDragging, completed)} onClick={click}>
                    { editMode ? 
                    
                    <Text item={props.item} ref={nameInput} editIconElement={editIconElement} /> :
                    <ListItemText primary={textFormatted} className="listItemText" /> }

                    { !viewOnly && <div className="editContainer">
                        <Handle enabled={!editMode} dragHandle={dragHandleProps} /> 
                        <ItemEdit enabled={editMode} text={textFormatted} ref={editIconElement} onClick={focusOnText} />
                        <Delete enabled={editMode} className="listItemDelete" onClick={remove} />
                    </div> }
                </ListItem>
                <Divider style={styles.divider(completed)} />
            </div>
        </>
    )

    /*<ListItem button style={styles.item(false, completed, editMode)}>
                    <Text {...props} ref={nameInput} editIconElement={editIconElement}/>
                    <div style={{ whiteSpace: "nowrap" }}>
                        <ItemEdit text={textFormatted} ref={editIconElement} onClick={focusOnText} /> 
                        <Delete onClick={remove} style={styles.deleteIcon(hideDeleteIcon)} {...props} />
                    </div>
                </ListItem>
            <Divider style={styles.divider(completed)} /> */

    // Make the item draggable if not in view only and the correct props exist
    /*if (snapshot && !isViewOnly) { 
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
                <ListItem button style={styles.item(false, completed, editMode)}>
                    <Text {...props} ref={nameInput} editIconElement={editIconElement}/>
                    <div style={{ whiteSpace: "nowrap" }}>
                        <ItemEdit text={textFormatted} ref={editIconElement} onClick={focusOnText} /> 
                        <Delete onClick={remove} style={styles.deleteIcon(hideDeleteIcon)} {...props} />
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
    }*/
};

var Handle = ({ enabled, dragHandle}) => {
    const click = (event) => event.stopPropagation();

    return (
        <Grow in={enabled}{...dragHandle}>
            <IconButton edge="end" className="listItemHandle" color="inherit" aria-label="move" onClick={click} >
                <DragHandle />
            </IconButton>
        </Grow>
    )
}

const ItemEdit = forwardRef(({ onClick, enabled }, ref) => (
    <Grow in={enabled} >
        <IconButton edge="end" className="editButton" color="inherit" aria-label="edit" onClick={onClick} ref={ref}>
            <EditIcon  /> 
        </IconButton>
    </Grow>
));

class ItemHandler extends Component {
    shouldComponentUpdate(nextProps) {
        /*const props = this.props;

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
    */

        return true;
    }

    render() { return <Item {...this.props} /> }
}

const styles = {
    item: function(isBeingDragged, completed, editMode = false) { 
        return { 
            backgroundColor: isBeingDragged ? `${completed ? "#95da56" : "#fff"}` : `${completed ? "var(--completed-color)" : "#fff"}`,
            paddingTop: editMode ? "0px" : "",
            paddingBottom: editMode ? "0px" : ""
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

const mapStateToProps = state => ({ 
    editMode: state.editMode,
    viewOnly: state.viewOnly
});

const mapDispatch = { toggleListItemCompleted, removeListItem }

export default connect(mapStateToProps, mapDispatch)(Item);