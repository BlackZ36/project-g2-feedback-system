import axios from "axios";

const API_ACCOUNT_URL = "http://localhost:3001/accounts";

export const getTeacherById = async (teacherId) => {
  try {
    const response = await axios.get(API_ACCOUNT_URL); // Sử dụng API_ACCOUNT_URL
    const teachers = response.data;
    const teacher = teachers.find((teacher) => teacher.id === teacherId);
    return teacher || null;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }
};

export const getTeachers = async () => {
  try {
    const response = await axios.get(API_ACCOUNT_URL);
    const accountList = response.data;
    const teachers = accountList.filter((teacher) => teacher.role === "teacher");
    return teachers || null;
  } catch (error) {
    console.error("Error fetching teacher list:", error);
    return null;
  }
};

export const getTeachersByIds = async (teacherIds) => {
  try {
    const response = await axios.get(API_ACCOUNT_URL);
    const teachers = response.data;
    const filteredTeachers = teachers.filter((teacher) => teacherIds.includes(teacher.id));
    return filteredTeachers;
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
};
