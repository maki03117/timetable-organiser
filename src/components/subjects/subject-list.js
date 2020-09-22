import React, { Component } from "react";
import { Link } from "react-router-dom";
import SubjectDataService from "../../services/subject.service";

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

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
  }
})


class SubjectList extends Component {
  constructor(props) {
    super(props);
    //this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);

    this.retrieveSubjects = this.retrieveSubjects.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveSubject = this.setActiveSubject.bind(this);
    this.removeAllSubjects = this.removeAllSubjects.bind(this);

    //this.searchTitle = this.searchTitle.bind(this);

    this.state = {
        subjects: [],
        currentSubject: null,
        currentIndex: -1,
        //searchTitle: ""
        selectedIndex: -1
    };
  }

  componentDidMount() {
    this.retrieveSubjects();
  }

//   onChangeSearchTitle(e) {
//     const searchTitle = e.target.value;

//     this.setState({
//       searchTitle: searchTitle
//     });
//   }

  retrieveSubjects() {
    SubjectDataService.getAll()
        .then(response => {
          this.setState({
              subjects: response.data
          });
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
  }

  refreshList() {
    this.retrieveSubjects();
    this.setState({
        currentSubject: null,
        currentIndex: -1
    });
  }

  setActiveSubject(subject, index) {
    this.setState({
      currentSubject: subject,
      currentIndex: index
    });
  }

  removeAllSubjects() {
    SubjectDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  }

//   searchTitle() {
//     SubjectDataService.findByTitle(this.state.searchTitle)
//       .then(response => {
//         this.setState({
//           Subjects: response.data
//         });
//         console.log(response.data);
//       })
//       .catch(e => {
//         console.log(e);
//       });
//   }

  render() {
    const { classes } = this.props;
    const { subjects, currentSubject, currentIndex } = this.state;

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
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Subjects
                </ListSubheader>
                }
                className={classes.li}
              >
                {subjects &&
                  subjects.map((subject, index) => (
                    <ListItem 
                      button 
                      selected={currentIndex === index}
                      onClick={() => this.setActiveSubject(subject, index)}
                      key={index}
                    >
                      <ListItemText
                        primary={subject.name}
                      />
                    </ListItem>

                  ))}
              </List>
            </Grid>
          </Grid>
        </Paper>

        <div className={classes.sub}>
          {currentSubject ? (
            <Link
              to={"/subjects/" + currentSubject.id}
              className={classes.link}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <Button variant="contained" color="secondary" size="small">Edit</Button>
            </Link>
          ) : (
            <>
            </>
          )}
          <Button variant="contained" color="default" size="small" onClick={this.removeAllSubjects}>
            Remove All
          </Button>
          <Link
            to={"add-subject"}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="primary" variant="contained" size="small" onClick={this.newSubject}>
              Add Subject
            </Button>
          </Link>
        </div>

      </Grid>
    );
  }
}

export default withStyles(styles)(SubjectList);