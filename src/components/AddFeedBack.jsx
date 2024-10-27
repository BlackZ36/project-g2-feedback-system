/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getClassByStudentId } from "@/services/ClassServices";
import { addFeedback, addFeedbackDetail, getFeedbackByStudentAndTeacherIdAndClassId } from "@/services/FeedbackServices";
import { Input } from "@/components/ui/input";
import { getAccountById } from "@/services/AccountServices";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { getClassById } from "@/services/ClassServices";

const attributes = ["Punctuality", "Teaching Skill", "Lecture Volume", "Support In & Out Class", "Meeting Student Needs", "Self Progress Assessment"];

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

export default function TeacherFeedbackModal({ isOpen, onClose }) {
  const [studentId, setStudentId] = useState();
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState();
  const [selectedTeacher, setSelectedTeacher] = useState();
  const [ratings, setRatings] = useState(Object.fromEntries(attributes.map((attr) => [attr, 0])));
  const [comment, setComment] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const openFirst = new Date();
  const closeFirst = new Date(openFirst); 
  closeFirst.setDate(closeFirst.getDate() + 1);
  const openDate = `${openFirst.getDate().toString().padStart(2, "0")}/${(openFirst.getMonth() + 1).toString().padStart(2, "0")}/${openFirst.getFullYear()}`;
  const closeDate = `${closeFirst.getDate().toString().padStart(2, "0")}/${(closeFirst.getMonth() + 1).toString().padStart(2, "0")}/${closeFirst.getFullYear()}`;
  const navigate = useNavigate();

  // Check login
  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      setStudentId(parseInt(id));
    }
  }, [navigate]);

  useEffect(() => {
    if (studentId) fetchClasses();
  }, [studentId]);

  const fetchClasses = async () => {
    try {
      const classList = await getClassByStudentId(studentId);
      setClasses(classList);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleRatingChange = (attribute, newRating) => {
    setRatings((prev) => ({ ...prev, [attribute]: newRating }));
  };

  const handleClassSelect = async (classId) => {
    const selectedClass = await classes.find((classItem) => classItem.id == classId);
    const feedbackExist = await getFeedbackByStudentAndTeacherIdAndClassId(studentId, selectedClass.teacherId, classId);
    if (!feedbackExist.length > 0) {
      const teacher = await getAccountById(selectedClass.teacherId);
      setSelectedTeacher(teacher);
      setClassId(classId);
    } else {
      setSelectedTeacher(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allRatingsProvided = attributes.every((attr) => ratings[attr] !== undefined);

    if (!classId) {
      setDialogMessage("Please select class");
      setDialogOpen(true);
      return;
    }

    if (!selectedTeacher) {
      setDialogMessage("Please select teacher");
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

    const teacher = await getAccountById(selectedTeacher.id);
    const student = await getAccountById(studentId);
    const classItem = await getClassById(classId);
    const feedback = {
      teacherId: teacher.id,
      studentId: studentId,
      classId: parseInt(classId),
      openDate: openDate,
      closeDate: closeDate,
      modified: null,
      status: 1,
      student: {
        id: student.id,
        name: student.name,
        fullName: student.fullName,
      },
      teacher: {
        id: teacher.id,
        name: teacher.name,
        fullName: teacher.fullName,
      },
      class: {
        id: classItem.id,
        name: classItem.name,
      },
    };

    addFeedback(feedback).then((data) => {
      const feedbackDetail = {
        feedbackId: data.id,
        punctuality: ratings["Punctuality"] || 0,
        teachingSkill: ratings["Teaching Skill"] || 0,
        lectureVolume: ratings["Lecture Volume"] || 0,
        supportInOutClass: ratings["Support In & Out Class"] || 0,
        meetingStudentNeeds: ratings["Meeting Student Needs"] || 0,
        selfProgressAssessment: ratings["Self Progress Assessment"] || 0,
        comment: comment || "",
      };
      addFeedbackDetail(feedbackDetail).then(() => {
        onClose(); // Close modal on successful submission
      });
    });
  };

  const handleReset = () => {
    setRatings(Object.fromEntries(attributes.map((attr) => [attr, 0])));
    setComment("");
    setSelectedTeacher(null);
    setClassId(0);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Feedback Form</DialogTitle>
            <DialogDescription>Provide feedback for the teacher and class.</DialogDescription>
          </DialogHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-1">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select onValueChange={handleClassSelect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a class" value={0} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Class</SelectLabel>
                      {classes?.length > 0 ? (
                        classes.map((classItem) => (
                          <SelectItem key={classItem.id} value={String(classItem.id)}>
                            <p>{classItem.name}</p>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key="0" value="0" disabled>
                          No classes available
                        </SelectItem>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teacher Name</Label>
                <Input type="text" value={selectedTeacher ? selectedTeacher.fullName + ` (${selectedTeacher.name})` : "No teacher available"} disabled={!selectedTeacher} readOnly />
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
          <DialogFooter>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
