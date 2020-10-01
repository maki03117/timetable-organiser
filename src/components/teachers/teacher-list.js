import React, { Component } from "react";
import { Link } from "react-router-dom";
import TeacherDataService from "../../services/teacher.service";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '700px',
    margin: '20px'
  },
  sub: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  table: {
    minWidth: 650,
  }
})


class TeacherList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTeachers = this.retrieveTeachers.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTeacher = this.setActiveTeacher.bind(this);
    this.removeAllTeachers = this.removeAllTeachers.bind(this);

    this.state = {
      teachers: [],
      currentTeacher: null,
      currentIndex: -1,
    };
  }

  componentDidMount() {
    this.retrieveTeachers();
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

  refreshList() {
    this.retrieveTeachers();
    this.setState({
      currentTeacher: null,
      currentIndex: -1
    });
  }

  setActiveTeacher(teacher, index) {
    this.setState({
      currentTeacher: teacher,
      currentIndex: index
    });
  }

  removeAllTeachers() {
    TeacherDataService.deleteAll()
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
    const { teachers, currentTeacher, currentIndex } = this.state;

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
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Contact</TableCell>
                      <TableCell align="right">Address</TableCell>
                      <TableCell align="right">Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teachers &&
                      teachers.map((teacher, index) => (
                      <TableRow 
                        hover
                        selected={currentIndex === index}
                        onClick={() => this.setActiveTeacher(teacher, index)}
                        key={index}
                      >
                        <TableCell component="th" scope="Teacher">
                          {teacher.name}
                        </TableCell>
                        <TableCell align="right">{teacher.phoneNum}</TableCell>
                        <TableCell align="right">{teacher.address}</TableCell>
                        <TableCell align="right">{teacher.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Paper>

        <div className={classes.sub}>
          {currentTeacher ? (
            <Link
              to={"/teachers/" + currentTeacher.id}
              className={classes.link}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <Button variant="contained" color="secondary" size="small">Edit</Button>
            </Link>
          ) : (
            <></>
          )}
          <Button variant="contained" color="default" size="small" onClick={this.removeAllTeachers}> 
            Remove All
          </Button>
          <Link
            to={"add-Teacher"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="primary" variant="contained" size="small" onClick={this.newTeacher}>
              Add Teacher
            </Button>
          </Link>
        </div>

      </Grid>
    );
  }
}

export default withStyles(styles)(TeacherList);