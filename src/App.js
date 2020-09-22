import React, { useState, useEffect } from 'react';
import { Router, Switch, Route, Link } from "react-router-dom";
import { createStore } from 'redux';
import { connect, Provider } from 'react-redux';
import { createBrowserHistory as history} from 'history';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';


import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import TabList from '@material-ui/lab/TabList';

import Grid from '@material-ui/core/Grid';
//import { students } from '../../../demo-data/tasks';


import ViewCalendar from "./components/view-calendar";

import ClassList from "./components/tutorials/class-list";
import AddClass from "./components/tutorials/add-class";
import Class from "./components/tutorials/class";

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
import AddFee from "./components/fees/add-fee";
import Fee from "./components/fees/fee";

import LogIn from "./components/login";

import AuthService from "./services/auth.service";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



// function a11yProps(index) {
//   return {
//     id: `full-width-tab-${index}`,
//     'aria-controls': `full-width-tabpanel-${index}`,
//   };
// }

// const ViewSwitcher = ({test, handleChange}) => {
//     switch (test) {
//       case 1:
//         return <>
//         <AppBar position="static">
//           <Tabs value={test} onChange={handleChange} aria-label="simple tabs example">
//             <Link to={"/tutorials"} style={{ textDecoration: 'none', color: 'black' }}>
//               <Tab label="Classes List" />
//             </Link>
//             <Link to={"/add-tutorial"} style={{ textDecoration: 'none', color: 'black' }}>
//               <Tab label="Add Class" />
//             </Link>
//           </Tabs>
//         </AppBar>
//         </>;
//       case 2:
//         return  <>
//           <Link to={"/students"} style={{ textDecoration: 'none', color: 'black' }}>
//             <Tab label="Students List" value="1" />
//           </Link>
//           <Link to={"/add-student"} style={{ textDecoration: 'none', color: 'black' }}>
//             <Tab label="Add Student" value="2" />
//           </Link>
//         </>;
//       case 3:
//         return <>
//           <Link to={"/tutorials"} style={{ textDecoration: 'none', color: 'black' }}>
//             <Tab label="Classes List" value="1" />
//           </Link>
//           <Link to={"/add-tutorial"} style={{ textDecoration: 'none', color: 'black' }}>
//             <Tab label="Add Class" value="2" />
//           </Link>
//         </>;
//       default:
//         return null;
//     }
// };



export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      test: 0,
      value: 0,
      currentAnchorEl: null,
      anchorEl: null,
      currentUser: undefined,
    };

    //this.changeAddedAppointment = this.changeAddedAppointment.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logOut = this.logOut.bind(this);
    // this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
      });

      // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

  }

  // handleClick(e, newvalue) {
  //   this.setState({
  //       value: newvalue,
  //       currentAnchorEl: e.currentTarget,
  //       anchorEl: e.currentTarget
  //     });
  // }

  // handleClose() {
  //   this.setState({
  //       currentAnchorEl: null,
  //       anchorEl: null
  //     });
  // }

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
    const { data, resources, currentViewName, currentDate, grouping, test, value, currentAnchorEl, anchorEl, currentUser } = this.state;

  // const FlexibleSpace = withStyles(styles, { name: 'FlexibleSpace' })(
  //   ({ classes, ...restProps }) => (
  //     <Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}>
  //       <ExternalViewSwitcher
  //         currentViewName={currentViewName}
  //         onChange={this.currentViewNameChange}
  //       />
  //     </Toolbar.FlexibleSpace>
  //   ),
  // );


    return (
      <>
      {/* <AppBar position="static" color="default">
        <Tabs
          onChange={this.handleClick}
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Link to={"/view-calendar"} style={{ textDecoration: 'none', color: 'black' }}>
            <Tab label="Calendar" {...a11yProps(0)} />
          </Link>
          <Link to={"/classes"} style={{ textDecoration: 'none', color: 'black' }}>
            <Tab label="Classes" {...a11yProps(1)} />
          </Link>
          <Link to={"/subjects"} style={{ textDecoration: 'none', color: 'black' }}>
            <Tab label="Subjects" {...a11yProps(2)} />
          </Link>
        </Tabs>
      </AppBar> */}
      <AppBar position="static" color="default">
        <Toolbar>
      {currentUser ? (
        <>
          <Link to={"/view-calendar"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} >Calendar</Button>
          </Link>
          <Link to={"/tutorials"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Classes
            </Button>
          </Link>

          <Link to={"/students"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Students
            </Button>
          </Link>

          <Link to={"/teachers"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Teachers
            </Button>
          </Link>

          <Link to={"/subjects"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Subjects
            </Button>
          </Link>

          <Link to={"/fees"} style={{ textDecoration: 'none', color: 'black', flexGrow: '1' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Fees
            </Button>
          </Link>
          {/* <div style={{ flexGrow: '1' }}></div> */}
          <Link to={"/login"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="primary" style={{ width: '100px' }} aria-controls="simple-menu" aria-haspopup="true" size="small" onClick={this.logOut}>
              LogOut
            </Button>
          </Link>

          {/* <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >Fees</Button>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            keepMounted
            open={this.anchorEl === currentAnchorEl}
            onClose={this.handleClose}
            color="inherit"
          >
            <Link to={"/fees"} style={{ textDecoration: 'none', color: 'black' }}>
              <MenuItem >Fees List</MenuItem>
            </Link>
            <Link to={"/add-fee"} style={{ textDecoration: 'none', color: 'black' }}>
              <MenuItem >Add Fee</MenuItem>
            </Link>
          </Menu> */}
        </>
      
      ):(
        
<>
        <div style={{ flexGrow: '1' }}></div>
          <Link to={"/login"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '100px', float: "right" }} >LogIn</Button>
          </Link>
          {/* <Link to={"/register"} style={{ textDecoration: 'none', color: 'black' }}>
            <Button color="inherit" style={{ width: '200px' }} aria-controls="simple-menu" aria-haspopup="true" >
              Fees
            </Button>
          </Link> */}
</>

      
      
      )}
        </Toolbar> 
      </AppBar>
      

      <div>
        <Switch>
            <Route exact path={["/", "/login"]} component={LogIn} />
            <Route exact path={["/view-calendar"]} component={ViewCalendar} />
            <Grid
              container
              justify="center"
            >

              <Route exact path="/tutorials" component={ClassList} />
              <Route exact path="/add-tutorial" component={AddClass} />
              <Route exact path="/tutorials/:id" component={Class} />

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
              <Route exact path="/add-fee" component={AddFee} />
              <Route exact path="/fees/:id" component={Fee} />
            </Grid>
      
        </Switch>
      </div>

      

        
      </>
    );
  }
}
