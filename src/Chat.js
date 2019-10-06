import React from 'react';
import SendIcon from '@material-ui/icons/Send';
import InputAdornment from '@material-ui/core/InputAdornment';
import ChatIcon from '@material-ui/icons/Chat';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import Tooltip from '@material-ui/core/Tooltip';
import './Chat.css';
import { TextField, Button } from '@material-ui/core';
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Fab from '@material-ui/core/Fab';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    fab: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
});
class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            to: "",
            friends: [],
            messages: [],
            form: {
                to: "",
                msgBody: "",
            },
            formError: {
                email: "",
                msgBody: ""
            },
            formValid: {
                email: false,
                msgBody: false,
                buttonActive: false
            },
            open: false
        };
    }

    handleSubmit = (e) => {
        const sendUrl = "http://localhost:3000/sendMessage";
        e.preventDefault();
        let to;
        if (this.state.open === false)
            to = this.state.to;
        else
            to = this.state.form.to;
        console.log(to);

        let sendObj = { from: localStorage.getItem('uEmail'), to: to, msgBody: this.state.form.msgBody };
        axios.post(sendUrl, sendObj)
            .then(response => {
                if (response.data) {
                    this.handleClose();
                    this.getFriends(false);
                    this.handleSelect(to);
                }
            }).catch(error => {
                console.log(error);
            })
    }

    handleOpen = () => {
        this.setState({ open: true })
    };

    handleClose = () => {
        this.setState({ open: false })
    };
    handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value });
        this.validateField(name, value);
    }
    getFriends = (flag) => {
        if (localStorage.getItem('uEmail')) {
            const fromEmail = localStorage.getItem('uEmail');
            const getUrl = "http://localhost:3000/getFriends/" + fromEmail;
            axios.get(getUrl)
                .then(response => {
                    this.setState({ friends: response.data.data });
                    if (flag)
                        this.handleSelect(response.data.data[0])
                }).catch(error => {
                    console.log(error.message);
                })
        }
    }
    componentDidMount = () => {
        this.getFriends(true);
        this.interval = setInterval(() => this.handleSelect(this.state.to), 15000);
    }
    componentWillUnmount = () => {
        clearInterval(this.interval);
    }
    handleSelect = (email) => {
        const getMessagesUrl = "http://localhost:3000/getMessages/" + localStorage.getItem('uEmail') + '/' + email;
        axios.get(getMessagesUrl)
            .then(response => {
                this.setState({ messages: response.data.data, to: email, form: { to: "", msgBody: "" } });
            }).catch(error => {
                console.log(error.message);
            })
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
            case "to":
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
                break;
            case "msgBody":
                if (value === "") {
                    formError.msgBody = "Message Cannot be empty!";
                    formValid.msgBody = false;
                }
                else {
                    formError.msgBody = "";
                    formValid.msgBody = true;
                }
                break;
            default: break;
        }
        formValid.buttonActive = formValid.msgBody && formValid.email;
        this.setState({ formError, formValid });
    }
    render() {
        const { classes } = this.props;
        const form = this.state.form;
        const formError = this.state.formError;
        const uEmail = localStorage.getItem('uEmail');
        // setInterval(() => { this.handleSelect(this.state.to), 2000 })
        return (

            <React.Fragment>
                {localStorage.getItem('uName') && localStorage.getItem('uEmail') && <React.Fragment>
                    <div className="container clearfix setBackground">
                        <div className="people-list" id="people-list"><br />
                            <Tooltip title="Compose" className={'center'}>
                                <Fab className={classes.fab}>
                                    <ChatIcon color="primary" fontSize="large" onClick={this.handleOpen} />
                                </Fab>
                            </Tooltip>
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                className={classes.modal}
                                open={this.state.open}
                                onClose={this.handleClose}
                                closeAfterTransition
                                BackdropComponent={Backdrop}
                                BackdropProps={{
                                    timeout: 500,
                                }}
                            >
                                <Fade in={this.state.open}>
                                    <div className={classes.paper}>
                                        <form onSubmit={this.handleSubmit}>
                                            <div className="row justify-content-center">
                                                <FormControl margin="normal" required className={classes.input} >
                                                    {/* <InputLabel htmlFor="uemail">Email address</InputLabel> */}
                                                    <TextField autoComplete="Email" autoFocus type="Email" className={classes.textField} label="Email *"
                                                        id="uemail" name="to" variant="outlined"
                                                        value={form.email} onChange={this.handleInputChange} />
                                                    <span className="text-danger">{formError.email}</span>
                                                </FormControl>
                                                <FormControl margin="normal" required className={classes.input} >
                                                    {/* <InputLabel htmlFor="uname">Name</InputLabel> */}
                                                    <TextField autoComplete="name"
                                                        id="msgBody" name="msgBody" variant="outlined" label="Message *"
                                                        value={form.msgBody} onChange={this.handleInputChange} />
                                                    <span className="text-danger">{formError.msgBody}</span>
                                                </FormControl>
                                            </div>
                                            <Button type="submit"
                                                color='primary'
                                                variant="contained"
                                                name='Send'
                                                disabled={!this.state.formValid.buttonActive}>Send</Button>
                                        </form>
                                    </div>
                                </Fade>
                            </Modal>
                            <List className="clearfix" component="nav-friends" aria-label="Chat Friends List">
                                {this.state.friends.length > 0 && this.state.friends.map((element, key) =>
                                    <ListItem className="about" key={key} onClick={() => { this.handleSelect(element) }} button>
                                        <AccountCircleRoundedIcon />
                                        <ListItemText className="name" primary={element} />
                                    </ListItem>
                                )}
                            </List>
                        </div>
                        <div className="chat">
                            <div className="chat-header clearfix">
                                <div className="chat-about">
                                    <div className="chat-with">Chat with {this.state.to}</div>
                                </div>
                                <i className="fa fa-star"></i>
                            </div>

                            <div className="chat-history">
                                <ul>
                                    {this.state.messages.length > 0 && this.state.messages.map((element, key) => {
                                        return (
                                            element.msgFrom === uEmail ? (<li key={key} className="clearfix">
                                                <div className="message-data align-right">
                                                    <span className="message-data-time" >{element.createdOn}</span> &nbsp; &nbsp;
<span className="message-data-name" >{element.msgFrom}</span> <i className="fa fa-circle me"></i>

                                                </div>
                                                <div className="message other-message float-right">
                                                    {element.msg}
                                                </div>
                                            </li>) : (<li key={key}>
                                                <div className="message-data">
                                                    <span className="message-data-name">{uEmail}<i className="fa fa-circle online"></i></span>
                                                    <span className="message-data-time">{element.createdOn}</span>
                                                </div>
                                                <div className="message my-message">
                                                    {element.msg}
                                                </div>
                                            </li>))
                                    })}
                                </ul>
                            </div>
                            <div className="chat-message clearfix">
                                <TextField fullWidth multiline variant="outlined" name="msgBody" value={form.msgBody} onChange={this.handleInputChange} id="message-to-send" placeholder="Type your message"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Fab size="small" className={classes.fab} disabled={!this.state.formValid.msgBody}>
                                                    <SendIcon name="SendIcon" onClick={this.handleSubmit} />
                                                </Fab>
                                            </InputAdornment>
                                        ),
                                    }}
                                >
                                </TextField>
                                <span className="text-danger">{formError.msgBody}</span>

                            </div>
                        </div>
                    </div>
                </React.Fragment>}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Chat);
