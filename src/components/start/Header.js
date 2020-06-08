import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    login: {
        fontSize: "1.25rem"
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
    const theme = useTheme();

    const classes = useStyles(theme);

    return (
        <div className={classes.root}>
            <AppBar position="static" color="secondary">
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" className={classes.title}>
                        
                    </Typography>
                   {/*} <Button variant="contained" color="inherit" className={classes.login}>Skapa din lista</Button>*/}
                </Toolbar>
            </AppBar>
        </div>
    );
}
