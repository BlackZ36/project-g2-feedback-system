/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { getFeedbackById, getFeedbackDetailById, updateFeedback } from "@/services/FeedbackServices";
import { Input } from "./ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { updateFeedbackDetail } from "./../services/FeedbackServices";

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

export default function EditFeedback({ isOpen, onClose, feedbackId }) {
  const [feedback, setFeedback] = useState(null);
  const [detail, setDetail] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [ratings, setRatings] = useState({
    punctuality: 0,
    teachingSkill: 0,
    lectureVolume: 0,
    supportInOutClass: 0,
    meetingStudentNeeds: 0,
    selfProgressAssessment: 0,
  });
  const [comment, setComment] = useState("");
  const date = new Date();
  const modifiedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

  useEffect(() => {
    const fetchFeedback = async () => {
      console.log("edit: ", feedbackId);
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

  const handleUpdate = async () => {
    if (!comment) {
      setDialogMessage("Comment can not be empty");
      setDialogOpen(true);
      return;
    }

    const updatedFeedback = {
      ...feedback,
      modified: modifiedDate,
    };

    const updatedFeedbackDetail = {
      punctuality: ratings.punctuality,
      teachingSkill: ratings.teachingSkill,
      lectureVolume: ratings.lectureVolume,
      supportInOutClass: ratings.supportInOutClass,
      meetingStudentNeeds: ratings.meetingStudentNeeds,
      selfProgressAssessment: ratings.selfProgressAssessment,
      comment,
      feedbackId,
    };

    console.log(("feedback:", updatedFeedback));

    console.log("detail:", updatedFeedbackDetail);

    try {
      await updateFeedback(feedbackId, updatedFeedback);
      await updateFeedbackDetail(feedbackId, updatedFeedbackDetail);
      onClose();
    } catch (error) {
      console.error("Error updating feedback:", error);
      alert("Failed to update feedback.");
    }
  };

  return (
    <>
      {feedback ? (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader className="mb-3">
              <DialogTitle>EDIT FEEDBACK</DialogTitle>
              <DialogDescription className="grid grid-cols-1 md:grid-cols-2 gap-1">
                <span className="font-bold"> Teacher:{feedback.teacher.fullName}</span>

                <span className="font-bold"> Class:{feedback.class.name}</span>

                <span className="font-bold"> Open:{feedback.openDate}</span>

                <span className="font-bold">Close:{feedback.closeDate}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {detail && feedback ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Punctuality</Label>
                      <StarRating rating={ratings.punctuality} onRatingChange={(value) => setRatings({ ...ratings, punctuality: value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Teaching Skill</Label>
                      <StarRating rating={ratings.teachingSkill} onRatingChange={(value) => setRatings({ ...ratings, teachingSkill: value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Lecture Volume</Label>
                      <StarRating rating={ratings.lectureVolume} onRatingChange={(value) => setRatings({ ...ratings, lectureVolume: value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Support In and Out of Class</Label>
                      <StarRating rating={ratings.supportInOutClass} onRatingChange={(value) => setRatings({ ...ratings, supportInOutClass: value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Meeting Student Needs</Label>
                      <StarRating rating={ratings.meetingStudentNeeds} onRatingChange={(value) => setRatings({ ...ratings, meetingStudentNeeds: value })} />
                    </div>
                    <div className="space-y-2">
                      <Label>Self Progress Assessment</Label>
                      <StarRating rating={ratings.selfProgressAssessment} onRatingChange={(value) => setRatings({ ...ratings, selfProgressAssessment: value })} />
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label>Comments</Label>
                    <Input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add your comments." />
                  </div>
                </>
              ) : (
                <div className="text-gray-500">No feedback available for this teacher.</div>
              )}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>Update</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <>Loading</>
      )}
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
