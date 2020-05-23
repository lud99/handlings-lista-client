import React, { useEffect } from 'react';

import { Link } from "react-router-dom";

import Button from '@material-ui/core/Button';

import history from '../../history';

import '../../css/Login.css';

const LoginPage = ({ pin, enterPin, login, isOffline }) => {
    const enterPinClick = () => {
        const pin = window.prompt("Skriv in PIN");

        if (pin) enterPin(pin);
    }

    useEffect(() => {
        // Don't make the body fixed (causes problems with scrolling)
        document.body.style.position = "";
        
        // Disable scrolling on ios
        window.Utils.addResizeListener(async () => {
            const buttonContainer = document.getElementById("button-container");

            if (!buttonContainer) return;

            const app = document.querySelector(".app");

            // Reset styles that rely on the scroll for an accurate result
            app.style.paddingBottom = "";
            buttonContainer.style.marginBottom = "";

            // Should enable scroll
            if (await window.Utils.shouldScroll()) {
                document.body.style.position = "relative";
                document.body.style.overflow = "auto";

                app.style.height = "auto";
                app.style.paddingBottom = "1rem";

                buttonContainer.style.marginBottom = "2rem";
            } else { // Should disable scroll
                document.body.style.position = "fixed";

                app.style.paddingBottom = "";

                buttonContainer.style.marginBottom = 0;
            }
        });
    }, []);

    const loginClick = (event) => {
        event.preventDefault();
        
        // If already logged in
        if (login(pin, () => history.push("/home"))) // Go to home when logged in
            history.push("/home"); // Go to home if already logged in
    }

    return (
        <div className="container" style={styles.container}>
            <h1 className="pin-title">Kontots PIN</h1>
            <p className="pin">{pin || "Laddar PIN..."}</p>
            <p className="pin-description">
                Denna PIN är unik till ditt konto. <br /> 
                Använd den på andra enheter för att länka samman dem
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
    );
}

const styles = {
    container: {
        padding: "1rem"
    }
}

export default LoginPage;