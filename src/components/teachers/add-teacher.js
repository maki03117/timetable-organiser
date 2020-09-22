import React, { Component } from "react";
import { Link } from "react-router-dom";
import TeacherDataService from "../../services/teacher.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';

const styles = theme => ({
  root: {
    margin: '10px'
  },
  sub: {
    '& > * .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    marginTop: '15px',
    padding: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
})

class AddTeacher extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.saveTeacher = this.saveTeacher.bind(this);
    this.newTeacher = this.newTeacher.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      id: null,
      name: "",
      phoneNum: "",
      address:  "",
      notes: "",

      submitted: false,
      open: false,
      message: ""
    };
  }
  
  onChangeName(e) {
    const name = e.target.value;

    this.setState({
      name: name
    });
  }

  onChangePhoneNum(e) {
    const phoneNum = e.target.value;

    this.setState({
      phoneNum: phoneNum
    });
  }

  onChangeAddress(e) {
    const address = e.target.value;

    this.setState({
      address: address
    });
  }

  onChangeNotes(e) {
    const notes = e.target.value;

    this.setState({
      notes: notes
    });
  }

  saveTeacher() {
    var data = {
      name: this.state.name,
      phoneNum: this.state.phoneNum,
      address:  this.state.address,
      notes: this.state.notes
    };

    TeacherDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          phoneNum: response.data.phoneNum,
          address: response.data.address,
          notes: response.data.notes,

          submitted: true,
          open: true,
          message: "Submitted Successfully!"
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  newTeacher() {
    this.setState({
      id: null,
      name: "",
      phoneNum: "",
      address:  "",
      notes: "",

      submitted: false,
      open: false,
      message: ""
    });
  } 

  handleClose() {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.sub}
        >
          <Link
            to={"/teachers"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          <Paper className={classes.sub}>
            <Grid container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-name" 
                  label="Teacher Name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                />
              </FormControl>

              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-phoneNum" 
                  label="Teacher Phone Number"
                  value={this.state.phoneNum}
                  onChange={this.onChangePhoneNum}
                />
              </FormControl>
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-address" 
                  label="Teacher Address"
                  value={this.state.address}
                  onChange={this.onChangeAddress}
                />
              </FormControl>
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="Teacher-notes"
                  label="Notes"
                  placeholder="Anything to note about the teacher?"
                  multiline
                  rows={3}
                  value={this.state.notes}
                  onChange={this.onChangeNotes}
                  variant="outlined"
                  margin="normal"
                />
              </FormControl>
              <Grid
                className={classes.formControl}
                style={{width: '100%'}}
              >
                <Button style={{float: 'right', marginRight: "15px"}} variant="contained" color="primary" size="small" onClick={this.saveTeacher}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
        </Grid>
        {this.state.submitted ? (
          <div className={classes.formControl}>
            <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
            </Snackbar>
            <Button size="small" variant="contained" onClick={this.newTeacher}>
              Add More
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(AddTeacher)