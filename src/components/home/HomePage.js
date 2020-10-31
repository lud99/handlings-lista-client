import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux'

import { List as MaterialUIList, Fab } from '@material-ui/core';

import { setCurrentListId } from '../../redux/currentList';

import AddIcon from '@material-ui/icons/Add';
import Header from '../header/Header';
import LoadingBackdrop from '../LoadingBackdrop';
import WebSocketConnection from '../../WebSocketConnection';
import List from './List';
import CreateListDialog from './CreateListDialog';

import './Home.css';
import history from '../../history';

const Home = (props) => {
    const { lists, shouldLoad, editMode, setCurrentListId } = props;

    const [createListDialogOpen, setCreateListDialogOpen] = useState(false);

    useEffect(() => { 
        setCurrentListId(null);

        if (!localStorage.getItem("pin")) {
            history.replace("/login");
        } else {
            // Create a new pin if the stored pin is invalid
            WebSocketConnection.login(localStorage.getItem("pin"), ({ success }) => {
                if (!success) 
                    WebSocketConnection.resetStoredUser();
            }); 
        }
        // eslint-disable-next-line
    }, []);

    const createList = () => setCreateListDialogOpen(true);

    return (
        <>
            { (!lists || shouldLoad) && <LoadingBackdrop isEnabled={true} /> }

            <Header title="Listor" useEditButton={true} useSortButton={false} />

            { createListDialogOpen && <CreateListDialog setOpen={setCreateListDialogOpen} /> }

            <MaterialUIList className="list" component="div"> 
                { lists && (lists.length === 0 ?
                // No lists
                <p className="noLists">Klicka på plusset för att skapa er första lista</p> : 
                        
                // Lists
                lists.map(list => <List list={list} key={list._id} editMode={editMode} />)) }
            </MaterialUIList>
            

            <Fab color="primary" aria-label="add" size="large" className="addButton" onClick={createList}>
                <AddIcon />
            </Fab> 
        </>
    )
}

const mapStateToProps = state => ({
    lists: state.user.lists,
    shouldLoad: state.shouldLoad,
    editMode: state.editMode,
})

const mapDispatch = { setCurrentListId };

export default connect(mapStateToProps, mapDispatch)(Home);