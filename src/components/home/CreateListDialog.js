import React, { useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'

import {
    Button, TextField, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, ListItem, ListItemText, 
    RadioGroup, Radio, FormControlLabel, CircularProgress, Divider
} from '@material-ui/core';

import WebSocketConnection from '../../WebSocketConnection';

import Utils from '../../Utils';

const CreateListDialog = ({ setOpen, lists }) => {
    const [listName, setListName] = useState(`Handla ${new Date().toLocaleDateString("sv")}`);
    const [listChooserOpen, setListChooserOpen] = useState(false);
    const [basedOnList, setBasedOnList] = useState("");
    const [isCreatingList, setIsCreatingList] = useState(false);
    const [listNameError, setListNameError] = useState(false);

    const handleClose = () => setOpen(false);

    /*// Set the list to be based on to the most recent one, if none is already specified
    useEffect(() => {
        if (!basedOnList) setBasedOnList(lists && lists[0])
        // eslint-disable-next-line
    }, [lists])*/

    useEffect(() => {
        if (listName) setListNameError(false);
    }, [listName])

    const listChooserOnClose = (listId) => {
        if (listId)
            setBasedOnList(Utils.findList(lists, listId))
        else if (listId === "") {
            setBasedOnList(null);
        }

        setListChooserOpen(false);
    }

    const createList = () => {
        if (!listName) return setListNameError(true);

        setIsCreatingList(true);

        WebSocketConnection.createList({ 
            name: listName, 
            items: basedOnList && basedOnList.items
        }, () => handleClose());
    }

    return (
        <div>
            <Dialog open={true} onClose={handleClose} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Skapa en lista</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Namn"
                        fullWidth
                        error={listNameError}
                        helperText={listNameError && "Ett namn måste anges"}
                        value={listName}
                        onChange={(event) => setListName(event.target.value)}
                    />
                    <DialogContentText>

                    </DialogContentText>
                    <ListItem className="create-list-select" button divider onClick={() => setListChooserOpen(true)}>
                        <ListItemText primary="Lista att utgå ifrån" secondary={basedOnList ? basedOnList.name : "Ingen"} />
                    </ListItem>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Avbryt
                    </Button>
                    { !isCreatingList ? 
                        <Button onClick={createList} color="primary">Skapa</Button> :

                        <CircularProgress size={20} style={{ marginRight: "28px", marginLeft: "24px" }}/>
                    }
                </DialogActions>
            </Dialog>
            {lists && <ListChooserDialog lists={lists} open={listChooserOpen} initialValue={basedOnList && basedOnList._id} onClose={listChooserOnClose} />}
        </div>
    );
}

const ListChooserDialog = ({ lists, onClose, open, initialValue }) => {
    const [value, setValue] = useState(initialValue);

    const radioGroupRef = useRef(null);

    useEffect(() => {
        if (!open) setValue(initialValue);
    }, [initialValue, open]);

    const handleEntering = () => radioGroupRef.current && radioGroupRef.current.focus();
    const handleCancel = () => onClose();
    const handleOk = () => onClose(value);
    const handleChange = (event) => setValue(event.target.value);

    return (
        <Dialog open={open} maxWidth="xs" fullWidth={true} onEntering={handleEntering}>
            <DialogTitle>Dina listor</DialogTitle>
            <DialogContent dividers>
                <RadioGroup onChange={handleChange} value={value} ref={radioGroupRef}>
                    <FormControlLabel  
                        label="Utgå inte ifrån någon lista"
                        value=""
                        control={<Radio />} />
                    <Divider />

                    {lists && lists.map(list => (
                        <FormControlLabel 
                            className="capitalize"
                            value={list._id} 
                            key={list._id} 
                            label={list.name}
                            control={<Radio />} />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = state => ({
    lists: state.user.lists
});

export default connect(mapStateToProps)(CreateListDialog);