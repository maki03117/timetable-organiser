import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/tutorials");
  }

  get(id) {
    return http.get(`/tutorials/${id}`);
  }

  create(data) {
    return http.post("/tutorials", data);
  }

  addStudent(data) {
    return http.put("/tutorials", data);
  }

  deleteStudent(id, data) {
    return http.delete(`/tutorials/${id}`, data);
  }

  update(id, data) {
    return http.put(`/tutorials/${id}`, data);
  }

  delete(id) {
    return http.delete(`/tutorials/${id}`);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTutorialId(teacherId) {
    return http.get(`/tutorials?teacherId=${teacherId}`);
  }
}

export default new TutorialDataService();