import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, MessageSquare, Users, School } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [role, setRole] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "TFS - MENU";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { role } = JSON.parse(accountData);
      setRole(role);
    }
  }, [navigate]);

  const menuItems = [
    { icon: User, label: "Profile", link: "/profile", role: "" },
    { icon: GraduationCap, label: "Teacher", link: "/teachers", role: "student" },
    { icon: MessageSquare, label: "Feedback", link: "/feedback", role: "student" },
    { icon: School, label: "Class", link: "/classes", role: "student" },
    { icon: MessageSquare, label: "Feedback", link: "/teacher-feedback", role: "teacher" },
    { icon: MessageSquare, label: "Feedback", link: "/admin-feedback", role: "admin" },
    { icon: Users, label: "Accounts", link: "/admin-account", role: "admin" },
    { icon: School, label: "Class", link: "/admin-class", role: "admin" },
  ];

  const filteredMenuItems = menuItems.filter((item) => item.role === role || item.role === "");

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {filteredMenuItems.map((item, index) => (
              <Link to={item.link} key={index} className="h-40">
                <Button variant="outline" className="w-full h-full text-lg font-semibold">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <item.icon className="w-12 h-12" />
                    <span>{item.label}</span>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
