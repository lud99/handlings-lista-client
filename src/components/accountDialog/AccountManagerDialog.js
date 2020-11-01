import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux'

import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, ListItem, 
} from '@material-ui/core';

import { setAccounts, addAccount, setAccount, deleteAccount } from '../../redux/accounts';
import { setShowManageAccountsDialog} from '../../redux/basic/showAccountDialog';

import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

import Delete from '../Delete';

import Utils from '../../Utils';

const AccountManagerDialog = ({ isOpen, setOpen, accounts, setAccounts, setAccount, addAccount, deleteAccount }) => {
    const [initialAccounts, setInitialAccount] = useState(accounts);

    const handleClose = () => setOpen(false);

    useEffect(() => {
        // Prevent scrolling on ios
        document.body.style.position = "fixed";

        // Return a function that restores the body's position to the default
        // when this component unmounts
        return () => {
            document.body.style.position = ""; 
        }
    }, []);

    const handleCancel = () => {
        setAccounts(initialAccounts);

        setOpen(false);
    }

    const handleSave = () => {
        // Only save accounts that have a pin
        const filteredAccounts = accounts.filter(account => account.pin);
        setAccounts(filteredAccounts);

        localStorage.setItem("accounts", JSON.stringify(filteredAccounts));

        setOpen(false);
    }

    return (
        <div>
            <Dialog open={isOpen} onClose={handleClose} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Hantera konton</DialogTitle>
                <DialogContent>
                    <List>
                        { accounts && accounts.map((account, index) => (
                            <AccountEditItem 
                                {...account} 
                                setAccount={setAccount} 
                                deleteAccount={deleteAccount}
                                key={index} />
                        ))}

                        <NewAccountButton pin="" comment="" addAccount={addAccount} />
                        
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="primary">
                        Avbryt
                    </Button>

                    <Button onClick={handleSave} color="primary">
                        Spara
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const AccountEditItem = ({ comment, pin, id, setAccount, deleteAccount }) => {
    const handlePinInputChange = (event) => setAccount({ pin: event.target.value, comment, id });
    const handleCommentInputChange = (event) => setAccount({ pin, comment: event.target.value, id });

    const handleDelete = () => deleteAccount({ id }); 

    const inputStyle = { display: "inline-block", padding: "0 1rem 1rem 0" }

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <ImageIcon />
                </Avatar>
            </ListItemAvatar>

            <div>
                <div style={inputStyle}>
                    <TextField label="Pinkod" value={pin || ""} onChange={handlePinInputChange} />
                </div>
                <div style={inputStyle}>
                    <TextField label="Kommentar" value={comment || ""} onChange={handleCommentInputChange} />
                </div>
            </div>
            <Delete onClick={handleDelete}/>
        </ListItem>
    );
}

const NewAccountButton = ({ addAccount }) => {
    return (
        <ListItem>
            <Button onClick={() => addAccount({ id: Utils.createId() })} color="primary">
                Nytt konto
            </Button>
        </ListItem>
    );
}

const mapStateToProps = state => ({
    isOpen: state.showAccountDialog.manageAccounts,
    accounts: state.accounts,
    lists: state.user.lists,
    loggedIn: state.user.loggedIn
});

const mapDispatch = { 
    setAccounts, 
    addAccount, 
    setAccount, 
    deleteAccount,
    setOpen: setShowManageAccountsDialog 
};

export default connect(mapStateToProps, mapDispatch)(AccountManagerDialog);