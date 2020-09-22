import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../../services/tutorial.service";
import SubjectDataService from "../../services/subject.service";
import StudentDataService from "../../services/student.service";
import TeacherDataService from "../../services/teacher.service";

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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import { grades, rooms, types } from '../../resources';

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
      studentId: 0, //-------------------------------------------------------------->
      teacherId: 0,
      notes: "",
      
      selectedDate: new Date(),
      subjects: [],
      teachers: [],
      students: [],
      valueGrade: '',
      valueType: '',
      valueRoom: null,
      valueSubject: null,
      valueTeacher: null,
      valueStudent: 0,
      numRows: 0,
      studentIdsArr: [],

      open: false,
      searchGrade: '',
      limit: 0,
      addingStudent: true,
      submitted: false,
      selectedRow: null
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
    this.setState({
      startDate: date
    });
  }

  onChangeEndDate(date) {
    this.setState({
      endDate: date
    });
  }

  onChangeGrade(e) {
    this.setState({
      grade: e.target.value,
      valueGrade: e.target.value
    });
  }

  onChangeType(e) {
    this.setState({
      type: e.target.value,
      valueType: e.target.value
    });
  }

  onChangeRoomNum(e) {
    this.setState({
      roomNum: e.target.value,
      valueRoom: e.target.value
    });
  }

  onChangeSubject(e) {
    this.setState({
      subjectId: e.target.value,
      valueSubject: e.target.value
    });
  }

  onChangeTeacher(e) {
    this.setState({
      teacherId: e.target.value,
      valueTeacher: e.target.value
    });
    //alert(e.target.value)
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value
    });
  }

  handleSelectionChange(rowData) {
    this.state.studentIdsArr.push(rowData.id);
    alert("tableId: " + rowData.tableData.id + "studentId: " + rowData.id )
    this.setState({
      //studentIdsArr: this.state.studentIdsArr,
      numRows: 1,
      selectedRow: rowData.tableData.id
    });
  }

  handleSelectionsChange(rowData, rows) {
    //alert("length: " + rows.length)
    this.state.studentIdsArr.push(rowData.id);
    this.setState({
      //studentIdsArr: tempArr,
      numRows: rows.length
    });
  }

  onChangeStudent() {
    //alert("length: " + this.state.numRows)
    if (!this.state.numRows){
      this.setState({
        open: true,
        message: "Please select Student!"
      });
      return;
    }

    var data;
    for (var i = 0; i < this.state.numRows; i++) {
      //alert("id: " + this.state.studentIdsArr[i])
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

      this.setState({
        studentId: this.state.studentIdsArr[i],
        //valueStudent: e.target.value,
        //searchGrade: ''
      });
    }
  }

  saveTutorial() {
    var newStart = timeConverter(this.state.startDate)//.toJSON().slice(0, -1);
    var newEnd = timeConverter(this.state.endDate)//.toJSON().slice(0, -1);

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

    alert("startDate: " + data.startDate + "\nendDate: " + data.endDate + "\ngrade: " + data.grade + "\ntype: " + data.type + "\nroom: " + data.roomNum + "\nsubjectId: "+data.subjectId + "\nteacherId: " + data.teacherId);

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
            open: true,
            message: "Make sure to fill out all above!"
          });
        });
      })
      .catch(e => {

        console.log(e);
        this.setState({
          message: "Make sure to fill out all above!",
          open: true
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
      studentId: 0, //-------------------------------------------------------------->
      teacherId: 0,
      notes: "",

      selectedDate: new Date(),
      valueGrade: '',
      valueType: '',
      valueRoom: null,
      valueSubject: null,
      valueTeacher: null,
      valueStudent: 0,
      numRows: 0,
      message: '',
      studentIdsArr: [],

      open: false,
      searchGrade: '',
      addingStudent: false,
      submitted: false
    });
  } 

  handleClose() {
    this.setState({
      open: false
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
      valueStudent, 
      open, 
      addingStudent, 
      startDate,
      endDate } = this.state;
    
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
            to={"/tutorials"}
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
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
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
                  />
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
                <InputLabel id="select-grade">Grade</InputLabel>
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
              
              {/* <div
                className={classes.sub}
              >
                <Button variant="contained" color="primary" size="small" onClick={this.saveTutorial}>
                  Proceed to Adding Student
                </Button>
                <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
                  <Alert severity="error" onClose={this.handleClose}>{this.state.message}</Alert>
                </Snackbar>
              </div> */}

            </Grid>
          </Paper>
          
          {addingStudent && valueType ? ( 
            <>
            {(valueType === 'Private') ? (
              <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                {/* <Typography 
                  variant="overline" 
                  display="block" 
                  component="legend"
                  style={{margin: '10px', marginBottom: '0'}}
                >
                  Select ONE student
                </Typography>  */}
                <div style={{ maxWidth: '100%' }}>
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
                    
                    
                    //onSelectionChange={(rows, rowData)=>this.handleSelectionsChange(rowData, rows)}
                  />
                </div>
                <Grid
                  className={classes.buttonStyle}
                >
                  <Button variant="contained" color="primary" size="small" onClick={this.saveTutorial}>
                    Submit
                  </Button>
                </Grid>
              </Paper>
            ) : (
              // 1. Select the limit of class (how many pupil allowed in the class?)
              // 2. Depending on 1. select students:
                // 2.1 select the year of the student
                // 2.2 filter, give the list of students of that year
                <Paper elevation={3} style={{marginTop: '10px', padding: '10px', width: '600px'}}>
                {/* <Typography 
                  variant="overline" 
                  display="block" 
                  component="legend"
                  style={{margin: '10px', marginBottom: '0'}}
                >
                  Type class pupil limit
                </Typography>  */}
                {/* <FormControl className={classes.formControl}>
                  <TextField
                    id="class-limit" 
                    label="Maximum"
                    type="number"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={this.state.limit}
                    onChange={this.onChangeLimit}
                  />
                </FormControl> */}
                  <div style={{ maxWidth: '100%' }}>
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
                  </div>
                {/* <FormControl className={classes.formControl} style={{width: '200px'}}>
                  <InputLabel id="demo-simple-select-label">Student</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="class-student"
                    value={valueStudent} 
                    onChange={this.onChangeStudent}
                  >
                    {students &&
                    students.map((student, index) => (
                      <MenuItem value={student.id} >{student.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <Grid
                  className={classes.buttonStyle}
                >
                  <Button variant="contained" color="primary" size="small" onClick={this.saveTutorial}>
                    Submit
                  </Button>
                </Grid>
              </ Paper>
              
            )}
            </>
            
          ) : (
            <>
            {/* <Alert severity="warning" className={classes.sub}>Please select "Type" to proceed!</Alert> */}
            </>
          )}
              
        
        {this.state.submitted ? (
          <>
          <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
            <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
          </Snackbar>
          <div className={classes.buttonStyle}>
            <Button variant="contained" onClick={this.newTutorial}>
              Add More
            </Button>
          </div>
          </>
        ) : (
          <>
          </>
        )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AddTutorial)