import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { useSelector } from 'react-redux'
import { getCurrentList } from '../../redux/currentList';

import { setListCompleted, createList, removeCompletedItems } from '../../redux/user';
import { setShowListCompleteDialog } from '../../redux/showListCompleteDialog';

import WebSocketConnection from '../../WebSocketConnection';

import {
    Button, Dialog, DialogActions, DialogContent,
    DialogContentText, DialogTitle, RadioGroup, 
    Radio, FormControlLabel, FormControl, Collapse, CircularProgress
} from '@material-ui/core';
import history from '../../history';

const ListCompleteDialog = ({ setShowListCompleteDialog, setListCompleted }) => {
    const [selectedAction, setSelectedAction] = useState("clean");
    const [isLoading, setIsLoading] = useState(false);

    const list = useSelector(getCurrentList);

    useEffect(() => {
        // Prevent scrolling on ios
        document.body.style.position = "fixed";

        // Return a function that restores the body's position to the default
        // when this component unmounts
        return () => {
            document.body.style.position = ""; 
        }
    }, [])

    const handleClose = () => setShowListCompleteDialog(false);
    const handleChange = (event) => setSelectedAction(event.target.value);
    const handleContinue = () => {
        if (list) {
            if (selectedAction === "new") {
                setListCompleted({ _id: list._id, completed: true });

                WebSocketConnection.createList({ name: list.name + " (2)", items: list.items }, ({ data }) => {
                    setShowListCompleteDialog(false);

                    history.push("/list/" + data._id);
                });
            } else if (selectedAction === "clean") {
                WebSocketConnection.removeCompletedItems({ listId: list._id }, () => setShowListCompleteDialog(false));
            }

            setIsLoading(true);
        }
    };

    return (
        <div>
            <Dialog open={true} onClose={handleClose}>
                <DialogTitle id="form-dialog-title">Bra jobbat, du har handlat färdigt!</DialogTitle>
                <DialogContent>
                    <DialogContentText align="left" color="textPrimary">
                        Vad ska hända med den här listan nu?
                    </DialogContentText>

                    <FormControl component="fieldset">
                        <RadioGroup className="list-complete-action" align="left" name="nextAction" value={selectedAction} onChange={handleChange}>
                            <FormControlLabel value="clean" control={<Radio />} label="Ta bort alla inköpta varor ifrån listan" />
                            <FormControlLabel value="new" control={<Radio />} label="Skapa en ny lista med de icke-inköpta varorna och bocka av denna" />
                        </RadioGroup>
                    </FormControl>
    
                    <Collapse in={selectedAction === "new"}>
                        <DialogContentText align="left" className="listCompleteDialogWarning">
                            Denna lista kommer inte kunna redigeras längre
                        </DialogContentText>
                    </Collapse>
                </DialogContent>


                <DialogActions>
                    { !isLoading ? <>
                        <Button onClick={handleClose} color="primary">
                            Avbryt
                        </Button>
                        <Button onClick={handleContinue} autoFocus color="primary">
                            Fortsätt
                        </Button>
                    </> : 
                    
                    <CircularProgress size={20} style={{ marginRight: "28px", marginLeft: "24px" }}/> }

                </DialogActions>
            </Dialog>
        </div>
    )
}

const mapStateToProps = state => ({
    
});

const mapDispatch = { setShowListCompleteDialog, setListCompleted, createList, removeCompletedItems };

export default connect(mapStateToProps, mapDispatch)(ListCompleteDialog);