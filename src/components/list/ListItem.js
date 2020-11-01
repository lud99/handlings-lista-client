import React, { useRef, forwardRef } from 'react';

import { ListItem, ListItemText, Divider, IconButton } from '@material-ui/core';
import { toggleListItemCompleted, removeListItem, makeGetListItemFromId } from '../../redux/user';
import { getCurrentList } from '../../redux/currentList';
import { connect } from 'react-redux'

import Grow from '@material-ui/core/Grow';
import DragHandle from '@material-ui/icons/DragHandle';
import EditIcon from '@material-ui/icons/Edit';

import Text from './ListItemText';
import Delete from '../Delete';
import Utils from '../../Utils';

const Item = (props) => { 
    const { _id, text, listId, completed } = props.item;

    const { toggleListItemCompleted, editMode, viewOnly, snapshot, provided, removeListItem, listCompleted } = props;

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
    if (provided && provided.draggableProps.style.transform) {
        try {
            const y = provided.draggableProps.style.transform.split(", ")[1].split(")")[0];
            provided.draggableProps.style.transform = `translate(0px, ${y})`;
        } catch {}
    }

    return (
        <div className="listItem" ref={ref} {...draggableProps} {...listItemHandleProps}>
            <ListItem button style={styles.item(isDragging, completed)} onClick={click}>
                { editMode ? 
                
                <Text item={props.item} ref={nameInput} editIconElement={editIconElement} /> :
                <ListItemText primary={textFormatted} className="listItemText" /> }

                { !viewOnly && <div className="editContainer">
                    <Handle enabled={!editMode && !listCompleted} dragHandle={dragHandleProps} /> 
                    <ItemEdit enabled={editMode && !listCompleted} text={textFormatted} ref={editIconElement} onClick={focusOnText} />
                    <Delete enabled={editMode && !listCompleted} className="listItemDelete" onClick={remove} />
                </div> }
            </ListItem>
            <Divider style={styles.divider(completed)} />
        </div>
    )
};

var Handle = ({ enabled, dragHandle}) => {
    const click = (event) => event.stopPropagation();

    return (
        <Grow in={enabled} {...dragHandle}>
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
/*
class ItemHandler extends Component {
    shouldComponentUpdate(nextProps) {
        const props = this.props;

        // Don't rerender if neither the completed state, the text has changed, the drag position has changed or the items drag state has changed
        /*if (props.provided) {
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
        }*/
    /*

        return true;
    }

    render() { return <Item {...this.props} /> }
}*/

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

const makeMapStateToProps = () => {
    const getListItemFromId = makeGetListItemFromId();

    const mapStateToProps = (state, props) => ({ 
        editMode: state.editMode,
        viewOnly: state.viewOnly,
        item: getListItemFromId(state, props),
        listCompleted: getCurrentList(state).completed
    });

    return mapStateToProps;
}

const mapDispatch = { toggleListItemCompleted, removeListItem }

export default connect(makeMapStateToProps, mapDispatch)(Item);