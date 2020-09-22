import React, { Component } from "react";
import { Link } from "react-router-dom";
import TutorialDataService from "../../services/tutorial.service";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
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
    this.onChangeSearchName = this.onChangeSearchName.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.removeAllTutorials = this.removeAllTutorials.bind(this);
    //this.searchName = this.searchName.bind(this);

    this.state = {
        tutorials: [],
        currentTutorial: null,
        currentIndex: -1,
        searchName: "",
        open: false,
        selectedRow: 0,
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchName(e) {
    const searchName = e.target.value;

    this.setState({
      searchName: searchName
    });
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
        currentTutorial: null,
        currentIndex: -1
    });
  }

  setActiveTutorial(tutorial) {
    // if (rows.length > 1) {
    //   this.setState({
    //     open: true,
    //     message: "Please select ONE tutorial!"
    //   });
    // }
    this.setState({
      currentTutorial: tutorial,
      selectedRow: tutorial.id
      //currentIndex: index
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

//   searchName() {
//     TutorialDataService.findByName(this.state.searchName)
//       .then(response => {
//         this.setState({
//           Tutorials: response.data
//         });
//         console.log(response.data);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   }

  render() {
    const { classes } = this.props;
    const { tutorials, currentTutorial, currentIndex, searchName } = this.state;

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
                  //selection: true
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                  })
                }}
                //onSelectionChange={(rows, rowData)=>this.setActiveTutorial(rows, rowData, 0)}
                
              />
            </Grid>
          </Grid>
        </Paper>

        <div className={classes.sub}>
          {currentTutorial ? (
            <Link
              to={"/tutorials/" + currentTutorial.id}
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