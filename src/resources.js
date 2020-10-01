export function studentsName( students ) {
  var str = "";
  for (var i = 0; i < students.length; i++){
    str += students[i].name;
    str += ' ';
  }
  return str;
}

export const appointments = [
  {
    id: 0,
    title: 'Watercolor Landscape',
    roomNum: 3,
    grade: "Y4",
    num: 1,
    type: "Private",
    subjectId: 1,
    notes: "test",
    startDate: "2020-09-18T18:00:00.000",
    endDate: "2020-09-18T19:00:00.000",
    //rRule: 'FREQ=WEEKLY;COUNT=10',
    subject: {
      id: 1,
      name: "English",
      createdAt: "2020-09-11T16:42:34.000Z",
      updatedAt: "2020-09-12T23:15:14.000Z"
    },
    teacher: {
      id: 1,
      name: "박샘",
      phoneNum: null,
      address: null,
      notes: null,
      createdAt: "2020-09-14T03:03:18.000Z",
      updatedAt: "2020-09-14T03:03:18.000Z"
    },
    students: [
      {
          id: 3,
          name: "Ela",
          grade: "Y6",
          phoneNum: null,
          address: null,
          notes: null
      },
      {
        id: 3,
        name: "Maki",
        grade: "Y6",
        phoneNum: null,
        address: null,
        notes: null
      },
      {
        id: 3,
        name: "Maki",
        grade: "Y6",
        phoneNum: null,
        address: null,
        notes: null
      },
      {
        id: 3,
        name: "Maki",
        grade: "Y6",
        phoneNum: null,
        address: null,
        notes: null
      },
      {
        id: 3,
        name: "Maki",
        grade: "Y6",
        phoneNum: null,
        address: null,
        notes: null
      },
      {
        id: 3,
        name: "Maki",
        grade: "Y6",
        phoneNum: null,
        address: null,
        notes: null
      },
    ]
  },
  {
    id: 1,
    title: 'Test',
    startDate: "2020-09-18T20:00:00.000",
    endDate: "2020-09-18T21:00:00.000",
    grade: "Y4",
    type: "Private",
    roomNum: 3,
    notes: "",
    createdAt: "2020-09-16T20:16:27.000Z",
    updatedAt: "2020-09-16T20:16:27.000Z",
    subjectId: 2,
    num: 2,
    subject: {
      id: 1,
      name: "English",
      createdAt: "2020-09-11T16:42:34.000Z",
      updatedAt: "2020-09-12T23:15:14.000Z"
    },
    teacher: {
      id: 1,
      name: "박샘",
      phoneNum: null,
      address: null,
      notes: null,
      createdAt: "2020-09-14T03:03:18.000Z",
      updatedAt: "2020-09-14T03:03:18.000Z"
    },
    students: [
        {
            id: 3,
            name: "Ela",
            grade: "Y6",
            phoneNum: null,
            address: null,
            notes: null
        }
    ]
  }
  // {
  //   id: 0,
  //   title: 'Watercolor Landscape',
  //   roomId: 1,
  //   teacherId: 1,
  //   members: [1], startDate: '2020-09-09T09:45', endDate: '2020-09-09T11:00', //rRule: 'FREQ=WEEKLY;COUNT=10',
  // }, {
  //   id: 1,
  //   title: 'Oil Painting for Beginners',
  //   roomId: 2,
  //   members: [2],
  //   startDate: new Date(2020, 9, 9, 9, 30),
  //   endDate: new Date(2020, 9, 9, 11),
  //   rRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
  // }, {
  //   id: 2,
  //   title: 'Testing',
  //   roomId: 3,
  //   members: [3],
  //   startDate: new Date(2020, 9, 7, 12, 0),
  //   endDate: new Date(2020, 9, 7, 13, 0),
  //   rRule: 'FREQ=WEEKLY;BYDAY=MO;WKST=TU;INTERVAL=2;COUNT=2',
  // }, {
  //   id: 3,
  //   title: 'Meeting of Instructors',
  //   roomId: 9,
  //   members: [9, 1],
  //   startDate: new Date(2020, 9, 1, 9, 0),
  //   endDate: new Date(2020, 9, 1, 9, 15),
  //   rRule: 'FREQ=DAILY;BYDAY=WE;UNTIL=20200601',
  // }, {
  //   id: 9,
  //   title: 'Recruiting students',
  //   roomId: 5,
  //   members: [3, 9, 5],
  //   startDate: new Date(2020, 9, 26, 10, 0),
  //   endDate: new Date(2020, 9, 26, 11, 0),
  //   rRule: 'FREQ=YEARLY;BYWEEKNO=23',
  //   exDate: '20200611T100000',
  // }, {
  //   id: 5,
  //   title: 'Final exams',
  //   roomId: 3,
  //   members: [2, 3],
  //   startDate: new Date(2020, 9, 26, 12, 0),
  //   endDate: new Date(2020, 9, 26, 13, 35),
  //   rRule: 'FREQ=YEARLY;BYWEEKNO=29;BYDAY=TH,FR',
  // }, {
  //   id: 6,
  //   title: 'Monthly Planning',
  //   roomId: 9,
  //   members: [1, 3],
  //   startDate: new Date(2020, 9, 26, 19, 30),
  //   endDate: new Date(2020, 9, 26, 15, 95),
  //   rRule: 'FREQ=MONTHLY;BYMONTHDAY=27;COUNT=1',
  // }, {
  //   id: 7,
  //   title: 'Open Day',
  //   roomId: 5,
  //   members: [1, 3, 5],
  //   startDate: new Date(2020, 9, 1, 9, 30),
  //   endDate: new Date(2020, 9, 1, 13),
  //   rRule: 'FREQ=YEARLY;BYYEARDAY=198',
  // },
];


