import React, { Component } from "react";
import { Link } from "react-router-dom";
import TeacherDataService from "../../services/teacher.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import MenuItem from '@material-ui/core/MenuItem';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';

import { grades } from '../../resources';

const styles = theme => ({
  root: {
    margin: '20px'
  },
  sub: {
    '& > * .MuiTextField-root': {
      margin: theme.spacing(1),
    },
    marginTop: '15px',
    padding: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
})

class AddTeacher extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangePhoneNum = this.onChangePhoneNum.bind(this);
    this.onChangeAddress = this.onChangeAddress.bind(this);
    this.onChangeNotes = this.onChangeNotes.bind(this);
    this.saveTeacher = this.saveTeacher.bind(this);
    this.newTeacher = this.newTeacher.bind(this);
    //this.handleChange = this.handleChange.bind(this);

    this.state = {
      id: null,
      name: "",
      phoneNum: "",
      address:  "",
      notes: "",

      value: '',
      submitted: false
    };
  }
  
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }

  onChangePhoneNum(e) {
    this.setState({
      phoneNum: e.target.value
    });
  }

  onChangeAddress(e) {
    this.setState({
      address: e.target.value
    });
  }

  onChangeNotes(e) {
    this.setState({
      notes: e.target.value
    });
  }

  saveTeacher() {
    var data = {
      name: this.state.name,
      phoneNum: this.state.phoneNum,
      address:  this.state.address,
      notes: this.state.notes
    };

    TeacherDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,
          phoneNum: response.data.phoneNum,
          address: response.data.address,
          notes: response.data.notes,

          submitted: true
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  newTeacher() {
    this.setState({
      id: null,
      name: "",
      phoneNum: "",
      address:  "",
      notes: "",

      submitted: false
    });
  } 

  // handleChange(event) {
  //   this.setState({
  //     value: event.target.value
  //   });
  // };

  render() {
    const { classes } = this.props;
    const { value } = this.state;
    
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
            //className="badge badge-warning"
          >
            <Button variant="outlined" size="small">
              Go Back
            </Button>
          </Link>
          <Paper className={classes.sub}>
            <Grid container
              direction="column"
              justify="flex-start"
              alignItems="flex-start"
            >
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-name" 
                  label="Teacher Name"
                  value={this.state.name}
                  onChange={this.onChangeName}
                />
              </FormControl>

              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-phoneNum" 
                  label="Teacher Phone Number"
                  value={this.state.phoneNum}
                  onChange={this.onChangePhoneNum}
                />
              </FormControl>
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="subject-address" 
                  label="Teacher Address"
                  value={this.state.address}
                  onChange={this.onChangeAddress}
                />
              </FormControl>
              <FormControl style={{width: '500px'}}>
                <TextField
                  id="Teacher-notes"
                  label="Notes"
                  placeholder="Anything to note about the teacher?"
                  multiline
                  rows={3}
                  value={this.state.notes}
                  onChange={this.onChangeNotes}
                  variant="outlined"
                  margin="normal"

                  // fullWidth={true}
                />
              </FormControl>
                <Grid
                  className={classes.sub}
                >
                  <Button style={{textAlign: 'right', paddingRight: '10px'}} variant="contained" color="primary" size="small" onClick={this.saveTeacher}>
                    Submit
                  </Button>
                </Grid>

            </Grid>
          </Paper>
          
        </Grid>
        {this.state.submitted ? (
          <div style={{width:'300px'}} className={classes.sub}>
            <Alert severity="success" className={classes.sub}>Submitted successfully!</Alert>
            <Button variant="contained" onClick={this.newTeacher}>
              Add More
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(AddTeacher)