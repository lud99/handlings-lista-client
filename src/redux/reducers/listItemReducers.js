import WebSocketConnection from '../../WebSocketConnection';

import Utils from '../../Utils';

const setLocalTextInLists = (lists) => (
    lists.map(list => (
        { ...list, items: list.items.map(item => (
            {...item, localText: item.text }
        )) } 
    ))
);

const setLocalTextInList = (list) => setLocalTextInLists([list]);

const reducers = {
    setListItems: (state, action) => {
        const list = Utils.findList(state.lists, action.payload._id);
        
        list.items = setLocalTextInList(list);
    },
    addListItem: (state, action) => {
        const list = Utils.findList(state.lists, action.payload.listId);

        list.items.push({ ...action.payload, localText: action.payload.text });
    },
    createListItem: (state, action) => {
        WebSocketConnection.send({
            type: "create-list-item",
            pin: state.pin,
            listId: action.payload.listId,
            text: action.payload.text
        });

        return state;
    },
    removeListItem: (state, action) => {
        if (!action.payload._id || !action.payload.listId) return state;

        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "remove-list-item",
                pin: state.pin,
                listId: action.payload.listId,
                itemId: action.payload._id, 
            });
        }  else { // Only remove the list when not sending to the server to avoid double deletion
            const items = Utils.findList(state.lists, action.payload.listId).items;

            // Find the index of the list in the array, then remove it 
            items.splice(items.indexOf(Utils.findList(items, action.payload._id)), 1);
        }
    },
    renameListItem: (state, action) => {
        const list = Utils.findList(state.lists, action.payload.listId);
        const item = Utils.findItem(list.items, action.payload._id);

        // Don't update the text if it's the same
        if (item.text === action.payload.text) return state;

        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "rename-list-item",
                pin: state.pin,
                listId: action.payload.listId,
                itemId: action.payload._id, 
                newText: action.payload.text
            });
        }

        item.text = action.payload.text;
    },
    renameListItemLocal: (state, action) => {
        const list = Utils.findList(state.lists, action.payload.listId);
        const item = Utils.findItem(list.items, action.payload._id);

        item.localText = action.payload.localText;
    },
    toggleListItemCompleted: (state, action) => {
        const list = Utils.findList(state.lists, action.payload.listId);
        if (!list || list.completed) return state;

        const item = Utils.findItem(list.items, action.payload._id);
        if (!item) return state;

        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "toggle-list-item-state",
                pin: state.pin,
                itemId: action.payload._id,
                listId: action.payload.listId,
            });
        }

        // Toggle the completed state if no completed value is specified, but otherwise use the specified value to avoid 'double toggling'
        item.completed = action.payload.completed === undefined ? !item.completed : action.payload.completed;
    },
    reorderListItems: (state, { payload }) => {
        const list = Utils.findList(state.lists, payload.listId);

        if (JSON.stringify(list.items) === JSON.stringify(payload.reorderedItems))
            return state;

        if (!payload.localOnly) {
            WebSocketConnection.send({
                type: "reorder-list-items",
                pin: state.pin,
                listId: payload.listId,
                itemOldPositionIndex: payload.sourceIndex,
                itemNewPositionIndex: payload.destinationIndex,
            }); 
        }

        // Set the items directly
        if (payload.reorderedItems)
            list.items = payload.reorderedItems;
        
        // All the ids for the list items are received, not item objects.
        // So it maps over all item ids, where it returns the found object with the same id
        if (payload.itemIds) 
            list.items = payload.itemIds.map(itemId => Utils.findItem(list.items, itemId));
    }
}

export default reducers;