import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../../services/class.service";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import MaterialTable from 'material-table';

import { formatDateToString, weekday, roomNums } from '../../resources';

const styles = theme => ({
  root: {
    width: '1000px',
    margin: '20px'
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
  }
})

function renameKey ( obj ) {
  const start = new Date(obj.startDate);
  const end = new Date(obj.endDate);
  obj["day"] = weekday[start.getDay()];
  obj["startTime"] = formatDateToString(start);//start.getHours().toString()+":"+start.getMinutes().toString();
  obj["endTime"] = formatDateToString(end);//end.getHours().toString()+":"+end.getMinutes().toString();
  obj["subject"] = obj.subject.name;
  obj["teacher"] = obj.teacher.name;
  obj["roomNum"] = roomNums[obj.roomNum];
}

const columns = [
  { title: 'Grade', field: 'grade' },
  { title: 'Subject', field: 'subject' },
  { title: 'Day', field: 'day' },
  { title: 'Start Time', field: 'startTime' },
  { title: 'End Time', field: 'endTime' },
  { title: 'Teacher', field: 'teacher' },
  { title: 'Type', field: 'type' },
  { title: 'Number of Students', field: 'students.length' },
  { title: 'Room', field: 'roomNum' },
  { title: 'Notes', field: 'notes' },
];

class TutorialList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);

    this.state = {
      tutorials: [],
      currentTutorial: null,
      open: false,
      selectedRow: 0,
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
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

  refreshList() {
    this.retrieveTutorials();
    this.setState({
      currentTutorial: null
    });
  }

  setActiveTutorial(tutorial) {
    this.setState({
      currentTutorial: tutorial,
      selectedRow: tutorial.id
    });
  }

  removeAllTutorials() {
    TutorialDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
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
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Paper>
          <Grid container>
            <Grid item>
              <MaterialTable
                title="Classes"
                columns={columns}
                data={tutorials}
                onRowClick={((evt, selectedRow) => this.setActiveTutorial(selectedRow))}
                options={{
                  grouping: true,
                  pageSize: 10,
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                  })
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        <div className={classes.sub}>
          {currentTutorial ? (
            <Link
              to={"/classes/" + currentTutorial.id}
              className={classes.link}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <Button variant="contained" color="secondary" size="small">Edit</Button>
            </Link>
          ) : (
            <>
            </>
          )}
          <Button variant="contained" color="default" size="small" onClick={this.removeAllTutorials}> 
            Remove All
          </Button>
          <Link
            to={"/add-tutorial"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="primary" variant="contained" size="small" onClick={this.newTutorial}>
              Add Tutorial
            </Button>
          </Link>
        </div>
        
      </Grid>
    );
  }
}

export default withStyles(styles)(TutorialList);