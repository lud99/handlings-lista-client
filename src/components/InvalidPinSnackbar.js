import React from 'react';

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import history from '../history';

const InvalidPinSnackbar = ({ isOpen, setOpen, login, onClose, onLogin = ({ success }) => success && history.push("/home")}) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);

        if (onClose) onClose();
    };

    const loginClick = (event, reason) => {
        if (reason === 'clickaway')
            return;

        const pin = prompt("Skriv in PIN");

        if (pin) login(pin, onLogin);
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

export default InvalidPinSnackbar;
