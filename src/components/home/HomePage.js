import React, { useEffect } from 'react';

import { connect } from 'react-redux'

import { List as MaterialUIList, Fab } from '@material-ui/core';

import { createList } from '../../redux/user';
import { setCurrentListId } from '../../redux/currentList';

import AddIcon from '@material-ui/icons/Add';
import Header from '../header/Header';
import LoadingBackdrop from '../LoadingBackdrop';
import WebSocketConnection from '../../WebSocketConnection';
import List from './List';

import './Home.css';

const Home = (props) => {
    const { lists, pin, shouldLoad, editMode, createList, setCurrentListId } = props;

    useEffect(() => { 
        setCurrentListId(null);
        
        WebSocketConnection.login(); 
    
    }, []);

    const addListClick = () => {
        const name = prompt("Namn på listan:");

        if (name) createList({ name, pin });
    }

    return (
        <>
            { (!lists || shouldLoad) && <LoadingBackdrop isEnabled={true} /> }

            <Header title="Listor" useEditButton={true} />

            <MaterialUIList className="list" component="div"> 
                { lists && (lists.length === 0 ?
                // No lists
                <p className="noLists">Klicka på plusset för att skapa din första lista</p> : 
                        
                // Lists
                lists.map(list => <List list={list} key={list._id} editMode={editMode} />)) }
            </MaterialUIList>
            

            <Fab color="primary" aria-label="add" size="large" className="addButton" accessKey="+" onClick={addListClick}>
                <AddIcon />
            </Fab> 
        </>
    )
}

const mapStateToProps = state => ({
    lists: state.user.lists,
    shouldLoad: state.shouldLoad,
    pin: state.user.pin,
    editMode: state.editMode,
})

const mapDispatch = { createList, setCurrentListId };

export default connect(mapStateToProps, mapDispatch)(Home);