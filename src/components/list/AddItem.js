import React, { useState, useRef } from 'react';

import { Button } from '@material-ui/core';
import { connect } from 'react-redux'
import { createListItem } from '../../redux/user';

import Input from '../Input';

const AddItem = ({ refs, listId, pin, createListItem }) => {
    const [inputValue, setInputValue] = useState("");

    const input = useRef(null);

    const addItem = (event) => {
        if (event) event.preventDefault(); // Prevent form submission

        if (inputValue !== "") createListItem({ listId, pin, text: inputValue });

        setInputValue("");

        input.current.focus();
    }

    return (
        <div className="add-item-container" ref={refs.addItemContainer}>
            <form onSubmit={event => addItem(event)}>
                <Input placeholder="Föremål" value={inputValue} onChange={event => setInputValue(event.target.value)} ref={input} autoCapitalize="on"/>

                <Button variant="contained" className="button button-small" onClick={() => addItem()}>
                    Lägg till
                </Button>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({ 
    pin: state.user.pin
});

const mapDispatch = { createListItem }

export default connect(mapStateToProps, mapDispatch)(AddItem);