
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
