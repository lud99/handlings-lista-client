import React from 'react';

import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';

import InvalidPinSnackbar from '../InvalidPinSnackbar';

import history from '../../history';

import '../../css/Login.css';

const LoginPage = ({ pin, enterPin, login, isOffline, showInvalidPinSnackbar, setShowInvalidPinSnackbar }) => {
    const enterPinClick = () => {
        const pin = window.prompt("Skriv in PIN");

        if (pin) enterPin(pin);
    }

    const loginClick = (event) => {
        event.preventDefault();

        const toHome = (success) => {
            if (success) history.push("/home");
            
            setShowInvalidPinSnackbar(!success);
        }
        
        // If already logged in
        if (login(pin, toHome)) // Go to home when logged in
            toHome(true); // Go to home if already logged in
    }

    console.log("show", showInvalidPinSnackbar)

    return (
        <>
            <InvalidPinSnackbar 
                isOpen={showInvalidPinSnackbar} 
                setOpen={setShowInvalidPinSnackbar} 
                login={login} />

            <div className="loginContainer">
                <h1 className="pin-title">Kontots PIN</h1>
                <p className="pin">{pin || "Laddar PIN..."}</p>
                <p className="pin-description">
                    Denna PIN är unik till ditt konto. <br />
                    Skriv in den på dina andra enheter för att länka samman dem
                </p>

                <div id="button-container">
                    <Button 
                        variant="contained" 
                        className="button" 
                        component={Link} 
                        to="/home"
                        disabled={(!pin || isOffline) ? true : false}
                        onClick={loginClick}>
                        Fortsätt
                    </Button>
                    <Button 
                        variant="contained" 
                        className="button" 
                        disabled={(!pin || isOffline) ? true : false}
                        onClick={enterPinClick}>
                        Skriv in annan kod
                    </Button>
                </div>
            </div>
        </>
    );
}

export default LoginPage;