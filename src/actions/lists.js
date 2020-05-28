export const ADD_LIST = "ADD_LIST"
export const REMOVE_LIST = "REMOVE_LIST";
export const RENAME_LIST = "RENAME_LIST";

export const addList = (name, id) => {
    return {
        type: ADD_LIST,
        name: name,
        id: id
    }
}

export const removeList = (id) => {
    return {
        type: REMOVE_LIST,
        id: id
    }
}

export const renameList = (name, id) => {
    return {
        type: RENAME_LIST,
        name: name,
        id: id
    }
}