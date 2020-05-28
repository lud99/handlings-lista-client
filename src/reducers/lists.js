import { ADD_LIST, REMOVE_LIST, RENAME_LIST } from '../actions/lists';

const lists = (state = { byIds: [], allIds: [] }, action) => {
    switch (action.type) {
        case ADD_LIST:
            return {
                byIds: {
                    ...state.byIds,
                    [action.id]: {
                        name: action.name,
                        id: action.id
                    }
                },
                allIds: [
                    ...state.allIds,
                    action.id
                ]
            }

        case REMOVE_LIST:
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

        case RENAME_LIST:
            return Object.assign({}, state, {
                byIds: {
                    ...state.byIds,
                    [action.id]: {
                        ...state.byIds[action.id],
                        name: action.name,
                    }
                },
            })
            
        default:
            return state
    }
}

export default lists;