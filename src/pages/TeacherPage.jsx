import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTeachers } from "@/services/TeacherServices";
import { getClassByStudentId } from "@/services/ClassServices";
import { useNavigate } from "react-router-dom";
import { TeacherModal } from "@/components/TeacherModal";
import { TeacherFeedback } from "@/components/TeacherFeedback";

export default function TeacherPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(0);
  const [teachers, setTeachers] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([null]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [feedbackTeacher, setFeedbackTeacher] = useState(null);

  useEffect(() => {
    document.title = "TFS - TEACHERS";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {

      const { id, role } = JSON.parse(accountData);
      setStudentId(parseInt(id));
      if(role === "teacher"){
        navigate("/error")
      }
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classList = await getClassByStudentId(parseInt(studentId));
        setClasses(classList);
        const teacherList = await getTeachers();
        setTeachers(teacherList);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center m-5">TEACHER LIST</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <Card key={teacher.id}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://github.com/shadcn.png" alt={teacher.name} />
                <AvatarFallback>{teacher.name}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{teacher.fullName}</h2>
                <p className="text-sm text-muted-foreground">
                  {classes.filter((classItem) => parseInt(classItem.teacherId) === parseInt(teacher.id)).length > 0 ? (
                    <>
                      {classes
                        .filter((classItem) => parseInt(classItem.teacherId) === parseInt(teacher.id))
                        .map((classItem) => classItem.name)
                        .join(", ")}
                      <span className="text-green-800 font-bold"> (Studying)</span>
                    </>
                  ) : (
                    <span className="text-red-500 font-bold">(Not Yet)</span>
                  )}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setSelectedTeacher(teacher.id)}>
                  View
                </Button>
                <Button variant="outline" onClick={() => setFeedbackTeacher(teacher.id)}>
                  Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <TeacherModal isOpen={selectedTeacher !== null} onClose={() => setSelectedTeacher(null)} teacherId={selectedTeacher} />
      <TeacherFeedback isOpen={feedbackTeacher !== null} onClose={() => setFeedbackTeacher(null)} teacherId={feedbackTeacher} />
    </div>
  );
}
