import React, { useEffect } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { getCurrentList, setCurrentListId } from '../../redux/currentList';
import { setShowReadOnlySnackbar } from '../../redux/showReadOnlySnackbar';

import Confetti from 'react-dom-confetti';

import Header from '../header/Header';
import List from './List';
import AddItem from './AddItem';
import ListCompleteDialog from './ListCompleteDialog';
import LoadingBackdrop from '../LoadingBackdrop';
import ReadOnlySnackbar from '../ReadOnlySnackbar';
import InvalidPinSnackbar from '../InvalidPinSnackbar';
import WebSocketConnection from '../../WebSocketConnection';

import history from '../../history';

import './List.css';
import { Redirect } from 'react-router-dom';

const config = {
    angle: 90,
    spread: 360,
    startVelocity: "20",
    elementCount: "125",
    dragFriction: "0.15",
    duration: "7000",
    stagger: "1",
    width: "10px",
    height: "10px",
    perspective: "500px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"]
};

const ListPage = (
    { listId, shouldLoad, setShowReadOnlySnackbar, showListCompletedDialog, viewOnly, setCurrentListId } ) => {

    // eslint-disable-next-line
    useEffect(() => { setCurrentListId(listId) }, [])

    const list = useSelector(getCurrentList);

    useEffect(() => {
        // Load the list if in view only mode (only this list)
        if (viewOnly) {
            // Get the list
            WebSocketConnection.send({
                type: "get-list", 
                listId: listId, 
                joinSession: true 
            });

            setShowReadOnlySnackbar(true); 
        } else {
            // Otherwise login if a pin exists
            if (!localStorage.getItem("pin"))
                history.replace("/login");
            else
                WebSocketConnection.login(); 
        } // eslint-disable-next-line
    }, []);

    const invalidPinOnClose = () => viewOnly && setShowReadOnlySnackbar(true); 

    const onLogin = ({ success }) => success && history.push(`/list/${list._id}`);

    return (
        <>
            { !list && !shouldLoad && <Redirect to="/home" /> }

            <div className="confettiEffect">
                <Confetti active={showListCompletedDialog} config={config} />
            </div>
            
            { showListCompletedDialog && <ListCompleteDialog /> }
            
            { shouldLoad && <LoadingBackdrop isEnabled={true} /> }

            { list &&
            
            <>
                <Header useEditButton={true} useRenameList={true} useListDone={true} />
                <List />

                { !viewOnly && <AddItem /> }

                <InvalidPinSnackbar onClose={invalidPinOnClose} onLogin={onLogin} /> 
                    
                { !shouldLoad && <ReadOnlySnackbar /> } 
            </>
        }
        </>
    );
}

const mapStateToProps = state => ({ 
    lists: state.user.lists,
    shouldLoad: state.shouldLoad,
    viewOnly: state.viewOnly,
    showReadOnlySnackbar: state.showReadOnlySnackbar,
    showListCompletedDialog: state.showListCompletedDialog
});

const mapDispatch = { setCurrentListId, setShowReadOnlySnackbar }

export default connect(mapStateToProps, mapDispatch)(ListPage);