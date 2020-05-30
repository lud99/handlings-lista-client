import React from 'react';

import { connect } from 'react-redux'

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import history from '../history';

import WebSocketConnection from '../WebSocketConnection';

import { setShowInvalidPinSnackbar as setOpen } from '../redux/showInvalidPinSnackbar'

const InvalidPinSnackbar = ({ isOpen, setOpen, onClose, onLogin = ({ success }) => success && history.push("/home")}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        console.log("should close")

        setOpen(false);

        if (onClose) onClose();
    };

    const loginClick = (event, reason) => {
        if (reason === 'clickaway')
            return;

        const pin = prompt("Skriv in PIN");

        if (pin) WebSocketConnection.login(pin, onLogin);
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={isOpen}
            onClose={handleClose}
            message="Kunde inte logga in med den angivna PIN koden"
            action={
                <>
                    <Button color="secondary" size="medium" className="offlineSnackbarRetry" onClick={loginClick}>Försök igen</Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </>
            }
        />
    );
}

const mapStateToProps = state => ({ 
    isOpen: state.showInvalidPinSnackbar
});

const mapDispatch = { setOpen }

export default connect(mapStateToProps, mapDispatch)(InvalidPinSnackbar)