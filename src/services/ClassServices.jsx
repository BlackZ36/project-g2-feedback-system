import axios from "axios";

const API_CLASS_URL = "http://localhost:3001/classes";

export const getClassList = async () => {
  try {
    const response = await axios.get(API_CLASS_URL);
    const classes = response.data;
    return classes;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};

export const getClassById = async (id) => {
  try {
    const response = await axios.get(`${API_CLASS_URL}/${id}`);
    const classItem = response.data;
    return classItem;
  } catch (err) {
    console.log("error fetching class by id", err);
  }
};

export const getClassByStudentId = async (studentId) => {
  try {
    const response = await axios.get(API_CLASS_URL);
    const classes = response.data;
    const filteredClasses = classes.filter((classItem) => classItem.students.includes(studentId));
    return filteredClasses;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
};
