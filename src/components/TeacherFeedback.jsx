/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { getFeedbackByTeacherId, getFeedbackDetailById } from "@/services/FeedbackServices";
import { Star } from "lucide-react";

export function TeacherFeedback({ isOpen, onClose, teacherId }) {
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackDetailData, setFeedbackDetailData] = useState([]);

  function calculateAverageRating(feedbackDetail) {
    const criteria = [feedbackDetail.punctuality, feedbackDetail.teachingSkill, feedbackDetail.lectureVolume, feedbackDetail.supportInOutClass, feedbackDetail.meetingStudentNeeds, feedbackDetail.selfProgressAssessment];
    const totalRating = criteria.reduce((sum, rating) => sum + rating, 0);
    const averageRating = totalRating / criteria.length;
    return `${averageRating.toFixed(1)}/5`;
  }

  useEffect(() => {
    if (isOpen && teacherId) {
      const fetchFeedbackData = async () => {
        try {
          const data = await getFeedbackByTeacherId(teacherId);
          const details = await Promise.all(
            data.map(async (item) => {
              return await getFeedbackDetailById(item.id);
            })
          );

          setFeedbackData(data);
          setFeedbackDetailData(details);
        } catch (error) {
          console.error("Error fetching feedback data:", error);
        }
      };

      fetchFeedbackData();
    }
  }, [isOpen, teacherId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Teacher Feedback</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[300px] w-full pr-4">
          {feedbackData && feedbackData.length > 0 ? (
            feedbackData.map((feedback, index) => (
              <Card key={index} className="mb-4">
                <CardContent className="pt-4">
                  <p className="font-semibold">Student: {feedback.student.fullName}</p>
                  <p className="text-sm mt-3 flex items-center">
                    Grade: <span className="flex items-center ml-1 font-bold">{calculateAverageRating(feedbackDetailData.find((f) => f.feedbackId === feedback.id))}</span>
                    <Star className="w-5 h-5 text-orange-500 ml-1" />
                  </p>
                  {/* <p className="text-sm  mt-3">Comment: {feedbackDetailData.find((f) => f.feedbackId == feedback.id).comment || "unknown"}</p> */}
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No feedback available.</p>
          )}
        </ScrollArea>

        <Button onClick={onClose} variant="outline" className="mt-4">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
