import React, { Component } from "react";
import axios from 'axios';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import Avatar from '@material-ui/core/Avatar';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';
const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(700 + theme.spacing(3) * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(0)}px ${theme.spacing(5)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(0),
        width: 60,
        height: 60,
        fontSize: '3rem',
        backgroundColor: 'inherit',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(1),
    },
    FormControl: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        [theme.breakpoints.down(700 + theme.spacing(3) * 2)]: {
            width: "281px",

        },
    },
    input: {
        paddingLeft: theme.spacing(2),
        width: "281px"
    }

});



class RegisterComponent extends Component {
    state = {
        form: {
            email: "",
            name: "",
            phoneNumber: "",
            password: ""
        },
        formError: {
            email: "",
            name: "",
            phoneNumber: "",
            password: ""
        },
        formValid: {
            email: false,
            name: false,
            phoneNumber: false,
            password: false,
            buttonActive: false
        },
        errorMessage: "",
        loading: false
    }
    

    handleInputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name
        this.setState({ form: { ...this.state.form, [name]: value } });
        this.validateField(name, value);
    }
    validateField = (fieldName, value) => {
        const formError = this.state.formError;
        const formValid = this.state.formValid;
        switch (fieldName) {
            case "email":
                if (value === "") {
                    formError.email = "Please enter email Id";
                    formValid.email = false;
                }
                else if (!value.match(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)) {
                    formError.email = "Enter valid Email Id";
                    formValid.email = false;
                }
                else {
                    formError.email = "";
                    formValid.email = true;
                }
                break
            case "name":
                if (value === "") {
                    formError.name = "Please enter Name";
                    formValid.name = false;
                }
                else if (value.length === 1) {
                    if (value === " " || !value.match(/^[A-Za-z]$/)) {
                        formError.name = "It can contain only alphabets and spaces. It should not start or end with a space. It can’t contain only spaces.";
                        formValid.name = false;
                    }
                    else {
                        formError.name = "";
                        formValid.name = true;
                    }
                }
                else if (!value.match(/^[A-Za-z]+[A-Za-z\s]*[A-Za-z]+$/)) {
                    formError.name = "It can contain only alphabets and spaces. It should not start or end with a space. It can’t contain only spaces.";
                    formValid.name = false;
                }
                else {
                    formError.name = "";
                    formValid.name = true;
                }
                break
            case "phoneNumber":
                const phoneRegex = /^[6-9][0-9]{9}$/;
                if (value === "") {
                    formError.phoneNumber = "Please enter Phone number";
                    formValid.phoneNumber = false;
                }
                else if (value.length !== 10) {
                    formError.phoneNumber = "Phone number should be of length 10";
                    formValid.phoneNumber = false;
                }
                else if (!value.match(phoneRegex)) {
                    formError.phoneNumber = "Please Enter Valid 10-digit Phone Number";
                    formValid.phoneNumber = false;
                }
                else {
                    formError.phoneNumber = "";
                    formValid.phoneNumber = true;
                }
                break
            case "password":
                let passRegex = new RegExp(/^(?=.*[A-Z])(?=.*[!@#$&*%&])(?=.*[0-9])(?=.*[a-z]).{7,20}$/);
                if (value === "") {
                    formError.password = "Please enter Password";
                    formValid.password = false;
                }
                else if (value.length < 7 || value.length > 20) {
                    formError.password = "Length of Password should be between 7 to 20 inclusive";
                    formValid.password = false;
                }
                else if (!passRegex.test(value)) {
                    formError.password = "It should contain at least one uppercase, at least one lowercase, at least one digit. It should also contain a special character amongst -! @, #, $, %, ^, &, * ";
                    formValid.password = false;
                }
                else {
                    formError.password = "";
                    formValid.password = true;
                }
                break
            default: break;
        }
        formValid.buttonActive = formValid.name && formValid.email && formValid.password && formValid.phoneNumber;
        this.setState({ formError, formValid });
    }
    submitRegisterUser = (event) => {
        event.preventDefault();
        const registerUrl = 'http://localhost:3000/register';
        this.setState(() => ({ loading: true }))
        axios.post(registerUrl, {
            uCredentials: {
                uEmail: this.state.form.email,
                uPass: this.state.form.password
            },
            uProfile: {
                uName: this.state.form.name,
                uPhone: this.state.form.phoneNumber
            }
        }).then((response) => {
            response = response.data.data;
            localStorage.setItem('uName', response.uName);
            localStorage.setItem('uEmail', this.state.form.email);
            window.location = "/chat"
        }).catch((error) => {
            this.setState(() => ({ errorMessage: error.message }));
        }).finally(() => {
            this.setState(() => ({ loading: false }))
        });
    }
    render() {
        const form = this.state.form;
        const formError = this.state.formError;
        const { classes } = this.props;
        return (
            <React.Fragment>
                {(this.state.loading) && <LinearProgress />}
                <br /><br />
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col">
                            <main className={classes.main}>
                                <CssBaseline />
                                {/* {JSON.stringify(this.state.formValid)} */}
                                <Paper className={classes.paper} style={{ marginTop: "-20px" }}>
                                    <Avatar className={classes.avatar}>
                                        <PersonAddRoundedIcon fontSize='inherit' htmlColor="gray" />
                                    </Avatar>
                                    <div className="row text-center">
                                        <Typography component="h1" variant="h5">
                                            Register
                            </Typography>
                                    </div>
                                    <form className={classes.form} onSubmit={this.submitRegisterUser}>
                                        <div className="row justify-content-center">
                                            <FormControl margin="normal" required className={classes.input} >
                                                {/* <InputLabel htmlFor="uemail">Email address</InputLabel> */}
                                                <TextField autoComplete="Email" autoFocus type="Email" className={classes.textField} label="Email *"
                                                    id="uemail" name="email" variant="outlined"
                                                    value={form.email} onChange={this.handleInputChange} />
                                                <span className="text-danger">{formError.email}</span>
                                            </FormControl>
                                            <FormControl margin="normal" required className={classes.input} >
                                                {/* <InputLabel htmlFor="uname">Name</InputLabel> */}
                                                <TextField autoComplete="name"
                                                    id="uname" name="name" variant="outlined" label="Name *"
                                                    value={form.name} onChange={this.handleInputChange} />
                                                <span className="text-danger">{formError.name}</span>
                                            </FormControl>
                                        </div>
                                        <div className="row  justify-content-center">
                                            <FormControl margin="normal" required className={classes.input}>
                                                <TextField autoComplete="password" type="password"
                                                    id="password" name="password" variant="outlined" label="Password *"
                                                    value={form.password} onChange={this.handleInputChange} />
                                                <span className="text-danger">{formError.password}</span>
                                            </FormControl>
                                            <FormControl margin="normal" required className={classes.input}>
                                                {/* <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel> */}
                                                <TextField autoComplete="phoneNumber" type="Number"
                                                    id="phoneNumber" name="phoneNumber" variant="outlined" label="Phone Number *"
                                                    value={form.phoneNumber} onChange={this.handleInputChange} />
                                                <span className="text-danger">{formError.phoneNumber}</span>
                                            </FormControl>
                                        </div>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                            disabled={!this.state.formValid.buttonActive}
                                        >Register
                                </Button>
                                        {this.state.errorMessage && <div className='text-danger'>{this.state.errorMessage}</div>}
                                    </form>
                                </Paper>
                            </main>
                        </div >
                    </div>
                </div>
            </React.Fragment>
        );
    }
}
RegisterComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default (withStyles(styles)(RegisterComponent));