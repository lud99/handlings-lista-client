import React, { useState, useEffect, useRef } from 'react';

import { connect } from 'react-redux'

import {
    Button, TextField, Dialog, DialogActions, DialogContent, 
    DialogContentText, DialogTitle, ListItem, ListItemText, 
    RadioGroup, Radio, FormControlLabel, CircularProgress, Divider
} from '@material-ui/core';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

import { setShouldLoad } from '../../redux/shouldLoad';
import { logout } from '../../redux/user';
import { setShowInvalidPinSnackbar } from '../../redux/showInvalidPinSnackbar'
import { setShowChangeAccountDialog, setShowManageAccountsDialog } from '../../redux/basic/showAccountDialog';

import WebSocketConnection from '../../WebSocketConnection';

import AccountManagerDialog from './AccountManagerDialog';

import Utils from '../../Utils';

import history from '../../history';

const AccountDialog = ({ accounts, isOpen, setOpen, setManageDialogOpen, setShouldLoad, setShowInvalidPinSnackbar, logout, loggedIn }) => {
    const [isLoading, setIsLoading] = useState(false);

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

    const changeAccount = (pin) => {
        setIsLoading(true);
        setShouldLoad(true);

        if (pin) {
            // If already logged in
            if (loggedIn) {
                setIsLoading(false);
                setShouldLoad(false);

                setOpen(false);
            }
            
            WebSocketConnection.login(pin, ({ success }) => {
                if (!success) {
                    return setShowInvalidPinSnackbar(true);
                }
    
                localStorage.setItem("pin", pin);

                setIsLoading(false);
                setOpen(false);
    
                history.push("/home");
            });
        };
    }

    const handleManageAccountsClick = () => setManageDialogOpen(true);

    return (
        <div>
            <AccountManagerDialog />
            <Dialog open={isOpen} onClose={handleClose} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Välj ett konto</DialogTitle>
                <DialogContent>
                    <List>
                        { accounts.map((account, index) => (
                            <AccountItem {...account} key={index} onClick={() => changeAccount(account.pin)} />
                        ))}
                        <LogoutButton logout={logout} />
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleManageAccountsClick} color="primary">
                        Hantera konton
                    </Button>

                    { !isLoading ? 
                    <Button onClick={handleClose} color="primary">
                        Avbryt
                    </Button> :

                    <CircularProgress size={20} style={{ marginRight: "28px", marginLeft: "24px" }}/> }
                </DialogActions>
            </Dialog>
        </div>
    );
}

const AccountItem = ({ comment, pin, onClick }) => {
    const textStyle = { display: "block" };

    return (
        <ListItem button onClick={onClick}>
            <ListItemAvatar>
                <Avatar>
                    <ImageIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={pin} secondary={comment} 
                primaryTypographyProps={{ style: textStyle }} 
                secondaryTypographyProps={{ style: textStyle }} />
        </ListItem>
    );
}

const LogoutButton = ({ logout }) => {
    const handleClick = () => {
        logout(); 

        window.location = "/login";
    }

    return (
        <ListItem>
            <Button onClick={handleClick} color="primary">
                Logga ut
            </Button>
        </ListItem>
    );
}

const mapStateToProps = state => ({
    isOpen: state.showAccountDialog.changeAccount,
    manageDialogOpen: state.showAccountDialog.manageAccounts,
    lists: state.user.lists,
    loggedIn: state.user.loggedIn,
    accounts: state.accounts,
});

const mapDispatch = { 
    setShouldLoad, 
    setShowInvalidPinSnackbar, 
    setOpen: setShowChangeAccountDialog, 
    setManageDialogOpen: setShowManageAccountsDialog,
    logout 
};

export default connect(mapStateToProps, mapDispatch)(AccountDialog);