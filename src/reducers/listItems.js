import { ADD_LIST_ITEM, REMOVE_LIST_ITEM, RENAME_LIST_ITEM } from '../actions/listItems';

const listItems = (state = { byIds: [], allIds: [] }, action) => {
    switch (action.type) {
        case ADD_LIST_ITEM:
            return {
                byIds: {
                    ...state.byIds,
                    [action.id]: {
                        text: action.text,
                        completed: false,
                        listId: action.listId,
                        id: action.id
                    }
                },
                allIds: [
                    ...state.allIds,
                    action.id
                ]
            }

        case REMOVE_LIST_ITEM:
            const allIds = [
                ...state.allIds.slice(0, state.allIds.indexOf(action.id)), 
                ...state.allIds.slice(state.allIds.indexOf(action.id) + 1)
            ];

            return {
                byIds: {
                    ...allIds.map(id => state.byIds[id])
                },
                allIds: allIds
            }
        
        case RENAME_LIST_ITEM:
            return Object.assign({}, state, {
                byIds: {
                    ...state.byIds,
                    [action.id]: {
                        ...state.byIds[action.id],
                        text: action.text,
                    }
                },
            })
        
        default:
            return state
    }
}

export default listItems;