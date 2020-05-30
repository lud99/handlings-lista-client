import React from 'react';

import { connect } from 'react-redux'
import { Typography } from '@material-ui/core';

// TODO: rename list

import TitleInput from './TitleInput';

const Title = ({ titleFormatted, listId, useRenameList, editMode, isViewOnly }) => {  
    return (
        <Typography variant="h6" className="title" style={styles.title(isViewOnly)}>
            { (editMode && useRenameList) ? 
                // Input
                <TitleInput title={titleFormatted} listId={listId} /> :
                // Static text
                titleFormatted
            }
        </Typography>
    )
}


const styles = {
    title: (isViewOnly) => ({
        width: `calc(100% - ${!isViewOnly ? 64 : 0}px)`
    })
}

export default Title;