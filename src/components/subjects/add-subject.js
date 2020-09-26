import React, { Component } from "react";
import { Link } from "react-router-dom";
import SubjectDataService from "../../services/subject.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: '20px',
    padding: '20px',
    '& > * .MuiTextField-root': {
      margin: theme.spacing(1),
    },
  },
  sub: {
    '& > * ': {
      margin: theme.spacing(1),
    },
    padding: '5px',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
})

class AddSubject extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.saveSubject = this.saveSubject.bind(this);
    this.newSubject = this.newSubject.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      id: null,
      name: "",

      submitted: false,
      open: false,
      message: ""
    };
  }
  
  onChangeName(e) {
    const name = e.target.value;
    this.setState({
      name: name
    });
  }

  saveSubject() {
    const name = e.target.value;
    var data = {
      name: name
    };

    SubjectDataService.create(data)
      .then(response => {
        this.setState({
          id: response.data.id,
          name: response.data.name,

          submitted: true,
          open: true,
          message: "Successfully submitted!"
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  newSubject() {
    this.setState({
      id: null,
      name: "",

      submitted: false
    });
  } 

  handleClose() {
    this.setState({
      open: false
    });
  };

  render() {
    const { classes } = this.props;
    const {open} = this.state;
    
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
            to={"/subjects"}
            style={{ textDecoration: 'none', color: 'white' }}
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
                <InputLabel htmlFor="subject-input">Enter Subject</InputLabel>
                <Input 
                  id="subject-input" 
                  aria-describedby="my-helper-text" 
                  value={this.state.name}
                  onChange={this.onChangeName}
                  
                  fullWidth={true}
                />
              </FormControl>
              <Grid
                className={classes.formControl}
                style={{width: '100%'}}
              >
                <Button style={{float: 'right', marginRight: "20px", marginTop: "10px"}} variant="contained" color="primary" size="small" onClick={this.saveSubject}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Paper>
          
        </Grid>
        {this.state.submitted ? (
          <div style={{width:'300px'}} className={classes.sub}>
            <Snackbar open={open} autoHideDuration={6000} onClose={this.handleClose}>
              <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
            </Snackbar>
            <Button variant="contained" size="small" onClick={this.newSubject}>
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

export default withStyles(styles)(AddSubject)