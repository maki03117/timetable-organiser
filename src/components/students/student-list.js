import React, { Component } from "react";
import { Link } from "react-router-dom";
import StudentDataService from "../../services/student.service";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListSubheader from '@material-ui/core/ListSubheader';
import { DataGrid } from '@material-ui/data-grid';

const styles = theme => ({
  root: {
    width: '100%',
    margin: '20px'
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
})

const columns = [
  { headerName: 'Name', field: 'name' },
  { headerName: 'Year', field: 'grade' },
  { headerName: 'Contact', field: 'phoneNum', width: 150},
  // { headerName: 'Address', field: 'address', width: 300 },
  // { headerName: 'Notes', field: 'notes', width: 300 },
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
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        className={classes.root}
      >
        <Grid item style={{ height: 650, width: '650px' }}>
          <Grid item style={{ height: 650, width: '100%' }}>
            <DataGrid rows={students} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} onRowClick={((row)=>this.setActiveStudent(row.data))} />
            <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert severity="error" onClose={this.handleClose}>{this.state.message}</Alert>
            </Snackbar>
          </Grid>

          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            className={classes.sub}
          >
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
              <Button color="primary" variant="contained" size="small" >
                Add Student
              </Button>
            </Link>
          </Grid>
        </Grid>

        {currentStudent ? (
          <Paper className={classes.sub} style={{ width: '300px' }}>
            <Grid 
              item 
            >
              <List style={{ overflowWrap: 'break-word'  }}>
                <ListSubheader component="div" id="nested-list-subheader">
                  Address
                </ListSubheader>
                <ListItem>
                  <ListItemText
                    primary={currentStudent.address}
                  />
                </ListItem>
                <Divider />
                <ListSubheader component="div" id="nested-list-subheader">
                  Notes
                </ListSubheader>
                <ListItem>
                  <ListItemText
                    primary={currentStudent.notes}
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

export default withStyles(styles)(StudentList);