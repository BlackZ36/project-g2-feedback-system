/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from './../lib/utils';

export function TeacherModal({ isOpen, onClose, teacherId }) {
  const [teacher, setTeacher] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && teacherId) {
      setLoading(true)
      fetch(`http://localhost:3001/accounts/${teacherId}`)
        .then(response => response.json())
        .then(data => {
          setTeacher(data)
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching teacher data:', error)
          setLoading(false)
        })
    }
  }, [isOpen, teacherId])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Teacher Details</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading...</p>
        ) : teacher ? (
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://github.com/shadcn.png" alt={teacher.name} />
              <AvatarFallback>{teacher.name}</AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold">{teacher.fullName} ({teacher.name})</h2>
            <p className="text-muted-foreground">{teacher.role}</p>
            <p>{teacher.bio}</p>
            <p>Email: {teacher.email}</p>
          </div>
        ) : (
          <p>No teacher data available</p>
        )}
      </DialogContent>
    </Dialog>
  )
}