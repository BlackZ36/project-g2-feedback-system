import { Book, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getClassByStudentId } from "@/services/ClassServices";
import { useNavigate } from "react-router-dom";
import { getTeachers } from "@/services/TeacherServices";

export default function ClassPage() {
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState();
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchClassAndTeacher = async (studentId) => {
    setLoading(true);
    try {
      if (studentId) {
        const fetchedClasses = await getClassByStudentId(studentId);
        const fetchedTeachers = await getTeachers();
        setClasses(fetchedClasses);
        setTeachers(fetchedTeachers);
      }
    } catch (err) {
      console.log("Error fetching class list", err);
      setError("Failed to fetch classes. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    document.title = "TFS - CLASSES";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      setStudentId(parseInt(id));
    }
  }, [navigate]);

  useEffect(() => {
    if (studentId) {
      fetchClassAndTeacher(studentId);
    }
  }, [studentId]);

  return (
    <div className="min-h-screen bg-background p-8 md:p-16 lg:p-24">
      <h1 className="text-3xl font-bold text-center mb-8">Class List</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading...</p> // Show loading state
        ) : error ? (
          <p className="text-red-500">{error}</p> // Show error message
        ) : classes.length > 0 ? (
          classes.map((classItem, index) => {
            const teacher = teachers.find((t) => t.id === classItem.teacherId);
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="w-6 h-6 mr-3 text-primary" />
                    Class: {classItem.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-5 h-5 mr-2" />
                    <p>Teacher: {teacher ? teacher.fullName + ` (${teacher.name})` : "Unknown"}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <p>No classes available.</p> // Show when no classes are found
        )}
      </div>
    </div>
  );
}
