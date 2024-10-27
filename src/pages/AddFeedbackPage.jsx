/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClassByStudentId } from "@/services/ClassServices";
import { getTeachers } from "@/services/TeacherServices";
import { addFeedback, addFeedbackDetail, getFeedbackByStudentId } from "@/services/FeedbackServices";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getAccountById } from "@/services/AccountServices";

const attributes = ["punctuality", "teachingSkill", "lectureVolume", "supportInOutClass", "meetingStudentNeeds", "selfProgressAssessment"];

function StarRating({ rating, onRatingChange }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" className={`p-1 ${star <= rating ? "text-orange-500" : "text-gray-300"}`} onClick={() => onRatingChange(star)}>
          <Star className="w-6 h-6" />
        </button>
      ))}
    </div>
  );
}

export default function TeacherFeedbackForm() {
  const [studentId, setStudentId] = useState();
  const [teachers, setTeachers] = useState();
  const [teacherId, setTeacherId] = useState();
  const [ratings, setRatings] = useState(Object.fromEntries(attributes.map((attr) => [attr, 0])));
  const [comment, setComment] = useState("");
  const [classes, setClasses] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const date = new Date().toISOString();
  const navigate = useNavigate();

  //chekc login
  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      setStudentId(parseInt(id));
    }
  }, [navigate]);

  //fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classList = await getClassByStudentId(parseInt(studentId));
        setClasses(classList);
        const teacherList = await getTeachers();
        const feedbackList = await getFeedbackByStudentId(studentId);

        const feedbackTeacherIds = feedbackList.map((feedback) => parseInt(feedback.teacherId));
        const filteredTeachers = teacherList.filter((teacher) => !feedbackTeacherIds.includes(parseInt(teacher.id)) && classList.some((classItem) => parseInt(classItem.teacherId) === parseInt(teacher.id)));
        setTeachers(filteredTeachers);
      } catch (err) {
        console.log("Error when fetching data", err);
      }
    };

    fetchData();
  }, [studentId]);

  const handleRatingChange = (attribute, newRating) => {
    setRatings((prev) => ({ ...prev, [attribute]: newRating }));
  };

  const handleTeacherSelect = (teacherId) => {
    setTeacherId(teacherId);
    console.log(`selected teacher id: ${teacherId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allRatingsProvided = attributes.every((attr) => ratings[attr] !== undefined);

    if (!teacherId) {
      setDialogMessage("Please select teacher field");
      setDialogOpen(true);
      return;
    }

    if (!allRatingsProvided) {
      setDialogMessage("Please rate all attributes before submitting.");
      setDialogOpen(true);
      return;
    }

    if (!comment.trim()) {
      setDialogMessage("Please provide your additional comments before submitting.");
      setDialogOpen(true);
      return;
    }

    console.log("Submitting feedback:", { teacherId, studentId, ratings, date });

    const student = await getAccountById(studentId);
    const teacher = await getAccountById(teacherId);
    const feedback = {
      teacherId: parseInt(teacherId),
      studentId: parseInt(studentId),
      openDate: date,
      closeDate: date + 3,
      modified: null,
      status: 1,
      teacher: {
        id: teacher.id,
        name: teacher.name,
        fullName: teacher.fullName
      },
      student: {
        id: student.id,
        name: student.name,
        fullName: student.fullName
      }
    };

    addFeedback(feedback).then((data) => {
      console.log("Feedback added:", data);
      const feedbackDetail = {
        feedbackId: data.id,
        punctuality: ratings.punctuality || 0,
        teachingSkill: ratings.teachingSkill || 0,
        lectureVolume: ratings.lectureVolume || 0,
        supportInOutClass: ratings.supportInOutClass || 0,
        meetingStudentNeeds: ratings.meetingStudentNeeds || 0,
        selfProgressAssessment: ratings.selfProgressAssessment || 0,
        comment: comment,
      };
      addFeedbackDetail(feedbackDetail).then((data) => {
        console.log("Feedback detail added:", data);
      });
    });
    navigate("/teachers");
  };

  const handleReset = () => {
    setRatings(Object.fromEntries(attributes.map((attr) => [attr, 0])));
    setComment("");
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-5">
        <CardHeader>
          <CardTitle>Teacher Feedback Form</CardTitle>
          <CardDescription>Please provide your feedback for the teacher and class.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="space-y-2">
              <Label>Teacher Name</Label>
              <Select value={teacherId} onValueChange={handleTeacherSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Teacher</SelectLabel>
                    {teachers?.length > 0 ? (
                      teachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          <p>{teacher.name}</p>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem key="0" value="0" disabled>
                        No teachers available
                      </SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {attributes.map((attribute) => (
              <div key={attribute} className="space-y-2">
                <Label>{attribute}</Label>
                <StarRating rating={ratings[attribute]} onRatingChange={(newRating) => handleRatingChange(attribute, newRating)} />
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="comment">Additional Comments</Label>
              <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Enter any additional feedback here..." required />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </CardFooter>
      </Card>
      <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Action Required</AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDialogOpen(false)}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
