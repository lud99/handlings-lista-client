import WebSocketConnection from '../../WebSocketConnection';
import Utils from '../../Utils';

const setLocalTextInLists = (lists) => (
    lists.map(list => (
        {
            ...list, items: list.items.map(item => (
                { ...item, localText: item.text }
            ))
        }
    ))
);

const reducers = {
    setLists: (state, action) => ({ ...state, lists: setLocalTextInLists(action.payload) }),
    addList: (state, action) => (
        {
            ...state, lists: [
                { ...action.payload, localText: action.payload.text },
                ...state.lists
            ]
        }
    ),
    createList: (state, action) => {
        WebSocketConnection.send({
            type: "create-list",
            name: action.payload.name,
            pin: state.pin
        });

        return state;
    },
    removeList: (state, action) => {
        if (!action.payload._id) return state;

        // Send the state update to the server
        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "remove-list",
                pin: state.pin,
                listId: action.payload._id,
            });
        } else { // Only remove the list when not sending to the server to avoid double deletion
            // Find the index of the list in the array, then remove it 
            state.lists.splice(state.lists.indexOf(Utils.findList(state.lists, action.payload._id)), 1);
        }
    },
    renameList: (state, action) => {
        // Find the list in the array, then rename it 
        const list = Utils.findList(state.lists, action.payload._id);

        if (state.name === action.payload.name) return state;

        // Send the state update to the server
        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "rename-list",
                pin: state.pin,
                listId: action.payload._id,
                newName: action.payload.name
            });
        }

        list.name = action.payload.name;
    },
    setListCompleted: (state, action) => {
        if (!action.payload._id) return state;

        // Send the state update to the server
        if (!action.payload.localOnly) {
            WebSocketConnection.send({
                type: "set-list-completed",
                pin: state.pin,
                listId: action.payload._id,
                completed: action.payload.completed
            });
        }

        return state;
    },
}

export default reducers;