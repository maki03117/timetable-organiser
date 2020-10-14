import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../services/class.service";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import AuthService from "../services/auth.service";

import { formatDateToString, weekday, roomNums } from '../resources';

const styles = theme => ({
  root: {
    width: '100%',
    margin: '20px'
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
})

function studentsName( students ) {
  var str = "";
  if(students != null) {
    for (var i = 0; i < students.length; i++){
      str += students[i].name;
      str += ' ';
    }
  }
  return str;
}

function renameKey ( obj ) {
  const start = new Date(obj.startDate);
  const end = new Date(obj.endDate);
  obj["day"] = weekday[start.getDay()];
  obj["startTime"] = formatDateToString(start);//start.getHours().toString()+":"+start.getMinutes().toString();
  obj["endTime"] = formatDateToString(end);//end.getHours().toString()+":"+end.getMinutes().toString();
  obj["subject"] = obj.subject.name;
  if(obj.teacher == null) {
    obj["teacher"] = "Unknown";
  } else {
    obj["teacher"] = obj.teacher.name;
  }
  obj["roomNum"] = roomNums[obj.roomNum];
  // obj["studentsName"] = studentsName( obj.students );
}

const columns = [
  { headerName: 'Year', field: 'grade', width: 70 },
  { headerName: 'Subject', field: 'subject', width: 120 },
  { headerName: 'Day', field: 'day', width: 100 },
  { headerName: 'Start Time', field: 'startTime' },
  { headerName: 'End Time', field: 'endTime' },
  { headerName: 'Teacher', field: 'teacher', width: 120 },
  { headerName: 'Type', field: 'type', width: 80 },
  // { headerName: 'Students', field: 'studentsName', width: 350 },
  { headerName: 'Room', field: 'roomNum', width: 90 },
  // { headerName: 'Notes', field: 'notes', width: 550 },
];

class TutorialList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      open: false,
      selectedRow: 0,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.retrieveTutorials(user.teacherId)
    }
  }

  retrieveTutorials(currentTeacherId) {
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

  render() {
    const { classes } = this.props;
    const { tutorials, currentTutorial } = this.state;

    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item style={{ height: 650, width: '800px' }}>
          <Typography className={classes.pos} color="textSecondary">
            Please Select a Class
          </Typography>
          <Grid item style={{ height: 650, width: '100%' }}>
            <DataGrid rows={tutorials} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} onRowClick={((row)=>this.setActiveTutorial(row.data))} />
          </Grid>

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            className={classes.sub}
          >
            {currentTutorial ? (
              <Link
                to={"/classes/" + currentTutorial.id}
                className={classes.link}
                style={{ textDecoration: 'none', color: 'white' }}
              >
                <Button variant="contained" color="secondary" size="small">Make report</Button>
              </Link>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
        {currentTutorial ? (
          <Paper className={classes.sub} style={{ width: '300px'}}>
            <Grid 
              item 
            >
              <List style={{ overflowWrap: 'break-word'  }}>
                <ListSubheader component="div" id="nested-list-subheader">
                  Students
                </ListSubheader>
                {currentTutorial.students &&
                currentTutorial.students.map((student) => (
                  <ListItem >
                    <ListItemText
                      primary={student.name}
                    />
                  </ListItem>
                ))}
                <Divider />
                <ListSubheader component="div" id="nested-list-subheader">
                  Notes
                </ListSubheader>
                <ListItem>
                  <ListItemText
                    primary={currentTutorial.notes}
                  />
                </ListItem>
              </List>
            </Grid>
          </Paper>
        ):
        (
          <></>
        )
        }
      </Grid>
    );
  }
}

export default withStyles(styles)(TutorialList);