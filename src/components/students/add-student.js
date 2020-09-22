import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

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
    //this.handleChange = this.handleChange.bind(this);

    this.state = {
      id: null,
      name: "",
      grade: "",
      phoneNum: "",
      address:  "",
      notes: "",

      value: '',
      submitted: false
    };
  }
  
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangeGrade(e) {
    this.setState({
      grade: e.target.value,
      value: e.target.value
    });
  }

  onChangePhoneNum(e) {
    this.setState({
      phoneNum: e.target.value
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value
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

          submitted: true
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

      submitted: false
    });
  } 

  // handleChange(event) {
  //   this.setState({
  //     value: event.target.value
  //   });
  // };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    
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
            to={"/Students"}
            style={{ textDecoration: 'none', color: 'white' }}
            //className="badge badge-warning"
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
                  label="Student Name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                />
                {/* <InputLabel htmlFor="student-name">Student Name</InputLabel>
                <Input 
                  id="student-name" 
                  aria-describedby="my-helper-text" 
                  value={this.state.name}
                  onChange={this.onChangeName}
                  
                  fullWidth={true}
                /> */}
              </FormControl>
              <FormControl className={classes.formControl}>
                <InputLabel id="demo-simple-select-label">Grade</InputLabel>
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
                {/* <InputLabel htmlFor="Student-input">Student Phone Number</InputLabel>
                <Input 
                  id="Student-input" 
                  aria-describedby="my-helper-text" 
                  value={this.state.phoneNum}
                  onChange={this.onChangePhoneNum}
                  
                  fullWidth={true}
                /> */}
              </FormControl>
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-address" 
                  label="Student Address"
                  value={this.state.address}
                  onChange={this.onChangeAddress}
                />
                {/* <InputLabel htmlFor="Student-input">Student Address</InputLabel>
                <Input 
                  id="Student-input" 
                  aria-describedby="my-helper-text" 
                  value={this.state.address}
                  onChange={this.onChangeAddress}
                  
                  fullWidth={true}
                /> */}
              </FormControl>
              <FormControl style={{width: '500px'}}>
                {/* <InputLabel htmlFor="Student-input">Anything to note about the sutdent?</InputLabel>
                <Input 
                  id="Student-input" 
                  aria-describedby="my-helper-text" 
                  value={this.state.notes}
                  onChange={this.onChangeNotes}
                  
                  fullWidth={true}
                /> */}
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

                  // fullWidth={true}
                />
              </FormControl>
                <Grid
                  className={classes.sub}
                >
                  <Button style={{textAlign: 'right', paddingRight: '10px'}} variant="contained" color="primary" size="small" onClick={this.saveStudent}>
                    Submit
                  </Button>
                </Grid>

            </Grid>
          </Paper>
          
        </Grid>
        {this.state.submitted ? (
          <div style={{width:'300px'}} >
            <div style={{marginButtom:'10px'}}>
              <Alert severity="success">Submitted successfully!</Alert>
            </div>
            <Button variant="contained" onClick={this.newStudent}>
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