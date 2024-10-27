import "./App.css";
import React, { useRef, useEffect } from "react";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FeedbackPage from "./pages/FeedbackPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import TeacherPage from "./pages/TeacherPage";
import ClassPage from "./pages/ClassPage";
import ErrorPage from "./pages/ErrorPage";
import Index from "./pages/Index";
import TeacherFeedbackForm from "./pages/AddFeedbackPage";
import FeedbackForTeacherPage from "./pages/Teacher/FeedbackForTeacherPage";

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="theme">
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/teachers" element={<TeacherPage />} />
              <Route path="/classes" element={<ClassPage />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/add-feedback" element={<TeacherFeedbackForm />} />
              <Route path="/teacher-feedback" element={<FeedbackForTeacherPage />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
