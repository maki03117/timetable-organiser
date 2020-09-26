import React, { Component } from "react";
import TutorialDataService from "../services/class.service";
import TeacherDataService from "../services/teacher.service";

import Paper from '@material-ui/core/Paper';
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
  EditRecurrenceMenu,
  Toolbar,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

import { appointments, rooms, students, test } from '../resources';

function renameKey ( obj ) {
  obj["rRule"] = 'FREQ=WEEKLY';
}


const styles = ({ palette }) => ({
  weekendCell: {
    backgroundColor: fade(palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(palette.action.disabledBackground, 0.04),
    },
  },
  title: {
    fontWeight: 'bold',
    overflow: 'auto',
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
    width: "100px",
    float: 'right',
    margin: "10px"
  },
  sub: {
    marginTop: '5px'
  }
});

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

const isWeekOrMonthView = viewName => viewName === 'Day' || viewName === 'Week' || viewName === 'Month';

class ViewCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tutorials: [],
      teachers: [],
      valueTeacher: 0,

      currentViewName: 'Day',
      
      grouping: [{
        resourceName: 'roomNum',
      }, 
      // {
      //   resourceName: 'teacherId',
      // }
      ]
    };

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };

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
          valueTeacher: currentTeacherId
        });
        return;
      }
    }
    this.retrieveTutorials();
  }

  render() {
    const { classes } = this.props;
    const { tutorials, teachers, valueTeacher, currentViewName, grouping } = this.state;
    
    return (
      <>
      {tutorials ?  (
        <>
        <Paper>
          <Scheduler
            data={tutorials}
            height={760}
          >

            <Grid
              container
              justify="flex-end"
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
              onCurrentViewNameChange={this.currentViewNameChange}
              currentViewName={currentViewName}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
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