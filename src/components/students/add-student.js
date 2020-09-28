import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

import { grades } from '../../resources';

const styles = theme => ({
  root: {
    margin: '20px'
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

class AddStudent extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.saveStudent = this.saveStudent.bind(this);
    this.newStudent = this.newStudent.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      id: null,
      name: "",
      grade: "",
      phoneNum: "",
      address:  "",
      notes: "",

      value: '',
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

  onChangeGrade(e) {
    const grade = e.target.value;
    this.setState({
      grade: grade,
      value: grade
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

  saveStudent() {
    var data = {
      name: this.state.name,
      grade: this.state.grade,
      phoneNum: this.state.phoneNum,
      address:  this.state.address,
      notes: this.state.notes
    };

    StudentDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          grade: response.data.grade,
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
  
  newStudent() {
    this.setState({
      id: null,
      name: "",
      grade: "",
      phoneNum: "",
      address:  "",
      notes: "",

      value: '',
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
    const { value, open } = this.state;
    
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
          className={classes.sub}
        >
          <Link
            to={"/Students"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          <Paper className={classes.sub}>
            <Grid container
              direction="column"
              justify="center"
              alignItems="flex-start"
            >
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-name" 
                  label="Student Name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                />
              </FormControl>

              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Year</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={value} 
                  onChange={this.onChangeGrade}
                >
                  <MenuItem value={grades[0]} >Year 2</MenuItem>
                  <MenuItem value={grades[1]} >Year 3</MenuItem>
                  <MenuItem value={grades[2]} >Year 4</MenuItem>
                  <MenuItem value={grades[3]} >Year 5</MenuItem>
                  <MenuItem value={grades[4]} >Year 6</MenuItem>
                  <MenuItem value={grades[5]} >Year 7</MenuItem>
                  <MenuItem value={grades[6]} >Year 8</MenuItem>
                  <MenuItem value={grades[7]} >Year 9</MenuItem>
                  <MenuItem value={grades[8]} >Year 10</MenuItem>
                  <MenuItem value={grades[9]} >Year 11</MenuItem>
                  <MenuItem value={grades[10]} >Year 12</MenuItem>
                  <MenuItem value={grades[11]} >Year 13</MenuItem>
                </Select>
              </FormControl>

              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-phoneNum" 
                  label="Student Phone Number"
                  value={this.state.phoneNum}
                  onChange={this.onChangePhoneNum}
                />
              </FormControl>

              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-address" 
                  label="Student Address"
                  value={this.state.address}
                  onChange={this.onChangeAddress}
                />
              </FormControl>

              <FormControl style={{width: '500px'}}>
                <TextField
                  id="student-notes"
                  label="Notes"
                  placeholder="Anything to note about the sutdent?"
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
                <Button style={{float: 'right', marginRight: "15px"}} variant="contained" color="primary" size="small" onClick={this.saveStudent}>
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
            <Button size="small" variant="contained" onClick={this.newStudent}>
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

export default withStyles(styles)(AddStudent)