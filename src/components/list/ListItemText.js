import React, { useState, useEffect, forwardRef } from 'react';

import { renameListItem, renameListItemLocal } from '../../redux/user';
import { connect } from 'react-redux'

import Input from '../Input';
import Utils from '../../Utils';

const Text = forwardRef(({ item, renameListItem, renameListItemLocal, editIconElement }, inputElement) => {
    const { listId, _id, text, localText } = item;

    const [canRename, setCanRename] = useState(true);

    const [inputText, setInputText] = [
        localText != null ? localText : text, 
        (text) => renameListItemLocal({ listId, _id, localText: Utils.capitalize(text) })
    ];

    useEffect(() => { 
        if (localText !== text) setInputText(text) // eslint-disable-next-line
    }, [text]);

    // Listen for custom blur events
    useEffect(() => {
        inputElement.current.addEventListener("manualblur", () => {
            setCanRename(false);

            inputElement.current.blur();
        }) // eslint-disable-next-line
    }, []);

    const hideEditIcon = () => editIconElement.current.style.visibility = "hidden";
    const showEditIcon = () => {
        editIconElement.current.style.visibility = "";
        editIconElement.current.style.cursor = "default";
    }

    const submit = (event) => {
        event.preventDefault();

        inputElement.current.blur();
    }

    const rename = () => {
        // Refocus on the input if the text is empty
        if (inputText === "") return inputElement.current.focus();

        showEditIcon();

        if (canRename) {
            if (text !== localText) renameListItem({ listId, _id, text: inputText });
        } else { 
            setCanRename(true);
        }
    }

    const inputTextFormatted = Utils.capitalize(inputText);

    return (
        <form onSubmit={submit}>
            <Input className="listItemNameInput" 
                value={inputTextFormatted} id={_id} ref={inputElement}
                onChange={(event) => setInputText(event.target.value)}
                onFocus={hideEditIcon}
                onBlur={rename}
                onClick={(event) => event.stopPropagation()} />
        </form>
    );
});

const mapStateToProps = state => ({ 
    pin: state.user.pin, 
    list: state.user.currentList,
});

const mapDispatch = { renameListItem, renameListItemLocal }

export default connect(mapStateToProps, mapDispatch, null, { forwardRef: true })(Text);