import React, { Component } from "react";
import { Link } from "react-router-dom";
import TeacherDataService from "../../services/teacher.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';

import { grades } from '../../resources';

const styles = theme => ({
  root: {
     margin: '20px',
     padding: '10px',
  },
  sub: {
    '& > * ': {
      margin: theme.spacing(1),
    },
  },
  formControl: {
    minWidth: 120,
  },
})

class Teacher extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    //this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTeacher = this.getTeacher.bind(this);
    //this.updatePublished = this.updatePublished.bind(this);
    this.updateTeacher = this.updateTeacher.bind(this);
    this.deleteTeacher = this.deleteTeacher.bind(this);

    this.state = {
      currentTeacher: {
        id: null,
        name: "",
        phoneNum: "",
        address:  "",
        notes: "",
      },
      done: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getTeacher(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentTeacher: {
          ...prevState.currentTeacher,
          name: name
        }
      };
    });
  }

  onChangePhoneNum(e) {
    const phoneNum = e.target.value;

    this.setState(prevState => ({
      currentTeacher: {
        ...prevState.currentTeacher,
        phoneNum: phoneNum
      }
    }));
  }

  onChangeAddress(e) {
    const address = e.target.value;

    this.setState(prevState => ({
      currentTeacher: {
        ...prevState.currentTeacher,
        address: address
      }
    }));
  }

  onChangeNotes(e) {
    const notes = e.target.value;

    this.setState(prevState => ({
      currentTeacher: {
        ...prevState.currentTeacher,
        notes: notes
      }
    }));
  }

  getTeacher(id) {
    TeacherDataService.get(id)
      .then(response => {
        this.setState({
          currentTeacher: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTeacher() {
    TeacherDataService.update(
      this.state.currentTeacher.id,
      this.state.currentTeacher
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          done: true,
          message: "The teacher was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteTeacher() {    
    TeacherDataService.delete(this.state.currentTeacher.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/teachers')
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const { classes } = this.props;
    const { currentTeacher, done } = this.state;

    return (
      <div className={classes.root}>
        <Grid
          container
          direction="column"
          justify="flex-start"
          alignItems="flex-start"
          className={classes.sub}
        >
          <Link
            to={"/teachers"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          {currentTeacher ? (
            <Paper className={classes.sub}>
              <Grid container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="teacher-name" 
                    label="Teacher"
                    placeholder={currentTeacher.name}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangeName}
                  />
                </FormControl>
                
                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Teacher-phoneNum" 
                    label="Teacher Phone Number"
                    placeholder={currentTeacher.phoneNum}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangePhoneNum}
                  />
                </FormControl>

                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Teacher-address" 
                    label="Teacher Address"
                    placeholder={currentTeacher.address}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}

                    onChange={this.onChangeAddress}
                  />
                </FormControl>
                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="Teacher-notes"
                    label="Notes"
                    placeholder={currentTeacher.notes}
                    multiline
                    rows={3}
                    variant="outlined"
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.onChangeNotes}

                    // fullWidth={true}
                  />
                </FormControl>
                <div className={classes.sub} >
                  <Button variant="contained" color="secondary" size="small" onClick={this.updateTeacher}> {/*className={classes.root}> */}
                    Update
                  </Button>
                  <Button variant="contained" color="default" size="small" onClick={this.deleteTeacher}> {/*className={classes.root}> */}
                    Delete
                  </Button>
                  {done ? (
                    <Alert severity="success">{this.state.message}</Alert>
                  ):(
                    <>
                    </>
                  )}
                </div>
              </Grid>
            </Paper>
          ) : (
            <Alert severity="warning">Please click on a teacher!</Alert>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Teacher);