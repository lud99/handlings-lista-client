import React from 'react';

import { List as MaterialUIList } from '@material-ui/core';
import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderListItems } from '../../redux/user';
import { getCurrentList } from '../../redux/currentList';
import { setResetDrag } from '../../redux/resetDrag';

import ListItem from './ListItem';

const List = (props) => {
    const { reorderListItems, viewOnly, resetDrag, setResetDrag } = props;

    const list = useSelector(getCurrentList);

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

        reorderListItems({ 
            listId: list._id, 
            sourceIndex: result.source.index, 
            destinationIndex: result.destination.index,
            reorderedItems: reorderedItems 
        });
    }

    // Don't render the list for a 'frame' to remove any dragged items. Then set the reset variable back to false so it renders normally
    if (resetDrag) {
        setResetDrag(false);

        return <></>
    }

    return (
        <>
        { (list && list.items.length === 0) ? 
            <MaterialUIList className="list items-list" component="div">
                <p className="noLists">Denna lista är tom. När någon lägger till en vara kommer den att visas här</p>
            </MaterialUIList>
            : 

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <MaterialUIList className="list items-list" component="div" ref={provided.innerRef} {...provided.draggableProps}>
                        { list && list.items.map((item, index) => (
                            <Draggable draggableId={item._id} index={index} key={item._id} isDragDisabled={viewOnly}>
                                {(provided, snapshot) => (
                                    <ListItem 
                                        provided={provided} 
                                        snapshot={snapshot} 
                                        id={item._id} />
                                    )
                                }
                        </Draggable>
                        ))}
                        {provided.placeholder}
                    </MaterialUIList>
                    )}
                </Droppable>
            </DragDropContext> }
        </>
    )
}

const mapStateToProps = state => ({ 
    viewOnly: state.viewOnly,
    resetDrag: state.resetDrag,
    list: getCurrentList(state)
});

const mapDispatch = { reorderListItems, setResetDrag }

export default connect(mapStateToProps, mapDispatch)(List);