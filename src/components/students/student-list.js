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
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

const styles = theme => ({
  root: {
    width: '500px',
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


class StudentList extends Component {
  constructor(props) {
    super(props);
    //this.onChangeSearchGrade = this.onChangeSearchGrade.bind(this);
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveStudent = this.setActiveStudent.bind(this);
    this.removeAllStudents = this.removeAllStudents.bind(this);
    //this.searchGrade = this.searchGrade.bind(this);

    this.handleClose = this.handleClose.bind(this);

    this.state = {
        students: [],
        currentStudent: null,
        currentIndex: -1,
        searchGrade: "",
        open: false,
        selectedRow: 0,
    };
  }

  componentDidMount() {
    this.retrieveStudents();
  }

  // onChangeSearchGrade(e) {
  //   const searchGrade = e.target.value;

  //   this.setState({
  //     searchGrade: searchGrade
  //   });
  // }

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

  refreshList() {
    this.retrieveStudents();
    this.setState({
        currentStudent: null,
        currentIndex: -1
    });
  }

  setActiveStudent(student) {
    // if (rows.length > 1) {
    //   this.setState({
    //     open: true,
    //     message: "Please select ONE student!"
    //   });
    // }
    this.setState({
      currentStudent: student,
      selectedRow: student.id
      //currentIndex: index
    });
    //console.log(this.state.currentStudent.id);
  }

  removeAllStudents() {
    StudentDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

  // searchGrade() {
  //   StudentDataService.findByGrade(this.state.searchGrade)
  //     .then(response => {
  //       this.setState({
  //         students: response.data
  //       });
  //       console.log(response.data);
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const { classes } = this.props;
    const { students, currentStudent, currentIndex, searchGrade, open } = this.state;

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      >
        {/* <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <TextField
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
            }}
            inputProps={{ 'aria-label': 'search' }}
            value={searchGrade}
            onChange={this.onChangeSearchGrade}
          />
        </div> */}

        <Paper>
          <Grid container>
            <Grid item>
              <MaterialTable
                title="Students"
                columns={columns}
                data={students}
                onRowClick={((evt, selectedRow) => this.setActiveStudent(selectedRow))}
                options={{
                  grouping: true,
                  pageSize: 10,
                  //selection: true,
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                  })
                }}
                //onRowClick={(event, rowData) => this.setActiveStudent(rowData, 0)}
                //onSelectionChange={(rows, rowData)=>this.setActiveStudent(rows, rowData, 0)}
              />
              <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
                <Alert severity="error" onClose={this.handleClose}>{this.state.message}</Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </Paper>

        <div className={classes.sub}>
          {currentStudent ? (
            <Link
              to={"/students/" + currentStudent.id}
              className={classes.link}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <Button variant="contained" color="secondary" size="small">Edit</Button>
            </Link>
          ) : (
            <>
            </>
          )}
          <Button variant="contained" color="default" size="small" onClick={this.removeAllStudents}> 
            Remove All
          </Button>
          <Link
            to={"add-student"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="primary" variant="contained" size="small" onClick={this.newStudent}>
              Add Student
            </Button>
          </Link>
        </div>

      </Grid>
    );
  }
}

export default withStyles(styles)(StudentList);