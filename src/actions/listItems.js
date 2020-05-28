export const ADD_LIST_ITEM = "ADD_LIST_ITEM";
export const REMOVE_LIST_ITEM = "REMOVE_LIST_ITEM";
export const RENAME_LIST_ITEM = "RENAME_LIST_ITEM";

export const addListItem = (text, id, listId) => {
    return {
        type: ADD_LIST_ITEM,
        text: text,
        id: id,
        listId: listId
    }
}


export const removeListItem = (id) => {
    return {
        type: REMOVE_LIST_ITEM,
        id: id,
    }
}


export const renameListItem = (text, id) => {
    return {
        type: RENAME_LIST_ITEM,
        text: text,
        id: id
    }
}