"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Appointment = {
  time: string;
  title: string;
  status: "Scheduled" | "Cancelled" | "Confirmed" | "Rescheduled";
  assigned?: string;
};

const appointments: Appointment[] = [
  { time: "8:00 AM", title: "Bridal Makeup Service", status: "Scheduled" },
  { time: "10:00 AM", title: "Party Makeup Service", status: "Confirmed" },
  { time: "1:00 PM", title: "Bridal Makeup Service", status: "Cancelled", assigned: "Sarah" },
  { time: "5:00 PM", title: "Party Makeup Service", status: "Rescheduled", assigned: "Sarah" },
];

const statusColors: Record<Appointment["status"], string> = {
  Scheduled: "bg-orange-500 text-white",
  Cancelled: "bg-red-500 text-white",
  Confirmed: "bg-green-500 text-white",
  Rescheduled: "bg-gray-400 text-black",
};


const SharedCalendar = () => {
    const [selectedDay, setSelectedDay] = useState("Mon");

    return (
        <div>
            <div className="flex min-h-screen bg-background">

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold">Shared Calendar</h1>
                        <Button>Add Appointment</Button>
                    </div>

                    {/* Days Selector */}
                    <Tabs defaultValue="Mon" onValueChange={setSelectedDay}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="Mon">Mon</TabsTrigger>
                            <TabsTrigger value="Tue">Tue</TabsTrigger>
                            <TabsTrigger value="Wed">Wed</TabsTrigger>
                            <TabsTrigger value="Thu">Thu</TabsTrigger>
                            <TabsTrigger value="Fri">Fri</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {/* Timeline */}
                    <div className="space-y-4">
                        {appointments.map((appt, idx) => (
                            <Card key={idx} className="flex items-center justify-between p-4 shadow-md">
                                <div>
                                    <p className="text-sm text-muted-foreground">{appt.time}</p>
                                    <CardTitle>{appt.title}</CardTitle>
                                    {appt.assigned && (
                                        <div className="flex items-center mt-2">
                                            <Avatar className="h-6 w-6 mr-2">
                                                <AvatarImage src="/avatar.png" alt={appt.assigned} />
                                                <AvatarFallback>{appt.assigned[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm">{appt.assigned}</span>
                                        </div>
                                    )}
                                </div>
                                <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SharedCalendar;