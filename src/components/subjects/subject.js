import React, { Component } from "react";
import { Link } from "react-router-dom";
import SubjectDataService from "../../services/subject.service";

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    margin: '10px',
    //padding: '20px',
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
})

class Subject extends Component {
  constructor(props) {
    super(props);
    this.onChangeName = this.onChangeName.bind(this);
    this.getSubject = this.getSubject.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.deleteSubject = this.deleteSubject.bind(this);

    this.state = {
      currentSubject: {
        id: null,
        name: "",
      },
      done: false,
      message: ""
    };
  }

  componentDidMount() {
    this.getSubject(this.props.match.params.id);
  }

  onChangeName(e) {
    const name = e.target.value;

    this.setState(function(prevState) {
      return {
        currentSubject: {
          ...prevState.currentSubject,
          name: name
        }
      };
    });
  }

  getSubject(id) {
    SubjectDataService.get(id)
      .then(response => {
        this.setState({
          currentSubject: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateSubject() {
    SubjectDataService.update(
      this.state.currentSubject.id,
      this.state.currentSubject
    )
      .then(response => {
        console.log(response.data);
        this.setState({
          done: true,
          message: "The subject was updated successfully!"
        });
      
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteSubject() {    
    SubjectDataService.delete(this.state.currentSubject.id)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/subjects')
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleClose() {
    this.setState({
      done: false
    });
  }

  render() {
    const { classes } = this.props;
    const { currentSubject, done } = this.state;

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
          {currentSubject ? (
            <Paper className={classes.sub}>
              <Grid container
                direction="column"
                justify="flex-start"
                alignItems="flex-start"
              >
                <FormControl style={{width: '500px'}}>
                  <TextField
                    id="subject-input" 
                    label="Subject"
                    defaultValue={currentSubject.name}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.onChangeName}
                  />
                </FormControl>
                <div className={classes.sub} >
                  <Button variant="contained" color="secondary" size="small" onClick={this.updateSubject}> {/*className={classes.root}> */}
                    Update
                  </Button>
                  <Button variant="contained" color="default" size="small" onClick={this.deleteSubject}> {/*className={classes.root}> */}
                    Delete
                  </Button>
                  <Snackbar open={done} autoHideDuration={6000} onClose={this.handleClose}>
                    <Alert severity="success" onClose={this.handleClose}>{this.state.message}</Alert>
                  </Snackbar>
                </div>
              </Grid>
            </Paper>
          ) : (
            <Alert severity="warning">Please click on a Subject!</Alert>
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Subject);