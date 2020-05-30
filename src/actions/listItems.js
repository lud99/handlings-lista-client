export const SET_LIST_ITEMS = "SET_LIST_ITEMS";
export const ADD_LIST_ITEM = "ADD_LIST_ITEM";
export const REMOVE_LIST_ITEM = "REMOVE_LIST_ITEM";
export const RENAME_LIST_ITEM = "RENAME_LIST_ITEM";

export const setListItems = (listItems) => {
    return {
        type: SET_LIST_ITEMS,
        listItems: listItems
    }
}

export const addListItem = (listItem) => {
    return {
        type: ADD_LIST_ITEM,
        ...listItem
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