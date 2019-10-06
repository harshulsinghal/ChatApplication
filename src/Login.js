import React, { Component } from "react";
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(0)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(2),
        width: 60,
        height: 60,
        fontSize: '3rem',
        backgroundColor: 'gray',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
});

class LoginComponent extends Component {
    state = {
        form: {
            email: '',
            password: ''
        },
        formErrMsg: {
            email: '',
            password: '',
        },
        formValid: {
            email: false,
            password: false,
            buttonActive: false
        },
        notRegisterd: false,
        errorMessage: "",
        loading: false
    }


    handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ form: { ...this.state.form, [name]: value } });
        this.validateField(name, value);
    }

    validateField = (fieldName, value) => {
        var message;
        var { formErrMsg } = this.state;
        var { formValid } = this.state;

        switch (fieldName) {
            case 'email':
                let emailRegex = new RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
                value === "" ? message = "Please enter your email id" : emailRegex.test(value) ? message = "" : message = "Email id format is wrong"
                break;

            case "password":
                let passRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$/);
                value === "" ? message = "Please enter your password" : passRegex.test(value) ? message = "" : message = "Invalid password"
                break

            default:
                break;
        }
        //Form err message set
        formErrMsg[fieldName] = message;
        this.setState({ formErrMsg: formErrMsg });
        //Form Valid set
        message === "" ? formValid[fieldName] = true : formValid[fieldName] = false;
        formValid.buttonActive = formValid.email && formValid.password;
        this.setState({ formValid: formValid });
    }

    submitSignIn = (e) => {
        e.preventDefault();
        this.setState(() => ({ loading: true }))
        const loginUrl = 'http://localhost:3000/login';
        this.setState(() => ({ loading: true }))
        axios.post(loginUrl, {
            uEmail: this.state.form.email,
            uPass: this.state.form.password
        }).then((response) => {
            response = response.data.data;
            localStorage.setItem('uName', response.uName);
            localStorage.setItem('uEmail', this.state.form.email);
            window.location = '/chat';
    }).catch((error) => {
        this.setState(() => ({ errorMessage: error.message }));
    }).finally(() => {
        this.setState(() => ({ loading: false }))
    });
    }

handleClick = () => {
    this.setState({ notRegisterd: true });
}


render() {
    const { email, password } = this.state.form;
    const { formErrMsg } = this.state
    const { classes } = this.props;
    return (
        <React.Fragment>
            {this.state.notRegisterd && <Redirect to={"/register"} />}
            {(this.state.loading) && <LinearProgress />}
            <br></br><br />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-5 col-md-9">
                        <main className={classes.main} style={{ marginTop: "-20px" }}>
                            <CssBaseline />
                            <Paper className={classes.paper}>
                                <Avatar className={classes.avatar}>
                                    <AccountCircleRoundedIcon fontSize='inherit' />
                                </Avatar>
                                <div className="row text-center userSelector">
                                    <Typography component="h1" variant="h5">
                                        Login
                              </Typography>
                                </div>

                                <form className={classes.form} onSubmit={this.submitSignIn}>
                                    <FormControl margin="normal" required className={classes.input} fullWidth >
                                        <TextField autoComplete="uemail" autoFocus type="Email" className={classes.textField} label="Email *"
                                            id="uemail" name="email" variant="outlined"
                                            value={email} onChange={this.handleInputChange} />
                                        <span className="text-danger">{formErrMsg.email}</span>
                                    </FormControl>
                                    <FormControl margin="normal" required className={classes.input} fullWidth>
                                        <TextField autoComplete="password" type="password"
                                            id="password" name="password" variant="outlined" label="Password *"
                                            value={password} onChange={this.handleInputChange} />
                                        <span className="text-danger">{formErrMsg.password}</span>
                                    </FormControl>

                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        className={classes.submit}
                                        disabled={!this.state.formValid.buttonActive}
                                    >Login
                    </Button>
                    {this.state.errorMessage && <div className='text-danger'>{this.state.errorMessage}</div>}

                                </form><br />
                                <Link to="/register" exact={"true"} onClick={this.handleClick}>New to Hoopla? Create an account</Link><br />
                            </Paper>
                        </main>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}
}
LoginComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default (withStyles(styles)(LoginComponent));  