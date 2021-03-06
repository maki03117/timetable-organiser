import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';

import ViewCalendar from "./components/view-calendar";
import ViewUserCalendar from "./components/view-user-calendar";

import ClassList from "./components/classes/class-list";
import AddClass from "./components/classes/add-class";
import Class from "./components/classes/class";

import SubjectList from "./components/subjects/subject-list";
import AddSubject from "./components/subjects/add-subject";
import Subject from "./components/subjects/subject";

import StudentList from "./components/students/student-list";
import AddStudent from "./components/students/add-student";
import Student from "./components/students/student";

import TeacherList from "./components/teachers/teacher-list";
import AddTeacher from "./components/teachers/add-teacher";
import Teacher from "./components/teachers/teacher";

import FeeList from "./components/fees/fee-list";

import Report from "./components/report.js";

import LogIn from "./components/login";

import AuthService from "./services/auth.service";


export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      test: 0,
      currentUser: undefined,
      moderator: false,
      admin: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        moderator: user.roles.includes("ROLE_MODERATOR"),
        admin: user.roles.includes("ROLE_ADMIN")
      });
    }
  }

  handleChange(e, newvalue) {
    this.setState({
      test: newvalue,
    });
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: undefined,
    });
  };

  render() {
    const { moderator, admin, currentUser } = this.state;

    return (
      <>
      <AppBar position="static" color="default" style={{ minWidth: '1000px' }}>
        <Toolbar>
        {currentUser ? (
          <>
          {(moderator || admin) ? (
          <>
            <Link to={"/view-calendar"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '200px' }} >Calendar</Button>
            </Link>
            <Link to={"/classes"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '200px' }} >
                Classes
              </Button>
            </Link>

            <Link to={"/students"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '200px' }} >
                Students
              </Button>
            </Link>

            <Link to={"/teachers"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '200px' }} >
                Teachers
              </Button>
            </Link>

            <Link to={"/subjects"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '200px' }} >
                Subjects
              </Button>
            </Link>

            <Link to={"/fees"} style={{ textDecoration: 'none', color: 'black', flexGrow: '1' }}>
              <Button color="inherit" style={{ width: '200px' }} >
                Fees
              </Button>
            </Link>
          </>
          ):(
            <>
              <Link to={"/view-user-calendar"} style={{ textDecoration: 'none', color: 'black' }}>
                <Button color="inherit" style={{ width: '200px' }} >Schedule</Button>
              </Link>
              <Link to={"/report"} style={{ textDecoration: 'none', color: 'black', flexGrow: '1' }}>
                <Button color="inherit" style={{ width: '200px' }} >Report</Button>
              </Link>
            </>
          )}
          <Link to={"/login"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="primary" style={{ width: '100px' }} size="small" onClick={this.logOut}>
              LogOut
            </Button>
          </Link>
          </>
        ):(
          <>
            <div style={{ flexGrow: '1' }}></div>
            <Link to={"/login"} style={{ textDecoration: 'none', color: 'black' }}>
              <Button color="inherit" style={{ width: '100px', float: "right" }} >LogIn</Button>
            </Link>
          </>
        )}
        </Toolbar> 
      </AppBar>
      

      <div>
        <Switch>
            {(moderator || admin) ? (
              <Route exact path={["/", "/view-calendar"]} component={ViewCalendar} />
            ):(
              <Route exact path={["/", "/view-user-calendar"]} component={ViewUserCalendar} />
            )}
            <Route exact path={["/", "/login"]} component={LogIn} />
            <Grid
              container
              justify="center"
            >
              <Route exact path="/classes" component={ClassList} />
              <Route exact path="/add-class" component={AddClass} />
              <Route exact path="/classes/:id" component={Class} />

              <Route exact path="/students" component={StudentList} />
              <Route exact path="/add-student" component={AddStudent} />
              <Route exact path="/students/:id" component={Student} />

              <Route exact path="/teachers" component={TeacherList} />
              <Route path="/add-teacher" component={AddTeacher} />
              <Route exact path="/teachers/:id" component={Teacher} />

              <Route exact path="/subjects" component={SubjectList} />
              <Route exact path="/add-subject" component={AddSubject} />
              <Route exact path="/subjects/:id" component={Subject} />

              <Route exact path="/fees" component={FeeList} />

              <Route exact path="/report" component={Report} />
            </Grid>
      
        </Switch>
      </div>
      </>
    );
  }
}
