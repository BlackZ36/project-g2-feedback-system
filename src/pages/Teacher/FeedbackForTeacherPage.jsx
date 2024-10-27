import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFeedbackByTeacherId, getFeedbackDetailById } from "@/services/FeedbackServices";
import { Star, StarHalf } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex">
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          {index < fullStars ? <Star className="w-4 h-4 text-yellow-400 fill-current" /> : index === fullStars && hasHalfStar ? <StarHalf className="w-4 h-4 text-yellow-400 fill-current" /> : <Star className="w-4 h-4 text-gray-300" />}
        </span>
      ))}
    </div>
  );
};

export default function FeedbackForTeacherPage() {
  const navigate = useNavigate();
  const [teacherId, setTeacherId] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [details, setDetails] = useState([]);

  //get teacher id
  useEffect(() => {
    document.title = "TFS - MY FEEDBACK";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      setTeacherId(parseInt(id));
    }
  }, [navigate]);

  //fetch data
  useEffect(() => {
    if (teacherId) {
      const fetchFeedbackData = async () => {
        try {
          const data = await getFeedbackByTeacherId(teacherId);
          const details = await Promise.all(
            data.map(async (item) => {
              return await getFeedbackDetailById(item.id);
            })
          );

          setFeedbacks(data);
          setDetails(details);
        } catch (error) {
          console.error("Error fetching feedback data:", error);
        }
      };

      fetchFeedbackData();
    }
  }, [teacherId]);

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const studentName = feedback.student.fullName.toLowerCase();
    const className = feedback.class.name.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return studentName.includes(lowerCaseSearchTerm) || className.includes(lowerCaseSearchTerm);
  });

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Student Feedback</h1>
      <Input
        type="text"
        placeholder="Search by student name or class name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        className="mb-4 p-5"
      />
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback, index) => {
            const feedbackDetail = details.find((detail) => detail.feedbackId === feedback.id);
            return (
              <Card key={index} className="w-full">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <h2 className="text-xl font-semibold">Student: {feedback.student.fullName}</h2>
                    <p className="text-sm text-muted-foreground">{feedback.class.name}</p>
                  </div>

                  {feedbackDetail && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Punctuality</p>
                          <StarRating rating={feedbackDetail.punctuality} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Teaching Skill</p>
                          <StarRating rating={feedbackDetail.teachingSkill} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Lecture Volume</p>
                          <StarRating rating={feedbackDetail.lectureVolume} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Support In Out Class</p>
                          <StarRating rating={feedbackDetail.supportInOutClass} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Meeting Student Needs</p>
                          <StarRating rating={feedbackDetail.meetingStudentNeeds} />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium mb-1 capitalize">Self Progress Assessment</p>
                          <StarRating rating={feedbackDetail.selfProgressAssessment} />
                        </div>
                      </div>
                      <div className="flex flex-col mt-10">
                        <p className="text-sm font-medium mb-1 capitalize">Comment</p>
                        <Input className="text-gray-700 w-full h-5 p-5" value={feedbackDetail.comment} readOnly />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
