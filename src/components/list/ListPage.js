import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux'

import Header from '../header/Header';
import List from './List';
import AddItem from './AddItem';
import LoadingBackdrop from '../LoadingBackdrop';
import ReadOnlySnackbar from '../ReadOnlySnackbar';
import InvalidPinSnackbar from '../InvalidPinSnackbar';
import WebSocketConnection from '../../WebSocketConnection';
import Utils from '../../Utils';

import history from '../../history';

import '../../css/List.css';
import { Redirect } from 'react-router-dom';

const ListPage = (props) => {
    // Destructure the props
    const { 
        lists,
        listId, 
        getList,
        shouldLoad, 
        showReadOnlySnackbar, 
        setShowReadOnlySnackbar,
        isViewOnly, 
        setIsViewOnly } = props;

    const list = Utils.findList(lists, listId);

    const refs = {
        input: React.createRef(),
        addItemContainer: React.createRef(),
        list: React.createRef(),
    }

    useEffect(() => {
        WebSocketConnection.login();

        // Load the list if in view only mode (only this list)
        if (isViewOnly) {
            getList(listId);

            setShowReadOnlySnackbar(true); 
        }
    }, []);

    const invalidPinOnClose = () => isViewOnly && setShowReadOnlySnackbar(true); 

    const onInvalidPinLogin = ({ success }) => success && history.push(`/list/${list._id}`)

    return (
        <>
            { !list && <Redirect to="/home" /> }
            
            { shouldLoad && <LoadingBackdrop isEnabled={true} /> }

            { list &&
            
            <>
                <Header 
                    title={list.name} 
                    listId={list._id} 
                    useEditButton={true} 
                    useRenameList={true}                    
                    {...props} />

                <List list={list} {...props} />

                <AddItem refs={refs} listId={list._id} />

                { isViewOnly ? 
            
                <InvalidPinSnackbar 
                    onClose={invalidPinOnClose} 
                    onLogin={onInvalidPinLogin} /> :
                    
                !shouldLoad && <ReadOnlySnackbar 
                    isOpen={showReadOnlySnackbar} 
                    setOpen={setShowReadOnlySnackbar}
                    listId={list._id}
                    setIsViewOnly={setIsViewOnly} /> 
                }
            </>
        }
        </>
    );
}

const mapStateToProps = state => ({ 
    lists: state.user.lists,
    shouldLoad: state.shouldLoad
});

const mapDispatch = {  }

export default connect(mapStateToProps, mapDispatch)(ListPage);