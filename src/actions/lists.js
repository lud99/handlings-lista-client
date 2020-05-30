export const SET_LISTS = "SET_LISTS";
export const ADD_LIST = "ADD_LIST"
export const REMOVE_LIST = "REMOVE_LIST";
export const RENAME_LIST = "RENAME_LIST";

export const setLists = (lists) => {
    return {
        type: SET_LISTS,
        lists: lists
    }
}

export const addList = (list) => {
    return {
        type: ADD_LIST,
        ...list
    }
}

export const removeList = (id) => {
    return {
        type: REMOVE_LIST,
        _id: id
    }
}

export const renameList = (name, id) => {
    return {
        type: RENAME_LIST,
        name: name,
        _id: id
    }
}