export const rooms = [
  {
    id: 1,//'R1',
    text: 'Room 1',
  }, 
  {
    id: 2,//'R2',
    text: 'Room 2',
  },
  {
    id: 3,//'R3',
    text: 'Room 3',
  }, 
  {
    id: 4,//'R4',
    text: 'Room 4',
  }, 
  {
    id: 5,//'R5',
    text: 'Room 5',
  },
  {
    id: 6,//'R6',
    text: 'Room 6',
  },
  {
    id: 7,//'R7',
    text: 'Room 7',
  },
  {
    id: 8,//'KR',
    text: 'Kitchen Room',
  }
];

export const types = ['Group', 'Private']

// export const tutorialType = [
// {
//   text: 'Group',
//   id: 1,
//   //color: red,
// }, {
//   text: 'Private',
//   id: 2,
//   //color: red,
// },
// ];

export const grades = ['Y2', 'Y3', 'Y4', 'Y5', 'Y6', 'Y7', 'Y8', 'Y9', 'Y10', 'Y11', 'Y12', 'Y13'];

export function formatDateToString(date) { 
  const h = (date.getHours() < 10 ? '0' : '') 
          + date.getHours(); 
            
  const m = ((date.getMinutes()) < 10 ? '0' : '') 
          + (date.getMinutes()); 
            
  return h+":"+m; 
} 

export const weekday = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday"
}

export const roomNums = {
  1: "Room 1",
  2: "Room 2",
  3: "Room 3",
  4: "Room 4",
  5: "Room 5",
  6: "Room 6",
  7: "Room 7",
  8: "K Room",
}

//  export const grades = [
//   {
//     text: 'Year 2',
//     id: 2,
//     //color: red,
//   }, {
//     text: 'Year 3',
//     id: 3,
//     //color: purple,
//   }, {
//     text: 'Year 4',
//     id: 4,
//     //color: deepPurple,
//   }, {
//     text: 'Year 5',
//     id: 5,
//     //color: indigo,
//   }, {
//     text: 'Year 6',
//     id: 6,
//     //color: blue,
//   }, {
//     text: 'Year 7',
//     id: 7,
//     //color: lightBlue,
//   }, {
//     text: 'Year 8',
//     id: 8,
//     //color: cyan,
//   }, {
//     text: 'Year 9',
//     id: 9,
//     //color: cyan,
//   },  {
//     text: 'Year 10',
//     id: 10,
//     //color: cyan,
//   }, {
//     text: 'Year 11',
//     id: 11,
//     //color: cyan,
//   }, {
//     text: 'Year 12',
//     id: 12,
//     //color: cyan,
//   }, {
//     text: 'Year 13',
//     id: 13,
//     //color: cyan,
//   },
// ];

//const COLOR = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange];

// export const teachers = [
//   {
//     text: '박샘',
//     id: 1,
//     color: COLOR[0],
//   }, 
// ];

// export const students = [
//   {
//     text: 'Andrew Glover',
//     id: 1,
//     //color: '#7E57C2',
//   }, {
//     text: 'Arnie Schwartz',
//     id: 2,
//     //color: '#FF7093',
//   }, {
//     text: 'John Heart',
//     id: 3,
//     //color: '#E91E63',
//   }, {
//     text: 'Taylor Riley',
//     id: 9,
//     color: '#E91E63',
//   }, {
//     text: 'Brad Farkus',
//     id: 5,
//     color: '#AB97BC',
//   }, {
//     text: 'Arthur Miller',
//     id: 6,
//     color: '#FFA726',
//   },
// ];
