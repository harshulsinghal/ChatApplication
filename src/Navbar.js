import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import './App.css';
export default class Navbar extends Component {
    logout = () => {
        localStorage.clear();
        // this.props.history.push("./dashboard")
        window.location = "/dashboard"
    }
    render() {
        return (
            <React.Fragment>
                <nav className="navbar navbar-expand-lg navbar-light bg-custom">
                    <div className="container-fluid">
                        <NavLink className="navbar-brand mx-5" to='/dashboard'>
                            Chat Application
          </NavLink>
                        {(localStorage.getItem('uName') && localStorage.getItem('uEmail')) ? (
                            <React.Fragment>
                                <Box display="flex" flexDirection="row-reverse">
                                    <Box>
                                        <Tooltip title="Logout" className="mr-4">
                                            <IconButton aria-label="Logout" onClick={this.logout}>
                                                <PowerSettingsNewIcon htmlColor="aliceblue" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Box className='welcome'>
                                        <Typography variant="body1">
                                            <span className="mr-4">Welcome {localStorage.getItem('uName')}</span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </React.Fragment>)
                            : (<React.Fragment>

                                <Box display="flex" flexDirection="row-reverse">
                                    <Box>
                                        <NavLink className="mr-2" to="/login" >
                                            <Tooltip title="Login">
                                                <IconButton aria-label="Login">
                                                    <ExitToAppIcon htmlColor="aliceblue" />
                                                </IconButton>
                                            </Tooltip>
                                        </NavLink>
                                    </Box>
                                    <Box>
                                        <NavLink className="mr-5" to="/register" >
                                            <Tooltip title="Signup">
                                                <IconButton aria-label="Signup">
                                                    <PersonAddIcon htmlColor="aliceblue" />
                                                </IconButton>
                                            </Tooltip>
                                        </NavLink>
                                    </Box>
                                </Box>

                            </React.Fragment>)}
                    </div>
                </nav>
            </React.Fragment>



        );
    }
}