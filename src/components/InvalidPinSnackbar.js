import React from 'react';

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import history from '../history';

const InvalidPinSnackbar = ({ isOpen, setOpen, login }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };

    const loginClick = (event, reason) => {
        if (reason === 'clickaway')
            return;

        const pin = prompt("Skriv in PIN");

        if (pin) login(pin, ({ success }) => success && history.push("/home"));
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
                        <CloseIcon fontSize="medium" />
                    </IconButton>
                </>
            }
        />
    );
}

export default InvalidPinSnackbar;
