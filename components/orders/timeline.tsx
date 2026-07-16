import React from "react";
import { formatDateTime, formatDate } from "@/lib/utils";
import type { TimelineEntry } from "@/types";
import {
  Package,
  CheckCircle,
  Truck,
  MapPin,
  AlertCircle,
  Clock,
  Compass,
  Inbox,
  Send,
  Flag,
} from "lucide-react";

interface TimelineProps {
  timeline: TimelineEntry[];
}

const iconMap: Record<string, React.ComponentType<any>> = {
  package: Package,
  check: CheckCircle,
  truck: Truck,
  location: MapPin,
  alert: AlertCircle,
  clock: Clock,
  compass: Compass,
  inbox: Inbox,
  send: Send,
  flag: Flag,
};

export function Timeline({ timeline }: TimelineProps) {
  if (!timeline || timeline.length === 0) {
    return <p className="text-muted-foreground text-sm">No tracking updates available yet.</p>;
  }

  // Sort timeline by date/time/createdAt descending to show newest first
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedTimeline.map((entry, entryIdx) => {
          const IconComponent = iconMap[entry.icon.toLowerCase()] || Package;

          return (
            <li key={entry.id}>
              <div className="relative pb-8">
                {entryIdx !== sortedTimeline.length - 1 ? (
                  <span
                    className="absolute left-6 top-6 -ml-px h-full w-0.5 bg-border"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all duration-300 ${
                        entry.completed
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                    <div className="space-y-1">
                      <p className="text-base font-bold text-foreground tracking-tight">
                        {entry.title}
                      </p>
                      {entry.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {entry.description}
                        </p>
                      )}
                      {entry.location && (
                        <div className="flex items-center text-xs text-muted-foreground font-semibold">
                          <MapPin className="mr-1 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                          <span>{entry.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-xs whitespace-nowrap text-muted-foreground flex flex-col items-end space-y-0.5 font-medium">
                      <time className="font-semibold text-foreground">
                        {formatDate(entry.date)}
                      </time>
                      {entry.time && <span>{entry.time}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
