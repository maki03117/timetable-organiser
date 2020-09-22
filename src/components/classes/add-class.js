import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../../services/class.service";
import SubjectDataService from "../../services/subject.service";
import StudentDataService from "../../services/student.service";
import TeacherDataService from "../../services/teacher.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { DataGrid } from '@material-ui/data-grid';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from '@material-ui/pickers';

import { grades, types } from '../../resources';

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Grade', field: 'grade' },
  { title: 'Notes', field: 'notes' },
];

const styles = theme => ({
  root: {
    margin: '20px',
  },
  sub: {
    '& > * .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    marginTop: '15px',
    padding: '10px',
  },
  buttonStyle: {
    '& > * + *': {
      margin: theme.spacing(2),
    },
    marginLeft: '10px',
    marginTop: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  pos: {
    margin: theme.spacing(1),
  }
})

const timeConverter = (date) => {
  date.setHours( date.getHours()+(date.getTimezoneOffset()/-60) );
  return date.toJSON().slice(0, -1);
}

class AddTutorial extends Component {
  constructor(props) {
    super(props);
    this.retrieveSubjects = this.retrieveSubjects.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.retrieveTeachers = this.retrieveTeachers.bind(this);

    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeGrade = this.onChangeGrade.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeSubject = this.onChangeSubject.bind(this);
    this.onChangeRoomNum = this.onChangeRoomNum.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
    this.onChangeStudent = this.onChangeStudent.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);

    this.saveTutorial = this.saveTutorial.bind(this);
    this.newTutorial = this.newTutorial.bind(this);

    this.handleSelectionsChange = this.handleSelectionsChange.bind(this); 
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      id: null,
      startDate: new Date(),
      endDate: new Date(),
      grade: "",
      type: "",
      roomNum: 0,
      subjectId: 0,
      teacherId: 0,
      notes: "",
      
      subjects: [],
      teachers: [],
      students: [],
      valueGrade: '',
      valueType: '',
      valueRoom: null,
      valueSubject: null,
      valueTeacher: null,
      numRows: 0,
      studentIdsArr: [],

      open: false,
      addingStudent: true,
      submitted: false,
      selectedRow: null,
      warning: false
    };
  }

  componentDidMount() {
    this.retrieveSubjects();
    this.retrieveStudents();
    this.retrieveTeachers();
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

  onChangeStartDate(date) {
    const start = date;

    this.setState({
      startDate: start
    });
  }

  onChangeEndDate(date) {
    const end = date;

    this.setState({
      endDate: end
    });
  }

  onChangeGrade(e) {
    const grade = e.target.value;

    this.setState({
      grade: grade,
      valueGrade: grade
    });
  }

  onChangeType(e) {
    const type = e.target.value;

    this.setState({
      type: type,
      valueType: type
    });
  }

  onChangeRoomNum(e) {
    const room = e.target.value;

    this.setState({
      roomNum: room,
      valueRoom: room
    });
  }

  onChangeSubject(e) {
    const subject = e.target.value;

    this.setState({
      subjectId: subject,
      valueSubject: subject
    });
  }

  onChangeTeacher(e) {
    const teacher = e.target.value;

    this.setState({
      teacherId: teacher,
      valueTeacher: teacher
    });
  }

  onChangeNotes(e) {
    const notes = e.target.value;

    this.setState({
      notes: notes
    });
  }

  handleSelectionChange(id) {
    this.state.studentIdsArr.push(id);
    
    this.setState({
      numRows: 1,
      selectedRow: id
    });
  }

  handleSelectionsChange(data) {
    var tempArr = [];
    for (var i = 0; i < data.length; i++) {
      tempArr.push(data[i].id);
    }
    this.setState({
      studentIdsArr: tempArr,
      numRows: data.length
    });
  }

  onChangeStudent() {
    if (!this.state.numRows){
      this.setState({
        open: true,
        message: "Please select Student!"
      });
      return;
    }

    var data;
    for (var i = 0; i < this.state.numRows; i++) {
      data = {
        id: this.state.id,
        studentId: this.state.studentIdsArr[i]
      }

      TutorialDataService.addStudent(data)
        .then(response => {
          console.log(response.data);
          this.setState({
            submitted: true,
            open: true,
            message: "Submitted successfully!"
          });
        })
        .catch(e => {
          console.log(e);
          this.setState({
            open: true,
            message: "Make sure to fill out all above!"
          });
        });
    }
  }

  saveTutorial() {
    var newStart = timeConverter(this.state.startDate)//.toJSON().slice(0, -1);
    var newEnd = timeConverter(this.state.endDate)//.toJSON().slice(0, -1);

    if (!this.state.valueGrade || !this.state.valueRoom) {
      this.setState({
        warning: true,
        message: "Make sure to fill out all above!"
      });
    }

    var data = {
      startDate: newStart,
      endDate: newEnd,
      grade: this.state.grade,
      type: this.state.type,
      roomNum: this.state.roomNum,
      notes: this.state.notes,
      subjectId: this.state.subjectId,
      teacherId: this.state.teacherId
    };

    TutorialDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          grade: response.data.grade,
          type: response.data.type,
          roomNum: response.data.roomNum,
          notes: response.data.notes,
          subjectId: response.data.subjectId,
          teacherId: response.data.teacherId,
          
          addingStudent: true,
        });
        
        console.log(response.data);

        var nData = {
          id: response.data.id,
          studentId: this.state.studentIdsArr
        }

        TutorialDataService.addStudent(nData)
        .then(response => {
          console.log(response.data);
          this.setState({
            submitted: true,
            open: true,
            message: "Submitted successfully!"
          });
        })
        .catch(e => {
          console.log(e);
          this.setState({
            warning: true,
            message: "Make sure to fill out all above!"
          });
        });
      })
      .catch(e => {
        console.log(e);
        this.setState({
          warning: true,
          message: "Make sure to fill out all above!",
        });
      });
  }
  
  newTutorial() {
    this.setState({
      id: null,
      startDate: new Date(),
      endDate: new Date(),
      grade: "",
      type: "",
      roomNum: 0,
      subjectId: 0,
      teacherId: 0,
      notes: "",

      valueGrade: '',
      valueType: '',
      valueRoom: null,
      valueSubject: null,
      valueTeacher: null,
      numRows: 0,
      message: '',
      studentIdsArr: [],

      open: false,
      addingStudent: true,
      submitted: false,
      selectedRow: null,
      warning: false
    });
  } 

  handleClose() {
    this.setState({
      open: false,
      warning: false
    });
  }

  render() {
    const { classes } = this.props;
    const { 
      subjects, 
      teachers, 
      students, 
      valueSubject, 
      valueGrade, 
      valueType, 
      valueRoom, 
      valueTeacher, 
      open, 
      addingStudent, 
      startDate,
      endDate,
      warning } = this.state;
    
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
            to={"/classes"}
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
                  {/* <KeyboardDatePicker
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
                  />
                  <KeyboardTimePicker
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
                  /> */}
                </Grid>
              </MuiPickersUtilsProvider>
              
              <FormControl className={classes.formControl} style={{width: '300px'}}>
                <InputLabel id="select-subject">Subject</InputLabel>
                <Select
                  labelId="select-subject"
                  id="class-subject"
                  value={valueSubject} 
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
                  labelId="select-grade"
                  id="class-grade"
                  value={valueGrade} 
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
                  value={valueTeacher} 
                  onChange={this.onChangeTeacher}
                >
                  {teachers &&
                  teachers.map((teacher, index) => (
                    <MenuItem value={teacher.id} >{teacher.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl className={classes.sub} >
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup aria-label="type" name="class-type" value={valueType} onChange={this.onChangeType}>
                  <FormControlLabel value={types[0]} control={<Radio />} label={types[0]} />
                  <FormControlLabel value={types[1]} control={<Radio />} label={types[1]} />
                </RadioGroup>
              </FormControl>
              
              <FormControl className={classes.formControl}>
                <InputLabel id="select-room">Room</InputLabel>
                <Select
                  labelId="select-room"
                  id="class-room"
                  value={valueRoom} 
                  onChange={this.onChangeRoomNum}
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

              <FormControl style={{marginTop: '15px', width: '500px'}}>
                <TextField
                  id="class-notes"
                  label="Notes"
                  placeholder="Anything to note about the tutorial?"
                  multiline
                  rows={3}
                  value={this.state.notes}
                  onChange={this.onChangeNotes}
                  variant="outlined"
                  margin="normal"
                />
              </FormControl>
              
            </Grid>
          </Paper>
          
          {addingStudent && valueType ? ( 
            <>
            {(valueType === 'Private') ? (
              <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                {/* <div style={{ maxWidth: '100%' }}>
                  <MaterialTable
                    title="Select ONE student"
                    columns={columns}
                    data={students}
                    onRowClick={((evt, selectedRow) => this.handleSelectionChange(selectedRow))}
                    options={{
                      grouping: true,
                      pageSize: 10,
                      //selection: true,
                      rowStyle: rowData => ({
                        backgroundColor: (this.state.selectedRow === rowData.tableData.id) ? '#EEE' : '#FFF'
                      })
                    }}
                  />
                </div> */}
                <Typography className={classes.pos} color="textSecondary">
                  Please Select ONE Student
                </Typography>
                <div style={{  height: 650, width: '100%' }}>
                  <DataGrid rows={students} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} onRowClick={((row)=>this.handleSelectionChange(row.data.id))} />
                </div>
                <Grid
                  className={classes.buttonStyle}
                  style={{width: '100%'}}
                >
                  <Button style={{float: 'right', marginRight: "15px"}} variant="contained" color="primary" size="small" onClick={this.saveTutorial}>
                    Submit
                  </Button>
                </Grid>
              </Paper>
            ) : (
              <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                {/* <div style={{ maxWidth: '100%' }}>
                  <MaterialTable
                    title="Select Students"
                    columns={columns}
                    data={students}
                    options={{
                      grouping: true,
                      pageSize: 10,
                      selection: true,
                    }}
                    onSelectionChange={(rows, rowData)=>this.handleSelectionsChange(rowData, rows)}
                  />
                </div> */}
                <Typography className={classes.pos} color="textSecondary">
                  Please Select Students
                </Typography>
                <div style={{  height: 650, width: '100%' }}>
                  <DataGrid rows={students} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} checkboxSelection onSelectionChange={(obj)=>(this.handleSelectionsChange(obj.rows))} />
                </div>
                <Grid
                  className={classes.buttonStyle}
                  style={{width: '100%'}}
                >
                  <Button style={{float: 'right', marginRight: "20px"}} variant="contained" color="primary" size="small" onClick={this.saveTutorial}>
                    Submit
                  </Button>
                </Grid>
              </ Paper>
            )}
            </>
          ) : (
            <></>
          )}
        
        {this.state.submitted ? (
          <>
          <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
            <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
          </Snackbar>
          <div className={classes.buttonStyle}>
            <Button variant="contained" size="small" onClick={this.newTutorial}>
              Add More
            </Button>
          </div>
          </>
        ) : (
          <Snackbar open={warning} autoHideDuration={6000} onClose={this.handleClose}>
            <Alert severity="warning" onClose={this.handleClose}>{this.state.message}</Alert>
          </Snackbar>
        )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AddTutorial)