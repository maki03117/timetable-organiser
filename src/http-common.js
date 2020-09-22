import axios from "axios";

export default axios.create({
  baseURL: "https://nodejs-express-mysqldb.herokuapp.com/api",
  headers: {
    "Content-type": "application/json"
  }
});