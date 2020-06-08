import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux'
import { useSelector } from 'react-redux'
import { getCurrentList, setCurrentListId } from '../../redux/currentList';
import { getList } from '../../redux/user';
import { setShowReadOnlySnackbar } from '../../redux/showReadOnlySnackbar';

import Header from '../header/Header';
import List from './List';
import AddItem from './AddItem';
import LoadingBackdrop from '../LoadingBackdrop';
import ReadOnlySnackbar from '../ReadOnlySnackbar';
import InvalidPinSnackbar from '../InvalidPinSnackbar';
import WebSocketConnection from '../../WebSocketConnection';

import history from '../../history';

import './List.css';
import { Redirect } from 'react-router-dom';

const ListPage = (props) => {
    // Destructure the props
    const { 
        listId, 
        shouldLoad, 
        setShowReadOnlySnackbar,
        viewOnly,
        setCurrentListId } = props;

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
            // Otherwise login
            WebSocketConnection.login();
        }
    }, []);

    const invalidPinOnClose = () => viewOnly && setShowReadOnlySnackbar(true); 

    const onLogin = ({ success }) => success && history.push(`/list/${list._id}`);

    return (
        <>
            { !list && !shouldLoad && <Redirect to="/home" /> }
            
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
    showReadOnlySnackbar: state.showReadOnlySnackbar
});

const mapDispatch = { setCurrentListId, setShowReadOnlySnackbar }

export default connect(mapStateToProps, mapDispatch)(ListPage);