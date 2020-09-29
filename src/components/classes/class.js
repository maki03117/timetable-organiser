import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import TutorialDataService from "../../services/class.service";
import SubjectDataService from "../../services/subject.service";
import TeacherDataService from "../../services/teacher.service";
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
import { withStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Snackbar from '@material-ui/core/Snackbar';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { grades, types } from '../../resources';

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Year', field: 'grade' },
  { title: 'Notes', field: 'notes' },
];

const styles = theme => ({
  root: {
     margin: '20px',
     padding: '10px',
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
    marginTop: '15px',
    padding: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  buttonStyle: {
    '& > *': {
      margin: theme.spacing(1),
    },
    marginTop: '10px',
  }
})

const timeConverter = (date) => {
  date.setHours( date.getHours()+(date.getTimezoneOffset()/-60) );
  return date.toJSON().slice(0, -1);
}

function findCurrentStudents(array) {
  if (!Array.isArray(array) || !array.length) {
    return "";
  }
  var str = "";
  for (var i  = 0; i < array.length; i++) {
    str += array[i].name;
    str += ' ';
  }
  return str;
}

class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeRoom = this.onChangeRoom.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleSelectionsChange = this.handleSelectionsChange.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.addStudent = this.addStudent.bind(this);
    this.removeStudent = this.removeStudent.bind(this);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      currentTutorial: {
        id: null,
        grade: "",
        type:  "",
        roomNum: 0,
        notes: "",
        subjectId: 0,
        teacherId: 0,
        students: []
      },
      done: false,
      open: false,
      message: "",

      subjects: [],
      teachers: [],
      students: [],
      selectedRow: 0,
      selectedRows: [],
      studentIdToBeRemoved: [],
      studentIdToBeAdded: [],
      studentsToBeRemoved: [],
      studentsToBeAdded: [],
      goBack: false
    };
  }

  componentDidMount() {
    this.retrieveSubjects();
    this.retrieveTeachers();
    this.retrieveStudents();
    this.getTutorial(this.props.match.params.id);
  }

  retrieveSubjects() {
    SubjectDataService.getAll()
      .then(response => {
        this.setState({
          subjects: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveStudents() {
    StudentDataService.getAll()
      .then(response => {
        this.setState({
          students: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveTeachers() {
    TeacherDataService.getAll()
      .then(response => {
        this.setState({
          teachers: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
}

  onChangeSubject(e) {
    const subjectId = e.target.value;

    this.setState(function(prevState) {
      return {
        currentTutorial: {
          ...prevState.currentTutorial,
          subjectId: subjectId
        }
      };
    });
  }

  onChangeGrade(e) {
    const grade = e.target.value;

    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        grade: grade
      }
    }));
  }

  onChangeStartDate(date) {

    this.setState({
      startDate: date
    });
  }

  onChangeEndDate(date) {
    
    this.setState({
      endDate: date
    });
  }

  onChangeRoom(e) {
    const room = e.target.value;

    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        roomNum: room,
      }
    }));
  }

  onChangeType(e) {
    const type = e.target.value;

    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        type: type
      }
    }));
  }

  onChangeNotes(e) {
    const notes = e.target.value;

    this.setState(prevState => ({
      currentTutorial: {
        ...prevState.currentTutorial,
        notes: notes
      }
    }));
  }

  handleSelectionChange(id) {
    var tempArr = [id];

    this.setState({
      studentIdToBeAdded: tempArr,
      selectedRow: id
    });
  }

  handleSelectionsChange(rows) {
    this.setState({
      selectedRows: rows
    });
  }

  getTutorial(id) {
    TutorialDataService.get(id)
      .then(response => {
        const start = new Date(response.data.startDate );
        const end = new Date(response.data.endDate );
        
        var array = response.data.students;
        if (!Array.isArray(array) || !array.length) {
          this.setState({
            startDate: start,
            endDate: end,
            currentTutorial: response.data
          });
        } else {
          if (response.data.type === "Private"){
            var temp = [array[0].id];
            this.setState({
              startDate: start,
              endDate: end,
              currentTutorial: response.data,
              selectedRow: array[0].id,
              studentIdToBeRemoved: temp
            });
          } else {
            this.setState({
              startDate: start,
              endDate: end,
              currentTutorial: response.data
            });
          }
          
        }
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTutorial() {
    const newStartDate = timeConverter(this.state.startDate);
    const newEndDate = timeConverter(this.state.endDate);

    var data = this.state.currentTutorial;

    data["startDate"] = newStartDate;
    data["endDate"] = newEndDate;

    console.log(this.state.currentTutorial.id + " " + this.state.studentIdToBeRemoved)

    if (this.state.currentTutorial.type === "Group"){
      if (Array.isArray(this.state.studentsToBeAdded) && this.state.studentsToBeAdded.length){
        var temp = this.state.studentsToBeAdded;
        for (var i = 0; i < temp.length; i++){
          this.state.studentIdToBeAdded.push(temp[i].id);
        }
        data["studentIdsTobeAdded"] = this.state.studentIdToBeAdded;
      }
      if (Array.isArray(this.state.studentsToBeRemoved) && this.state.studentsToBeRemoved.length){
        var temp = this.state.studentsToBeRemoved;
        for (var i = 0; i < temp.length; i++){
          this.state.studentIdToBeRemoved.push(temp[i].id);
        }
        data["studentIdsTobeRemoved"] = this.state.studentIdToBeRemoved;
      }
    } else {
      if (!Array.isArray(this.state.studentIdToBeRemoved) || !(this.state.studentIdToBeRemoved.length)) {
        data["studentIdsTobeAdded"] = this.state.studentIdToBeAdded;
      } else {
        if (Array.isArray(this.state.studentIdToBeAdded) && this.state.studentIdToBeAdded.length){
          data["studentIdsTobeRemoved"] = this.state.studentIdToBeRemoved;
          data["studentIdsTobeAdded"] = this.state.studentIdToBeAdded;
        }
      }
    }

    TutorialDataService.update(
      this.state.currentTutorial.id,
      data
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          done: true,
          open: true,
          message: "Submitted successfully!"
        });
      })
      .catch(e => {
        console.log(e);
        this.setState({
          open: true,
          message: "Failed to update!"
        });
      });
  }

  deleteTutorial() {    
    TutorialDataService.delete(this.state.currentTutorial.id)
      .then(response => {
        console.log(response.data);
        this.setState({
          goBack: true
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  addStudent() {
    var temp = this.state.selectedRows;
    this.setState({
      studentsToBeAdded: temp
    });
  }

  removeStudent() {
    var temp = this.state.selectedRows;
    this.setState({
      studentsToBeRemoved: temp
    });
  }

  render() {
    const { classes } = this.props;
    const { startDate, endDate, subjects, teachers, students, currentTutorial, done, open } = this.state;

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
            to={"/classes"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          {currentTutorial ? (
            <Paper className={classes.sub}>
              <Grid container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <DateTimePicker
                    label="Start Date and Time"
                    //inputVariant="outlined"
                    value={startDate}
                    onChange={this.onChangeStartDate}
                    style={{width: "200px"}}
                  />
                  <DateTimePicker
                    label="End Date and Time"
                    //inputVariant="outlined"
                    value={endDate} 
                    onChange={this.onChangeEndDate}
                    style={{width: "200px"}}
                  />
                  {/* <KeyboardTimePicker
                    margin="normal"
                    id="startTime-picker"
                    label="Start Time"
                    value={startDate}
                    onChange={this.onChangeStartDate}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                  <KeyboardTimePicker
                    margin="normal"
                    id="endTime-picker"
                    label="End Time"
                    value={endDate}
                    onChange={this.onChangeEndDate}
                    KeyboardButtonProps={{
                      'aria-label': 'change time',
                    }}
                  />
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    label="Date"
                    
                    value={startDate, endDate}
                    onChange={this.onChangeStartDate, this.onChangeEndDate}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  /> */}
                </Grid>
              </MuiPickersUtilsProvider>

                <FormControl className={classes.formControl} style={{width: '300px'}}>
                  <InputLabel id="select-subject">Subject</InputLabel>
                  <Select
                    labelId="select-subject"
                    id="class-subject"
                    value={currentTutorial.subjectId} 
                    onChange={this.onChangeSubject}
                  >
                    {subjects &&
                    subjects.map((subject) => (
                      <MenuItem value={subject.id} >{subject.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="select-grade">Year</InputLabel>
                  <Select
                    labelId="class-grade"
                    id="class-grade"
                    value={currentTutorial.grade}
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

                <FormControl className={classes.formControl} style={{width: '300px'}}>
                  <InputLabel id="select-teacher">Teacher</InputLabel>
                  <Select
                    labelId="select-teacher"
                    id="class-teacher"
                    value={currentTutorial.teacherId} 
                    onChange={this.onChangeTeacher}
                  >
                    {teachers &&
                    teachers.map((teacher) => (
                      <MenuItem value={teacher.id} >{teacher.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl className={classes.formControl}>
                  <InputLabel id="select-room">Room</InputLabel>
                  <Select
                    labelId="select-room"
                    id="class-room"
                    value={currentTutorial.roomNum} 
                    onChange={this.onChangeRoom}
                  >
                    <MenuItem value={1} >Room 1</MenuItem>
                    <MenuItem value={2} >Room 2</MenuItem>
                    <MenuItem value={3} >Room 3</MenuItem>
                    <MenuItem value={4} >Room 4</MenuItem>
                    <MenuItem value={5} >Room 5</MenuItem>
                    <MenuItem value={6} >Room 6</MenuItem>
                    <MenuItem value={7} >Room 7</MenuItem>
                    <MenuItem value={8} >Kitchen Room</MenuItem>
                  </Select>
                </FormControl>

                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Tutorial-notes"
                    label="Notes"
                    placeholder={currentTutorial.notes}
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
                
                <FormControl className={classes.sub} >
                  <FormLabel component="legend">Type</FormLabel>
                  <RadioGroup aria-label="type" name="class-type" value={currentTutorial.type} onChange={this.onChangeType}>
                    <FormControlLabel value={types[0]} control={<Radio />} label={types[0]} />
                    <FormControlLabel value={types[1]} control={<Radio />} label={types[1]} />
                  </RadioGroup>
                </FormControl>
                
                <>
                {(currentTutorial.type === 'Private') ? (
                  <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                    <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <>
                        <Paper>
                          <ListSubheader component="div" id="nested-list-subheader">
                            Original: {findCurrentStudents(this.state.currentTutorial.students)}
                            {/* Current Students: {currentTutorial.students[0][0].name} */}
                          </ListSubheader>
                        </Paper>
                        </>
                      }
                      dense={true}
                      styles={{padding: "10px", backgroundColor: "black"}}
                      //className={classes.root}
                    >
                    </List>
                    <Typography className={classes.pos} color="textSecondary">
                      Please Select ONE Student
                    </Typography>
                    <div style={{  height: 650, width: '100%' }}>
                      <DataGrid rows={students} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} onRowClick={((row)=>this.handleSelectionChange(row.data.id))} />
                    </div>
                  </Paper>
                ) : (
                  <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                    <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <>
                        <Paper>
                          <ListSubheader component="div" id="nested-list-subheader">
                            Original: {findCurrentStudents(this.state.currentTutorial.students)}
                            {/* Current Students: {currentTutorial.students[0][0].name} */}
                          </ListSubheader>
                        </Paper>
                        <Paper>
                          <ListSubheader component="div" id="nested-list-subheader">
                            Students to remove: {findCurrentStudents(this.state.studentsToBeRemoved)}
                          </ListSubheader>
                        </Paper>
                        <Paper>
                          <ListSubheader component="div" id="nested-list-subheader">
                            Students to add: {findCurrentStudents(this.state.studentsToBeAdded)}
                          </ListSubheader>
                        </Paper>
                        </>
                      }
                      dense={true}
                      styles={{padding: "10px", backgroundColor: "black"}}
                    >
                    </List>
                    <Typography className={classes.pos} color="textSecondary">
                      Please Select Students
                    </Typography>
                    <div style={{  height: 650, width: '100%' }}>
                      <DataGrid rows={students} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} checkboxSelection onSelectionChange={(obj)=>(this.handleSelectionsChange(obj.rows))} />
                    </div>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      className={classes.buttonStyle}
                    >
                      <Button variant="outlined" color="secondary" size="small" onClick={this.addStudent}>
                        Add
                      </Button>
                      <Button variant="outlined" color="primary" size="small" onClick={this.removeStudent}>
                        Remove
                      </Button>
                    </Grid>
                  </ Paper>
                )}
                </>

                <div className={classes.buttonStyle} >
                  <Button variant="contained" color="secondary" size="small" onClick={this.updateTutorial}> {/*className={classes.root}> */}
                    Update
                  </Button>
                  <Button variant="contained" color="default" size="small" onClick={this.deleteTutorial}> {/*className={classes.root}> */}
                    Delete
                  </Button>
                  {done ? (
                    <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
                      <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
                    </Snackbar>
                  ):(
                    <></>
                  )}
                
                </div>
              </Grid>
            </Paper>
          ) : (
            <Snackbar open={true} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert severity="warning" onClose={this.handleClose}>Please click on a Tutorial!</Alert>
            </Snackbar>
          )}
        </Grid>
        {this.state.goBack ? (
          <Redirect to="/classes" />
        ):(
          <></>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Tutorial);