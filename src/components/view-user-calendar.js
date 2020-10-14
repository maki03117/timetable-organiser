import React, { Component } from "react";
import TutorialDataService from "../services/class.service";
import TeacherDataService from "../services/teacher.service";

import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import { withStyles } from '@material-ui/core/styles';
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

import AuthService from "../services/auth.service";

import { appointments, rooms, students, test } from '../resources';

const types = [{
  id: 0,
  text: 'Group',
}, 
{
  id: 1,
  text: 'Private',
}]

function renameKey ( obj ) {
  const s = new Date(obj.startDate);
  const e = new Date(obj.endDate);
  const start = s.getFullYear() + "-" + (s.getMonth()+1 < 10 ? '0' : '') + (s.getMonth()+1) + "-" + (s.getDate() < 10 ? '0' : '') +s.getDate();
  const end = e.getFullYear() + "-" + (e.getMonth()+1 < 10 ? '0' : '') + (e.getMonth()+1) + "-" + (e.getDate() < 10 ? '0' : '') + e.getDate();;
  if (start != end) {
    obj.endDate = start + "T" + (e.getHours() < 10 ? '0' : '') + e.getHours() + ":" + (e.getMinutes() < 10 ? '0' : '') + e.getMinutes() + ":00.000";
    obj["rRule"] = 'FREQ=WEEKLY;UNTIL='+ e.getFullYear() + (e.getMonth()+1 < 10 ? '0' : '') + (e.getMonth()+1) + (e.getDate()+1) + "T000000";
  }else {
    obj["rRule"] = 'FREQ=WEEKLY';
  }

  if (obj.type == "Private") {
    obj["type"] = 1
  } else {
    obj["type"] = 0
  }
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
  },
  pos: {
    height: '50px',
    margin: '10px',
    float: 'left'
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
      {/* <div className={classes.textContainer}>
        <div className={classes.time}>
          {formatDate(data.startDate.toString(), { hour: 'numeric', minute: 'numeric' })}
        </div>
        <div className={classes.time}>
          {' - '}
        </div>
        <div className={classes.time}>
          {formatDate(data.endDate.toString(), { hour: 'numeric', minute: 'numeric' })}
        </div>
      </div> */}
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

const AppointmentBase = ({
  data,
  handleChange,
  ...restProps
}) => (
  <React.Fragment>
    <Appointments.Appointment
      {...restProps} data={data} onClick={(data)=>(handleChange(data.data))} 
    ></Appointments.Appointment>
  </React.Fragment>
);

const isWeekOrMonthView = viewName => viewName === 'Day' || viewName === 'Week' || viewName === 'Month';

const Appointment = withStyles(styles, { name: 'Appointment' })(AppointmentBase);

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
      ],
      students: [],
    };

    this.currentViewNameChange = (currentViewName) => {
      this.setState({ currentViewName });
    };

    this.retrieveTeacher = this.retrieveTeacher.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.myAppointment = this.myAppointment.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.retrieveTeacher(user.teacherId)
    }
  }

  retrieveTeacher(currentTeacherId) {
    TutorialDataService.findByTutorialId(currentTeacherId)
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

  handleClick(obj) {
    this.setState({ 
      students: obj.students 
    });
  }

  myAppointment(props) {
    return (
      <Appointment
        {...props}
        handleChange={this.handleClick}
      />
    );
  }

  render() {
    const { classes } = this.props;
    const { tutorials, teachers, valueTeacher, currentViewName, grouping, students } = this.state;
    
    return (
      <>
      {tutorials ?  (
        <>
        <Paper>
          <Scheduler
            data={tutorials}
            // height={760}
          >

            <Grid
              container
              justify="flex-end"
              className={classes.sub}
            >
              {students && students.map((student, index) => (
                <Card className={classes.pos}>
                <CardContent>
                <Typography >
                  {student.name}
                </Typography>
                </CardContent>
              </Card>
              ))}

            </Grid>

            <ViewState
              onCurrentViewNameChange={this.currentViewNameChange}
              currentViewName={currentViewName}
            />
            <EditingState
              onCommitChanges={this.commitChanges}
            />
            {/* <GroupingState
              grouping={grouping}
              groupByDate={isWeekOrMonthView}
            /> */}

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
              appointmentComponent={this.myAppointment}
              appointmentContentComponent={AppointmentContent}
            />
            

            <Resources
              data={[
                {
                  fieldName: 'teacherId',
                  title: 'Teacher',
                  instances: teachers,
                },
              ]}
            />

            <IntegratedEditing />
            
            {/* <IntegratedGrouping /> */}

            <EditRecurrenceMenu />

            <Toolbar />

            <ViewSwitcher />
            {/* <GroupingPanel /> */}

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