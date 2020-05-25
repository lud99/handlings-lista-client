import React from 'react';

import { Button, Snackbar, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import history from '../history';

const ReadOnlySnackbar = ({ isOpen, setOpen, login, listId }) => {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway')
            return;

        setOpen(false);
    };

    const loginClick = (event, reason) => {
        if (reason === 'clickaway')
            return;

        const pin = prompt("Skriv in PIN");

        if (pin) login(pin, ({ success }) => success && history.push(`/list/${listId}`));
    }

    return (
        <Snackbar
            className="readOnlySnackbar"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            open={isOpen}
            onClose={handleClose}
            message="Du visar denna lista i skrivskyddat läge. Den går inte att redigera om du inte loggar in"
            action={
                <>
                    <Button color="secondary" size="inherit" className="offlineSnackbarRetry" onClick={loginClick}>Logga in</Button>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                </>
            }
        />
    );
}

export default ReadOnlySnackbar;
