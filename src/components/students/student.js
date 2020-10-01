import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

import { grades } from '../../resources';

const styles = theme => ({
  root: {
    margin: '20px',
    padding: '20px',
    '& > * .MuiTextField-root': {
     margin: theme.spacing(1),
   },
 },
 sub: {
   '& > * ': {
     margin: theme.spacing(1),
   },
   padding: '5px',
 },
  formControl: {
    minWidth: 120,
  },
})

class Student extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.getStudent = this.getStudent.bind(this);
    this.updateStudent = this.updateStudent.bind(this);
    this.deleteStudent = this.deleteStudent.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      currentStudent: {
        id: null,
        name: "",
        grade: "",
        phoneNum: "",
        address:  "",
        notes: "",
      },
      done: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getStudent(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentStudent: {
          ...prevState.currentStudent,
          name: name
        }
      };
    });
  }

  onChangeGrade(e) {
    const grade = e.target.value;

    this.setState(prevState => ({
      currentStudent: {
        ...prevState.currentStudent,
        grade: grade
      }
    }));
  }

  onChangePhoneNum(e) {
    const phoneNum = e.target.value;

    this.setState(prevState => ({
      currentStudent: {
        ...prevState.currentStudent,
        phoneNum: phoneNum
      }
    }));
  }

  onChangeAddress(e) {
    const address = e.target.value;

    this.setState(prevState => ({
      currentStudent: {
        ...prevState.currentStudent,
        address: address
      }
    }));
  }

  onChangeNotes(e) {
    const notes = e.target.value;

    this.setState(prevState => ({
      currentStudent: {
        ...prevState.currentStudent,
        notes: notes
      }
    }));
  }

  getStudent(id) {
    StudentDataService.get(id)
      .then(response => {
        this.setState({
          currentStudent: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateStudent() {
    StudentDataService.update(
      this.state.currentStudent.id,
      this.state.currentStudent
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          done: true,
          message: "Student updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteStudent() {    
    StudentDataService.delete(this.state.currentStudent.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/students')
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleClose() {
    this.setState({
      done: false
    });
  };

  render() {
    const { classes } = this.props;
    const { currentStudent, done } = this.state;

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
            to={"/students"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          {currentStudent ? (
            <Paper className={classes.sub}>
              <Grid container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Student-name" 
                    label="Student"
                    defaultValue={currentStudent.name}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangeName}
                  />
                </FormControl>
                <FormControl className={classes.formControl} style={{marginLeft: "8px"}}>
                  <InputLabel id="demo-simple-select-label">Year</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={currentStudent.grade}
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
                    <MenuItem value={grades[11]}>Year 13</MenuItem>
                  </Select>
                </FormControl>

                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Student-phoneNum" 
                    label="Student Phone Number"
                    defaultValue={currentStudent.phoneNum}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangePhoneNum}
                  />
                </FormControl>

                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Student-address" 
                    label="Student Address"
                    defaultValue={currentStudent.address}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangeAddress}
                  />
                </FormControl>

                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="student-notes"
                    label="Notes"
                    defaultValue={currentStudent.notes}
                    multiline
                    rows={3}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.onChangeNotes}
                  />
                </FormControl>

                <div className={classes.sub} >
                  <Button variant="contained" color="secondary" size="small" onClick={this.updateStudent}> {/*className={classes.root}> */}
                    Update
                  </Button>
                  <Button variant="contained" color="default" size="small" onClick={this.deleteStudent}> {/*className={classes.root}> */}
                    Delete
                  </Button>
                  <Snackbar open={done} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
                  </Snackbar>
                </div>
              </Grid>
            </Paper>
          ) : (
            <Alert severity="warning">Please click on a Student!</Alert>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Student);