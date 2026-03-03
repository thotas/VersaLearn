"use client";

import { useState } from "react";
import { createCalendarEvent, deleteCalendarEvent } from "@/actions/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Loader2, Plus, Trash2, X } from "lucide-react";

interface CalendarEventData {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  color: string;
}

const colorOptions = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#10b981", label: "Emerald" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#ef4444", label: "Red" },
  { value: "#8b5cf6", label: "Purple" },
  { value: "#06b6d4", label: "Cyan" },
];

export function StudentCalendar({
  initialEvents,
}: {
  initialEvents: CalendarEventData[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#6366f1");

  async function handleCreate(formData: FormData) {
    setCreating(true);
    formData.set("color", selectedColor);
    await createCalendarEvent(formData);
    setCreating(false);
    setShowForm(false);
  }

  async function handleDelete(eventId: string) {
    if (confirm("Delete this event?")) {
      await deleteCalendarEvent(eventId);
    }
  }

  const upcoming = initialEvents
    .filter((e) => new Date(e.startTime) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  const past = initialEvents
    .filter((e) => new Date(e.startTime) < new Date())
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );

  function formatEventTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "default"}
          size="sm"
          className="gap-2"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Cancel" : "Add Event"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-indigo-500/30 bg-indigo-500/5">
          <CardContent className="p-4">
            <form action={handleCreate} className="space-y-3">
              <Input name="title" placeholder="Event title" required />
              <Textarea
                name="description"
                placeholder="Description (optional)"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">Start</label>
                  <Input
                    name="startTime"
                    type="datetime-local"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400">End</label>
                  <Input
                    name="endTime"
                    type="datetime-local"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setSelectedColor(c.value)}
                      className={`h-7 w-7 rounded-full transition-all ${
                        selectedColor === c.value
                          ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
              <Button type="submit" size="sm" disabled={creating} className="gap-2">
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Event
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Events */}
      {upcoming.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-400 mb-3">Upcoming</h3>
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 group"
              >
                <div
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-200 text-sm">
                    {event.title}
                  </p>
                  {event.description && (
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-zinc-500">
                    <Clock className="h-3 w-3" />
                    {formatEventTime(event.startTime)}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {past.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-500 mb-3">Past</h3>
          <div className="space-y-2 opacity-60">
            {past.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 rounded-lg bg-zinc-900/30 px-3 py-2"
              >
                <div
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-sm text-zinc-400 flex-1 truncate">
                  {event.title}
                </span>
                <span className="text-xs text-zinc-600 shrink-0">
                  {new Date(event.startTime).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {initialEvents.length === 0 && !showForm && (
        <Card>
          <CardContent className="flex flex-col items-center py-8 text-center">
            <Calendar className="h-10 w-10 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-400">No events scheduled</p>
            <p className="text-xs text-zinc-500 mt-1">
              Add study sessions or deadlines to stay organized
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
