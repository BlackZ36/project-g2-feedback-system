import React, { useEffect, useState } from "react";
import unorm from "unorm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Mail, Briefcase, User, EyeOffIcon, EyeIcon } from "lucide-react";
import { getAccountById, updateAccount } from "@/services/AccountServices";

export default function UserProfile() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountFix, setAccountFix] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const removeDiacritics = (str) => {
    return unorm.nfd(str).replace(/[\u0300-\u036f]/g, "");
  };

  const capitalizeFirstLetter = (name) => {
    if (!name) return ""; // Kiểm tra nếu name rỗng

    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const capitalizeFullName = (fullName) => {
    return fullName
      .split(" ") // Tách tên thành các phần
      .map(capitalizeFirstLetter) // Viết hoa chữ cái đầu cho từng phần
      .join(" "); // Ghép lại thành chuỗi
  };

  const formatName = (fullName) => {
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts.pop();
    const formattedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    let lastName = "";

    for (let i = 0; i < nameParts.length; i++) {
      lastName += nameParts[i].charAt(0).toUpperCase();
    }
    return removeDiacritics(formattedFirstName) + lastName;
  };

  useEffect(() => {
    document.title = "TFS - PROFILE";
    const accountData = localStorage.getItem("account");
    if (!accountData) {
      navigate("/login");
    } else {
      const { id } = JSON.parse(accountData);
      getAccountById(id)
        .then((data) => {
          setAccount(data);
          setAccountFix(data);
          setLoading(false);
        })
        .catch((err) => {
          alert("Failed to fetch account data", err);
          setLoading(false);
        });
        
    }
  }, [navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Saving user information:", account);

    updateAccount(account.id, account)
      .then(() => {
        console.log("Account updated successfully!");
        localStorage.setItem("account", JSON.stringify(account));
      })
      .catch((err) => {
        console.error("Failed to update account:", err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAccount((prevAccount) => {
      const updatedAccount = {
        ...prevAccount,
        [name]: value,
      };

      if (name === "fullName") {
        updatedAccount.name = formatName(value);
        updatedAccount.fullName = capitalizeFullName(value);
      }

      return updatedAccount;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        {account ? (
          <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-3xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex flex-col space-y-1.5">
                  <CardTitle className="text-2xl font-bold">{accountFix.fullName}</CardTitle>
                  <CardDescription>{accountFix.role}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={handleEdit}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="https://github.com/shadcn.png" alt={account.name} />
                      <AvatarFallback>{account.name}</AvatarFallback>
                    </Avatar>
                    <Badge variant="secondary">{account.role}</Badge>
                  </div>
                  <div className="flex-1 space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="email">Email</Label>
                          <Input type="email" id="email" name="email" value={account.email} onChange={handleChange} disabled />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input type="text" id="name" name="name" value={account.name} onChange={handleChange} disabled />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input type="text" id="fullName" name="fullName" value={account.fullName} onChange={handleChange} />
                        </div>
                        <div className="relative grid w-full items-center gap-1.5">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" name="password" type={showPassword ? "text" : "password"} value={account.password} onChange={handleChange} required />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-3 h-full px-3 py-0 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOffIcon className="h-4 w-4 text-gray-500" /> : <EyeIcon className="h-4 w-4 text-gray-500" />}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{account.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{account.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{account.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{account.role}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Passionate about creating intuitive and efficient software solutions. Always eager to learn and explore new technologies.</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {isEditing && (
                  <>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </>
                )}
              </CardFooter>
            </Card>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
