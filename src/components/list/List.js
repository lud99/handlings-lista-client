import React from 'react';

import { List as MaterialUIList } from '@material-ui/core';
import { connect } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorderListItems } from '../../redux/user';

import ListItem from './ListItem';
import history from '../../history';

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

        reorderListItems({ 
            listId: list._id, 
            sourceIndex: result.source.index, 
            destinationIndex: result.destination.index,
            reorderedItems: reorderedItems 
        });
    }

    return (
        <>
            { resetDrag ? 
            
            <></> : 
            
            (editMode || isViewOnly) ?

            // Static editable list
            list.items != null && <MaterialUIList className="list items-list" component="div">
                { list.items.map((item, index) => (
                    <ListItem isViewOnly={isViewOnly} {...item} {...props} key={index}/>
                ))}
            </MaterialUIList> :  

            // Draggable editable list
            <DragDropContext style={styles.container} onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <MaterialUIList className="list items-list" component="div" ref={provided.innerRef} {...provided.draggableProps}>
                            { list.items && list.items.map((item, index) => (
                                <Draggable draggableId={item._id} index={index} key={item._id}>
                                    {(provided, snapshot) => (
                                        <ListItem provided={provided} snapshot={snapshot} isViewOnly={isViewOnly} {...item} {...props} />
                                    )}
                                </Draggable>)
                            )}
                            {provided.placeholder}
                        </MaterialUIList>
                    )}
                </Droppable>
            </DragDropContext> 
            }
        </>
    )
}

const styles = {
    container: {
        height: "calc(100vh - 56px)"
    }
}

const mapStateToProps = state => ({ 
    editMode: state.editMode
});

const mapDispatch = { reorderListItems }

export default connect(mapStateToProps, mapDispatch)(List);