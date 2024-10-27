/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { getFeedbackById, getFeedbackByStudentAndTeacherId, getFeedbackByStudentAndTeacherIdAndClassId, getFeedbackDetailById } from "@/services/FeedbackServices";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";

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

export default function ViewFeedBack({ isOpen, onClose, feedbackId }) {
  const [feedback, setFeedback] = useState(null);
  const [detail, setDetail] = useState(null);
  const [ratings, setRatings] = useState({
    punctuality: 0,
    teachingSkill: 0,
    lectureVolume: 0,
    supportInOutClass: 0,
    meetingStudentNeeds: 0,
    selfProgressAssessment: 0,
  });
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log(`view-${feedbackId}`);

    const fetchFeedback = async () => {
      if (feedbackId) {
        try {
          const feedbackData = await getFeedbackById(feedbackId);
          setFeedback(feedbackData);

          if (feedbackData) {
            const detailData = await getFeedbackDetailById(feedbackData.id);
            setDetail(detailData);

            if (detailData) {
              setRatings({
                punctuality: detailData.punctuality || 0,
                teachingSkill: detailData.teachingSkill || 0,
                lectureVolume: detailData.lectureVolume || 0,
                supportInOutClass: detailData.supportInOutClass || 0,
                meetingStudentNeeds: detailData.meetingStudentNeeds || 0,
                selfProgressAssessment: detailData.selfProgressAssessment || 0,
              });
              setComment(detailData.comment || "");
            }
          }
        } catch (error) {
          console.error("Error fetching feedback:", error);
        }
      }
    };

    fetchFeedback();
  }, [isOpen, feedbackId]);

  return (
    <>
      {feedback ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="mb-3">
              <DialogTitle>FEEDBACK DETAIL</DialogTitle>
              <DialogDescription className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <span className="font-bold">Teacher: {feedback.teacher.fullName}</span>
                <span className="font-bold">Class: {feedback.class.name}</span>
                <span className="font-bold">Open: {feedback.openDate}</span>
                <span className="font-bold">Close: {feedback.closeDate}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {detail && feedback ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Punctuality</Label>
                      <StarRating rating={ratings.punctuality} />
                    </div>
                    <div className="space-y-2">
                      <Label>Teaching Skill</Label>
                      <StarRating rating={ratings.teachingSkill} />
                    </div>
                    <div className="space-y-2">
                      <Label>Lecture Volume</Label>
                      <StarRating rating={ratings.lectureVolume} />
                    </div>
                    <div className="space-y-2">
                      <Label>Support In and Out of Class</Label>
                      <StarRating rating={ratings.supportInOutClass} />
                    </div>
                    <div className="space-y-2">
                      <Label>Meeting Student Needs</Label>
                      <StarRating rating={ratings.meetingStudentNeeds} />
                    </div>
                    <div className="space-y-2">
                      <Label>Self Progress Assessment</Label>
                      <StarRating rating={ratings.selfProgressAssessment} />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Comments</Label>
                    <Input value={comment} readOnly placeholder="No additional comments." />
                  </div>
                </>
              ) : (
                <>
                  <div className="text-gray-500">No feedback available for this teacher.</div>
                  <Link className="mr-4" variant="success" to="/feedback">
                    <Button>Create</Button>
                  </Link>
                </>
              )}
              <Button onClick={onClose}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <>Loading</>
      )}
    </>
  );
}
