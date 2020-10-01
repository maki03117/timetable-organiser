import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../../services/class.service";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { DataGrid } from '@material-ui/data-grid';

import { formatDateToString, weekday, roomNums } from '../../resources';

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
  for (var i = 0; i < students.length; i++){
    str += students[i].name;
    str += ', ';
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
  obj["studentsName"] = studentsName( obj.students );
}

const columns = [
  { headerName: 'Year', field: 'grade', width: 70 },
  { headerName: 'Subject', field: 'subject', width: 120 },
  { headerName: 'Day', field: 'day', width: 100 },
  { headerName: 'Start Time', field: 'startTime' },
  { headerName: 'End Time', field: 'endTime' },
  { headerName: 'Teacher', field: 'teacher' },
  { headerName: 'Type', field: 'type', width: 80 },
  { headerName: 'Students', field: 'studentsName', width: 350 },
  { headerName: 'Room', field: 'roomNum', width: 90 },
  { headerName: 'Notes', field: 'notes', width: 550 },
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
        {/* <Paper>
          <Grid container>
            <Grid item>
              <MaterialTable
                headerName="Classes"
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
        </Paper> */}

        <div style={{ height: 650, width: '100%' }}>
          <DataGrid rows={tutorials} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} onRowClick={((row)=>this.setActiveTutorial(row.data))} />
        </div>

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
            <></>
          )}
          <Button variant="contained" color="default" size="small" onClick={this.removeAllTutorials}> 
            Remove All
          </Button>
          <Link
            to={"/add-class"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="primary" variant="contained" size="small" onClick={this.newTutorial}>
              Add Class
            </Button>
          </Link>
        </div>
        
      </Grid>
    );
  }
}

export default withStyles(styles)(TutorialList);