import React from 'react';

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { Link } from "react-router-dom";

import { Typography, Button } from '@material-ui/core'

import Header from './Header';

import './Start.css';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: "#fec619",
            contrastText: "#000",
        },
        secondary: {
            main: '#daaf13',
            contrastText: "#fff",
        },
    },
});

const CTAButton = () => (
    <Button component={Link} to="/login" variant="contained" color="inherit" className="create-list-button">Skapa familjens lista</Button>
)

const App = () => { 
    return ( 
        <ThemeProvider theme={theme}>
            <div className="App">
                <Header theme={theme} />

                <div className="main">
                    <div className="fullscreen">
                        <div className="background"></div>

                        <div className="main-left">
                            <div className="title-container">
                                <Typography variant="h1" className="title">Förenkla familjens inköp</Typography>

                                {/*<div className="edit-icon">
                                    <EditButton isOn={true} />
                                </div>*/}
                            </div>

                            <Typography variant="h4" className="title sub-title">
                                Samla alla inköp på ett och samma ställe där hela familjen kan hjälpas åt.
                                Alla ändringar visas omedelbart för familjen och den som är och handlar.
                            </Typography>
                        </div>
                        <div className="main-right-container">
                            <div className="main-right">
                                <div className="app-image"></div>
                            </div>
                        </div>

                        <div className="main-cta">
                            <CTAButton />
                        </div>

                        <div className="main-right-cta">
                            
                            <div className="main-cta2">
                                <CTAButton />
                            </div>
                                
                            <div className="main-right2">
                                <div className="app-image"></div>
                            </div>
                        </div>
                    </div>

                    <div className="app-description">
                        <div className="card">
                            <div className="card-image-container">
                                <div className="app-image"></div>
                            </div>

                            <div className="card-text">
                                <Typography variant="h2" className="card-title">Skapa inköpslistan tillsammans på ett ställe</Typography>
                                <p>
                                    Alla i familjen kan hjälpa till med vad som ska köpas, allt ifrån kvällens middag till lördagsgodiset.
                                    Aldrig mer behöver du skicka sms när något har ändrats. Bara att gå in på listan och lägga till det.<br/>

                                </p>
                            </div>
                        </div>
                        <div className="card white">
                            <div className="card-image-container">
                                <div className="app-image"></div>
                            </div>

                            <div className="card-text">
                                <Typography variant="h2" className="card-title">Uppdateras omedelbart</Typography>
                                <p>
                                    När någon kommer på att toalettpappret är slut och lägger till det så uppdateras med en gång för den som är och handlar.
                                    Så länge som listan är uppe kommer inget nytt missas att handlas. 
                                </p>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-image-container">
                                <div className="app-image"></div>
                            </div>

                            <div className="card-text">
                                <Typography variant="h2" className="card-title">Inget strul med konton och lösenord</Typography>
                                <p>
                                    Istället för att familjen ska behöva komma ihåg en e-mailadress och lösenord så används istället PIN koder.
                                    Bara att skriva in den på dina och familjens enheter och så är de sammanlänkade. Enklare kan det inte bli. 
                                </p>
                            </div>
                        </div>

                        <CTAButton />
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}

export default App;
