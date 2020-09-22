import React, { Component } from "react";
import { createStore } from 'redux';
import { Link } from "react-router-dom";
import TutorialDataService from "../services/tutorial.service";
import SubjectDataService from "../services/subject.service";
import TeacherDataService from "../services/teacher.service";

import { connect, Provider } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import classNames from 'clsx';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { ViewState, EditingState, GroupingState, IntegratedEditing, IntegratedGrouping } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  GroupingPanel,
  DayView,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  EditRecurrenceMenu,
  DragDropProvider,
  ConfirmationDialog,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
} from '@devexpress/dx-react-scheduler-material-ui';

import { appointments, rooms, students, test } from '../resources';

function renameKey ( obj ) {
  obj["rRule"] = 'FREQ=WEEKLY';
}


//export const appointments = ;
// const LOCATIONS = [1, 2, 3, 4, 5, 6, 7, 8];//['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5', 'Room 6', 'Room 7', 'Kitchen Room'];
// const LOCATIONS_SHORT = [1, 2, 3, 4, 5, 6, 7, 8];

const styles = ({ spacing, palette }) => ({
   weekendCell: {
     backgroundColor: fade(palette.action.disabledBackground, 0.04),
     '&:hover': {
       backgroundColor: fade(palette.action.disabledBackground, 0.04),
     },
     '&:focus': {
       backgroundColor: fade(palette.action.disabledBackground, 0.04),
     },
   },
   weekEnd: {
     backgroundColor: fade(palette.action.disabledBackground, 0.06),
   },
  //  flexibleSpace: {
  //    margin: '0 0 0 0',
  //    display: 'flex',
  //    alignItems: 'centre',
  //    float: 'right',
  //    //height: '1000px',
  //  },
   textField: {
     width: '75px',
     marginLeft: spacing(1),
     marginTop: 0,
     marginBottom: 0,
     height: spacing(4.875),
   },
   title: {
    fontWeight: 'bold',
    overflow: 'auto',
    //overflow: 'hidden',
    //textOverflow: 'ellipsis',
    whiteSpace: 'normal',
  },
  textContainer: {
    lineHeight: 1,
    whiteSpace: 'pre-wrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
  },
  time: {
    display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  text: {
    overflow: 'auto',
    //wordWrap: '',
    //textOverflow: 'ellipsis',
    whiteSpace: 'normal',
  },
  container: {
    height: '100%',
    width: '100%',
  },
   today: {
     backgroundColor: fade(palette.primary.main, 0.16),
   },
   weekend: {
     backgroundColor: fade(palette.action.disabledBackground, 0.06),
   },
   flexibleSpace: {
    //margin: '0 auto 0 0',
    width: "100px",
    float: 'right',
    margin: "10px"
    //height: '100px'
  },
  sub: {
    marginTop: '5px'
  }
 });
 
 const useStyles = makeStyles((theme) => ({
   root: {
     padding: '10px',
   },
   sub: {
     marginRight: '10px'
   },
 }));
 
 
//  const AddComponents = () => {
//    const classes = useStyles();
//    return (
//    <div className={classes.root}>
//      <Button variant="contained" className={classes.sub}>
//        <Link to={"/add-subject"} style={{ textDecoration: 'none' }}>
//          Add Subject
//        </Link>
//      </Button>
//      <Button variant="contained" color="primary" className={classes.sub} >
//        <Link to={"/add-student"} style={{ textDecoration: 'none' }}>
//          Add Student
//        </Link>
//      </Button>
//      <Button variant="contained" color="secondary" >
//        <Link to={"/add-teacher"} style={{ textDecoration: 'none' }}>
//          Add Teacher
//        </Link>
//      </Button>
//    </div>
//    );
//  };

 
const ExternalViewSwitcher = ({
  currentViewName,
  onChange,
  }) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: 'row', padding: '10px', float: 'right' }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    {/* <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" /> */}
    <FormControlLabel value="Day" control={<Radio />} label="Day" />
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

