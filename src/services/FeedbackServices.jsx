// src/services/accountService.jsx
import axios from "axios";

const API_FEEDBACK_URL = "http://localhost:3001/feedbacks";
const API_DETAIL_URL = "http://localhost:3001/feedbackDetails";

export const getFeedbackByStudentAndTeacherId = async (studentId, teacherId) => {
  try {
    const response = await axios.get(`${API_FEEDBACK_URL}`, {
      params: {
        studentId,
        teacherId,
      },
    });
    const feedback = response.data;
    return feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

export const getFeedbackById = async (id) => {
  try {
    const response = await axios.get(`${API_FEEDBACK_URL}/${id}`);
    const feedback = response.data;
    return feedback;
  } catch (error) {
    console.error("Error fetching feedback by id:", error);
    throw error;
  }
};

export const getFeedbackByStudentAndTeacherIdAndClassId = async (studentId, teacherId, classId) => {
  try {
    const response = await axios.get(`${API_FEEDBACK_URL}`, {
      params: {
        studentId,
        teacherId,
        classId,
      },
    });
    const feedback = response.data;
    return feedback;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

export const getFeedbackByStudentId = async (studentId) => {
  try {
    if (studentId) {
      const response = await axios.get(`${API_FEEDBACK_URL}`, {
        params: {
          studentId,
        },
      });

      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};

export const getFeedbackByTeacherId = async (teacherId) => {
  try {
    if (teacherId) {
      const response = await axios.get(`${API_FEEDBACK_URL}`, {
        params: {
          teacherId,
        },
      });
      return response.data;
    }
  } catch (err) {
    console.log("error when fetching feedback by teacherId");
    throw err;
  }
};

export const getFeedbackDetailById = async (feedbackId) => {
  try {
    const response = await axios.get(`${API_DETAIL_URL}`);
    const details = response.data;

    const feedbackDetail = details.find((detail) => detail.feedbackId === feedbackId);

    return feedbackDetail || null;
  } catch (error) {
    console.error("Error fetching feedback details:", error);
    throw error;
  }
};

export const addFeedback = async (feedback) => {
  try {
    const response = await fetch(API_FEEDBACK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error("Failed to add feedback");
    }

    const data = await response.json();
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error adding feedback:", error);
  }
};

// Hàm thêm feedback detail
export const addFeedbackDetail = async (feedbackDetail) => {
  try {
    const response = await fetch(API_DETAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackDetail),
    });

    if (!response.ok) {
      throw new Error("Failed to add feedback detail");
    }

    const data = await response.json();
    return data; // Trả về dữ liệu phản hồi từ server
  } catch (error) {
    console.error("Error adding feedback detail:", error);
  }
};

export const updateFeedback = async (id, feedback) => {
  try {
    const response = await axios.put(`${API_FEEDBACK_URL}/${id}`, feedback);
    return response.data;
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};

export const updateFeedbackDetail = async (id, feedbackDetail) => {
  try {
    const response = await axios.put(`${API_DETAIL_URL}/${id}`, feedbackDetail);
    return response.data;
  } catch (error) {
    console.error("Error updating feedback:", error);
    throw error;
  }
};
