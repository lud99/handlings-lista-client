import React, { useState, useRef } from 'react';

import { Button } from '@material-ui/core';
import { connect } from 'react-redux'
import { createListItem } from '../../redux/user';

import Input from '../Input';

const AddItem = ({ listId,  createListItem }) => {
    const [inputValue, setInputValue] = useState("");

    const input = useRef(null);

    const addItem = (event) => {
        if (event) event.preventDefault(); // Prevent form submission

        if (inputValue !== "") createListItem({ listId, text: inputValue });

        setInputValue("");

        input.current.focus();
    }

    return (
        <div className="add-item-container">
            <form onSubmit={event => addItem(event)}>
                <Input placeholder="Skriv din vara här" value={inputValue} onChange={event => setInputValue(event.target.value)} ref={input} />

                <Button variant="contained" className="button button-small" onClick={() => addItem()}>
                    Lägg till
                </Button>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({ 
    pin: state.user.pin,
    listId: state.currentList
});

const mapDispatch = { createListItem }

export default connect(mapStateToProps, mapDispatch)(AddItem);