const isRestTimeWeek = date => {
   if (date.getDay() === 6) {
     return date.getHours() < 9 || date.getHours() >= 19
   }
   return date.getHours() < 16 || date.getHours() >= 23
 };
 
 const TimeTableCellWeek = withStyles(styles, { name: 'TimeTableCell' })(({ classes, ...restProps }) => {
   const { startDate } = restProps;
   if (isRestTimeWeek(startDate)) {
     return <WeekView.TimeTableCell {...restProps} className={classes.weekendCell} />;
   } 
   return <WeekView.TimeTableCell {...restProps} />;
 });
 
 const TimeTableCellDay = withStyles(styles, { name: 'TimeTableCell' })(({ classes, ...restProps }) => {
 const { startDate } = restProps;
 if (isRestTimeWeek(startDate)) {
   return <DayView.TimeTableCell {...restProps} className={classes.weekendCell} />;
 } 
 return <DayView.TimeTableCell {...restProps} />;
 });

  
 const DayScaleCell = withStyles(styles, { name: 'DayScaleCell' })(({ classes, ...restProps }) => {
   const { startDate, today } = restProps;
   if (today) {
     return <WeekView.DayScaleCell {...restProps} className={classes.today} />;
   } if (startDate.getDay() === 0 || startDate.getDay() === 6) {
     return <WeekView.DayScaleCell {...restProps} className={classes.weekend} />;
   } return <WeekView.DayScaleCell {...restProps} />;
 });



// // const retrieveTeachers = () => {
// //   TeacherDataService.getAll()
// //     .then(response => {
// //       console.log(response.data);
// //       return response.data;
// //     })
// //     .catch(e => {
// //       console.log(e);
// //     });
// // }

// //const teachers = retrieveTeachers();

const AppointmentContent = withStyles(styles, { name: 'AppointmentContent' })(({
  classes, data, formatDate, subject, ...restProps
}) => (
  <Appointments.AppointmentContent {...restProps} formatDate={formatDate} data={data}>
    <div className={classes.container}>
      <div className={classes.textContainer}>
        <div className={classes.time}>
          {formatDate(data.startDate.toString(), { hour: 'numeric', minute: 'numeric' })}
        </div>
        <div className={classes.time}>
          {' - '}
        </div>
        <div className={classes.time}>
          {formatDate(data.endDate.toString(), { hour: 'numeric', minute: 'numeric' })}
        </div>
      </div>
      {/* Grade, Subject, Teacher */}
      <div className={classes.title}>
        {data.grade + '  ' + data.subject.name + '  ' + data.teacher.name}
      </div>
      {/* Students */}
      <div className={classes.text}>
        {data.students.map((student, index) => (
          student.name + '  '
        ))}
      </div>
      {/* Notes */}
      <div className={classes.text}>
        {data.notes}
      </div>
    </div>
  </Appointments.AppointmentContent>
));

