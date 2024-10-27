import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit } from "lucide-react";
import { getFeedbackByStudentId } from "@/services/FeedbackServices";
import { getTeachers } from "@/services/TeacherServices";
import { useNavigate } from "react-router-dom";
import TeacherFeedbackModal from "@/components/AddFeedBack";
import ViewFeedBack from "@/components/ViewFeedBack";
import EditFeedback from "@/components/EditFeedback";

export default function FeedbackPage() {
  const navigate = useNavigate();
  const [studentId, setStudentID] = useState();
  const [teachers, setTeachers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFeedbacks, setFilterFeedbacks] = useState([]);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState();
  const date = new Date();
  const currentDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;

  const fetchFeedbackList = async (studentId) => {
    const feedbacks = await getFeedbackByStudentId(studentId);
    setFeedbacks(feedbacks);
  };

  const fetchTeacherList = async () => {
    const teachers = await getTeachers();
    setTeachers(teachers);
  };

  useEffect(() => {
    document.title = "TFS - FEEDBACKS";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      setStudentID(id);
    }
  }, [navigate]);

  useEffect(() => {
    if (studentId) {
      fetchFeedbackList(studentId);
    }
    fetchTeacherList();
  }, [studentId, isFeedbackModalOpen]);

  const handleModalClose = () => {
    setFeedbackModalOpen(false);
    if (studentId) {
      fetchFeedbackList(studentId); // Fetch lại dữ liệu
    }
    fetchTeacherList();
  };

  const handleEdit = async (feedback) => {
    setSelectedFeedback(feedback);
    setIsEditModalOpen(true);
  };

  const handleView = async (feedback) => {
    setSelectedFeedback(feedback);
    setIsViewModalOpen(true);
  };

  useEffect(() => {
    if (feedbacks) {
      const updatedFeedbacks = feedbacks.map((feedback) => {
        const teacher = teachers.find((t) => t.id === feedback.teacherId);
        return {
          ...feedback,
          teacherName: teacher ? teacher.fullName : "Unknown",
        };
      });

      const filtered = updatedFeedbacks.filter((feedback) => (feedback.teacherName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (feedback.class?.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
      setFilterFeedbacks(filtered);
    }
  }, [feedbacks, teachers, searchTerm]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Teacher Feedback List</h1>
        <Button onClick={() => setFeedbackModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Feedback
        </Button>
        <TeacherFeedbackModal isOpen={isFeedbackModalOpen} onClose={handleModalClose} />
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Search className="h-5 w-5 text-gray-500" />
        <Input type="text" placeholder="Search teacher name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Open Date</TableHead>
            <TableHead>Close Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterFeedbacks && filterFeedbacks.length > 0 ? (
            filterFeedbacks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{task.teacherName || "Unknown"}</TableCell>
                <TableCell className="font-medium">{task.class ? task.class.name : "Unknown"}</TableCell>
                <TableCell className="font-medium text-green-700">{task.openDate}</TableCell>
                <TableCell className="font-medium text-red-700">{task.closeDate}</TableCell>
                <TableCell>{task.status === 1 && task.closeDate > currentDate ? <span className="font-bold text-green-600">Open</span> : <span className="font-bold text-red-500">Closed</span>}</TableCell>
                <TableCell>
                  <Button className="mr-2" variant="outline" size="sm" onClick={() => handleView(task)}>
                    <Edit className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button className="mr-2" variant="outline" size="sm" onClick={() => handleEdit(task)} disabled={task.status == 0 || task.closeDate < currentDate}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No feedbacks available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isViewModalOpen && selectedFeedback && (
        <ViewFeedBack
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          feedbackId = {selectedFeedback.id}
        />
      )}
      {isEditModalOpen && selectedFeedback && (
        <EditFeedback
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          feedbackId = {selectedFeedback.id}
        />
      )}
    </div>
  );
}
