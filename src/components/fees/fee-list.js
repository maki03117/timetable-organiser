import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';

import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider, } from "@material-ui/pickers";

import { formatDateToString, weekday, roomNums } from '../../resources';

const styles = theme => ({
  root: {
    //width: '1000px',
    margin: '20px'
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  li: {
    width: '500px',
  },
  table: {
    minWidth: 650,
  },
  search: {
    position: 'relative',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  inputRoot: {
    color: 'inherit',
    marginLeft: '40px'
  },
})

const columns = [
  { title: 'Name', field: 'name' },
  { title: 'Grade', field: 'grade' },
  { title: 'Contact', field: 'phoneNum' },
  { title: 'Address', field: 'address' },
  { title: 'Notes', field: 'notes' },
];

const columnsOfClasses = [
  { title: 'Grade', field: 'grade' },
  { title: 'Subject', field: 'subject' },
  { title: 'Day', field: 'day' },
  { title: 'Start Time', field: 'startTime' },
  { title: 'End Time', field: 'endTime' },
  { title: 'Teacher', field: 'teacher' },
  { title: 'Type', field: 'type' },
  { title: 'Room', field: 'roomNum' },
  { title: 'Notes', field: 'notes' },
  { title: 'Fee', field: 'fee' }
];



function renameKey ( obj ) {
  var start = new Date(obj.startDate);
  var end = new Date(obj.endDate);
  obj["day"] = weekday[start.getDay()];
  obj["startTime"] = formatDateToString(start);
  obj["endTime"] = formatDateToString(end);
  obj["subject"] = obj.subject.name;
  obj["teacher"] = obj.teacher.name;
  obj["roomNum"] = roomNums[obj.roomNum];
  obj["fee"] = "£" + findFee(obj);
}

function findFee(tutorial) {
  //console.log(student);
  //alert(student.id);
  var fee;
  if (tutorial.grade <= 'Y9') {
    fee = {
      "Group": 20,
      "Private": 30
    }
  } else if (tutorial.grade <= 'Y11') {
    fee = {
      "Group": 23,
      "Private": 35
    }
  } else {
    return "?";
  }
  return fee[tutorial.type];
}


class FeeList extends Component {
  constructor(props) {
    super(props);
    //this.onChangeSearchGrade = this.onChangeSearchGrade.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    //this.refreshList = this.refreshList.bind(this);
    this.setActiveStudent = this.setActiveStudent.bind(this);
    //this.removeAllStudents = this.removeAllStudents.bind(this);
    //this.searchGrade = this.searchGrade.bind(this);

    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.findTotalFee = this.findTotalFee.bind(this);

    this.state = {
      students: [],
      currentStudent: null,
      //currentIndex: -1,
      //searchGrade: "",
      open: false,
      selectedRow: 0,
      date: new Date(),
      tutorials: null,
      message: "",
      show: false,
      week: "",
      month: ""
    };
  }

  componentDidMount() {
    this.retrieveStudents();
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

  // refreshList() {
  //   this.retrieveStudents();
  //   this.setState({
  //       currentStudent: null,
  //       currentIndex: -1
  //   });
  // }

  setActiveStudent(student) {
    // if (rows.length > 1) {
    //   this.setState({
    //     open: true,
    //     message: "Please select ONE student!"
    //   });
    // }
    const newS = student;
    //this.getStudent(newS.id)
    newS.tutorials.forEach( obj => renameKey( obj ) );
    this.setState({
      currentStudent: newS,
      selectedRow: newS.id,
      tutorials: newS.tutorials
      //currentIndex: index
    });
    //console.log(this.state.selectedRow);
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

  handleClose() {
    this.setState({
      open: false
    });
  }

  handleClick() {
    //const student = this.currentStudent;
    //console.log(this.findTotalFee());
    this.setState({
      open: true,
      //message: this.findTotalFee()
    });
    this.findTotalFee();
  }

  dateChange(date) {
    const newDate = date;
    this.setState({
      date: newDate
    });
  }

  occurrenceDays() {
    const numOfDays = new Date(this.state.date.getFullYear(), this.state.date.getMonth() + 1, 0).getDate();
    const firstday = new Date(this.state.date.getFullYear(), this.state.date.getMonth(), 1).getDay();
    var count = Array(7).fill(4);
  
    // number of days whose occurrence will be 5 
    const inc = numOfDays - 28;
  
    for (var i = firstday; i < (firstday+inc); i ++) {
      if (i > 6) {
        count[i % 7] = 5;
      } else {
        count[i] = 5;
      }
    }
  
    return count;
  }

  findTotalFee() {
  //console.log(student);
  //alert(student.id);
  const arrOfOccurrenceDays = this.occurrenceDays();

  var fee;
  if (this.state.currentStudent.grade <= 'Y9') {
    fee = {
      "Group": 20,
      "Private": 30
    }
  } else if (this.state.currentStudent.grade <= 'Y11') {
    fee = {
      "Group": 23,
      "Private": 35
    }
  } else {
    this.setState({
      message: "Unknown Fees",
      //message: this.findTotalFee()
    });
    return;
  }
  const tutorials = this.state.tutorials;
  console.log(tutorials);
  var weeklyTotal = 0;
  var monthlyTotal = 0;
  // Calculate the total of fees for a week
  for (var i = 0; i < tutorials.length; i++) {
    weeklyTotal += fee[tutorials[i].type];
    monthlyTotal += fee[tutorials[i].type] * arrOfOccurrenceDays[new Date(tutorials[i].startDate).getDay()];
  }
  this.setState({
    open: true,
    week: "£"+weeklyTotal,
    month: "£"+monthlyTotal
    //message: this.findTotalFee()
  });
  return;
}

  render() {
    const { classes } = this.props;
    const { students, currentStudent, currentIndex, tutorials, open, date, message } = this.state;

    return (
      <>
      {/* <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      > */}
      <Grid
        container
        item
        direction="row"
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      >

        <Grid item className={classes.sub}>
          {/* <Grid item> */}
            <MaterialTable
              title="Select Student"
              columns={columns}
              data={students}
              onRowClick={((evt, selectedRow) => this.setActiveStudent(selectedRow))}
              options={{
                grouping: true,
                pageSize: 5,
                //selection: true,
                rowStyle: rowData => ({
                  backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                })
              }}
              //onRowClick={(event, rowData) => this.setActiveStudent(rowData, 0)}
              //onSelectionChange={(rows, rowData)=>this.setActiveStudent(rows, rowData, 0)}
            />
            {/* {currentStudent ? 
            (
              <Button variant="contained" color="primary" size="small" onClick={this.removeAllTutorials}>
                Calculate fee
              </Button>
            ):(
              <>
              </>
            )} */}
            {/* <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert severity="error" onClose={this.handleClose}>{this.state.message}</Alert>
            </Snackbar> */}
          {/* </Grid> */}
        </Grid>
        {tutorials ? (

          <Grid 
            item
            justify="center"
            className={classes.sub}
          >
            <MaterialTable
              title="Classes"
              columns={columnsOfClasses}
              data={tutorials}
              //onRowClick={((evt, selectedRow) => this.setActiveTutorial(selectedRow))}
              options={{
                grouping: true,
                pageSize: 5,
                //selection: true
                // rowStyle: rowData => ({
                //   backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                // })
              }}
              //onSelectionChange={(rows, rowData)=>this.setActiveTutorial(rows, rowData, 0)}
            />
            {/* <div className={classes.sub}>  */}
              {/* <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                fullWidth={true} 
                onClick={this.handleClick}
              >
                Calculate fee
              </Button> */}
            {/* </div> */}
            
          </Grid>

        ):(
          <>
          </>
        )}
        
      </Grid>
      
      {/* </Grid> */}
      <Grid
        container

        direction="row"
        justify="center"
        alignItems="flex-start"
        //className={classes.root}
      >
      <Grid item>
        <Paper>
          <ListSubheader component="div" id="nested-list-subheader">
            Please Select A Month
          </ListSubheader>
        </Paper>
        <Paper className={classes.sub}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              autoOk
              //disabled
              disableToolbar={true}
              orientation="landscape"
              variant="static"
              openTo="date"
              value={date}
              onChange={(date) => this.dateChange(date)}
            />
          </MuiPickersUtilsProvider>
        </Paper>
        {tutorials ? (
          <Button 
            variant="contained" 
            color="primary" 
            size="small" 
            fullWidth={true} 
            onClick={this.findTotalFee}
          >
            Calculate fee
          </Button>
        ): (
          <>
          </>
        )}
      </Grid>
        
      {open ? (
        <Grid item className={classes.sub}>
          <Paper elevation={3} className={classes.sub} styles={{paddingBottom: "10px"}}>
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            // subheader={
            //   <ListSubheader component="div" id="nested-list-subheader">
            //     Nested List Items
            //   </ListSubheader>
            // }
            //className={classes.root}
          >
            <ListSubheader component="div" id="nested-list-subheader">
              Weekly Total Fee For {currentStudent.name}
            </ListSubheader>
            <ListItem>
              <ListItemText primary={this.state.week} />
            </ListItem>
            <ListSubheader component="div" id="nested-list-subheader">
              Monthly Total Fee For {currentStudent.name}
            </ListSubheader>
            <ListItem>
              <ListItemText primary={this.state.month} />
            </ListItem>
            {/* <Box bgcolor="info.main" color="info.contrastText" p={2}>

              <Typography variant="h6" gutterBottom styles={{margin: "10px"}}>
                Weekly Total Fee For {currentStudent.name}:
              </Typography>
              
              <Typography variant="body1" display="block" gutterBottom>
                £{this.state.week}

              </Typography>

              <Typography variant="h6" gutterBottom styles={{margin: "10px"}}>
                Monthly Total Fee For {currentStudent.name}:

              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                £{this.state.month}

              </Typography>
            </Box> */}
            </List>
          </Paper>
        </Grid>
      ):(
        <>
        </>
      )}
      </Grid>
      </>
    );
  }
}

export default withStyles(styles)(FeeList);