const FlexibleSpace = withStyles(styles, { name: 'FlexibleSpace' })(({
  classes, state, teachers, valueTeacher, handleChange, ...restProps
}) => (
  <Toolbar.FlexibleSpace {...restProps} >
    <FormControl className={classes.flexibleSpace}>
      <InputLabel id="demo-simple-select-label">Teacher</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select-outlined"
        value={valueTeacher}
        onChange={handleChange}
        label="Teacher"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {teachers &&
        teachers.map((teacher, index) => (
          <MenuItem value={teacher.id} >{teacher.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Toolbar.FlexibleSpace>
));


const isWeekOrMonthView = viewName => viewName === 'Day' || viewName === 'Week' || viewName === 'Month';

class ViewCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorials: [],
      teachers: [],
      valueTeacher: 0,
      searchName: '',

      currentViewName: 'Day',
      
      grouping: [{
        resourceName: 'roomNum',
      }, 
      // {
      //   resourceName: 'teacherId',
      // }
      ],

      //addedAppointment: {},
      anchorEl: null
    };

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };

    // this.currentViewNameChange = (e) => {
    //   this.setState({ currentViewName: e.target.value });
    // };

    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.retrieveTeachers = this.retrieveTeachers.bind(this);
    this.searchTeacher = this.searchTeacher.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.retrieveTutorials();
    this.retrieveTeachers();
  }

  retrieveTutorials() {
    TutorialDataService.getAll()
      .then(response => {
        response.data.forEach( obj => renameKey( obj ) );
        this.setState({
          tutorials: response.data
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

  searchTeacher(e) {
    const currentTeacherId = e.target.value;
    TutorialDataService.findByTutorialId(currentTeacherId)
      .then(response => {
        this.setState({
          tutorials: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleChange(e) {
    var array = this.state.teachers;
    const currentTeacherId = e.target.value;
    for (var i = 0; i < array.length; i++) {
      if (array[i].id === currentTeacherId) {
        this.searchTeacher(e);
        this.setState({
          //teacherId: e.target.value,
          //searchName: e.target.value
          valueTeacher: currentTeacherId
        });
        return;
      }
    }
    this.retrieveTutorials();
    //this.searchTeacher()
  }

  // retrieveSubject(id) {
  //   SubjectDataService.get(id)
  //     .then(response => {
  //       this.setState({
  //         subject: response.data.name
  //       });
  //       console.log(response.data);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  // commitChanges({ added, changed, deleted }) {
  //   this.setState((state) => {
  //     let { data } = state;
  //     if (added) {
  //       const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
  //       data = [...data, { id: startingAddedId, ...added }];
  //     }
  //     if (changed) {
  //       data = data.map(appointment => (
  //         changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment));
  //     }
  //     if (deleted !== undefined) {
  //       data = data.filter(appointment => appointment.id !== deleted);
  //     }
  //     return { data };
  //   });
  // }

  render() {
    const { classes } = this.props;
    const { tutorials, teachers, valueTeacher, resources, currentViewName, currentDate, grouping } = this.state;
    
    return (
      <>
      {tutorials ?  (
        <>
        {/* <ExternalViewSwitcher
          currentViewName={currentViewName}
          onChange={this.currentViewNameChange}
        /> */}
        <Paper>
          <Scheduler
            //data={schedulerData}
            data={tutorials}
            height={760}
          >

            <Grid
              container
              //direction="column"
              justify="flex-end"
              //alignItems="flex-start"
              className={classes.sub}
            >
              <FormControl className={classes.flexibleSpace}>
              <InputLabel id="demo-simple-select-label">Teacher</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select-outlined"
                value={valueTeacher}
                onChange={this.handleChange}
                label="Filter By Teacher"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {teachers &&
                teachers.map((teacher, index) => (
                  <MenuItem value={teacher.id} >{teacher.name}</MenuItem>
                ))}
              </Select>

              
            </FormControl>
            </Grid>

            <ViewState
            //defaultCurrentDate="2017-05-25"
            //currentDate={currentDate}

              onCurrentViewNameChange={this.currentViewNameChange}
              currentViewName={currentViewName}
            />
            <EditingState
              onCommitChanges={this.commitChanges}

            // addedAppointment={addedAppointment}
            // onAddedAppointmentChange={this.changeAddedAppointment}
            />
            <GroupingState
              grouping={grouping}
              groupByDate={isWeekOrMonthView}
            />

            <DayView
              startDayHour={9}
              endDayHour={24}
              intervalCount={1}
              timeTableCellComponent={TimeTableCellDay}
              //timeScaleLayoutComponent={TimeScaleLayoutDay}
            />
            <WeekView
              excludedDays={[0, 8]}
              startDayHour={9}
              endDayHour={24}
              timeTableCellComponent={TimeTableCellWeek}
              dayScaleCellComponent={DayScaleCell}
            />
            <MonthView />

            <Appointments
              appointmentContentComponent={AppointmentContent}
            />
            

            <Resources
              data={[
                {
                  fieldName: 'roomNum',
                  title: 'Room',
                  instances: rooms,
                },
              ]}
            />

            <IntegratedEditing />
            
            <IntegratedGrouping />

            {/* <ConfirmationDialog />
            */}
            <EditRecurrenceMenu />

            <Toolbar />

            <ViewSwitcher />
            <GroupingPanel />

          </Scheduler>
        </Paper>
        </>
      ):(
        <>
        </>
      )}
      </>

    );
  }
}

export default withStyles(styles)(ViewCalendar)