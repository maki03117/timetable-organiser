import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import MaterialTable from 'material-table';

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
    this.retrieveStudents = this.retrieveStudents.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveStudent = this.setActiveStudent.bind(this);
    this.removeAllStudents = this.removeAllStudents.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
        students: [],
        currentStudent: null,
        open: false,
        selectedRow: 0,
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

  refreshList() {
    this.retrieveStudents();
    this.setState({
      currentStudent: null
    });
  }

  setActiveStudent(student) {
    this.setState({
      currentStudent: student,
      selectedRow: student.id
    });
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

  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const { classes } = this.props;
    const { students, currentStudent, open } = this.state;

    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
        className={classes.root}
      >
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
                  rowStyle: rowData => ({
                    backgroundColor: (this.state.selectedRow === rowData.id) ? '#EEE' : '#FFF'
                  })
                }}
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
            <></>
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