import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Camera,
  RotateCcw,
  Clock,
  FileText,
  Download,
  Trash2,
  Eye,
} from "lucide-react";

interface Snapshot {
  id: string;
  projectId: string;
  timestamp: Date;
  description: string;
  filesCount: number;
  size: string;
  changes?: string[];
}

interface ProjectSnapshotProps {
  project: any;
  onRestore: (snapshotId: string) => void;
}

export function ProjectSnapshot({ project, onRestore }: ProjectSnapshotProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    loadSnapshots();
  }, [project]);

  const loadSnapshots = () => {
    // Load snapshots from localStorage (in real implementation, this would be from a database)
    const mockSnapshots: Snapshot[] = [
      {
        id: "1",
        projectId: project.id,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        description: "Initial project setup",
        filesCount: 3,
        size: "2.1 KB",
        changes: ["Created App.tsx", "Added package.json", "Initial commit"],
      },
      {
        id: "2",
        projectId: project.id,
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        description: "Added component structure",
        filesCount: 5,
        size: "4.7 KB",
        changes: [
          "Added Button component",
          "Created components folder",
          "Updated styles",
        ],
      },
      {
        id: "3",
        projectId: project.id,
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        description: "Before AI optimization",
        filesCount: 6,
        size: "6.2 KB",
        changes: [
          "Added error handling",
          "Optimized performance",
          "Updated types",
        ],
      },
    ];

    setSnapshots(mockSnapshots);
  };

  const createSnapshot = async () => {
    const snapshot: Snapshot = {
      id: Date.now().toString(),
      projectId: project.id,
      timestamp: new Date(),
      description: `Manual snapshot - ${new Date().toLocaleTimeString()}`,
      filesCount: Object.keys(project.files).length,
      size: calculateProjectSize(),
      changes: ["Manual snapshot created"],
    };

    // Store snapshot (in real implementation, this would be persisted)
    localStorage.setItem(
      `snapshot_${snapshot.id}`,
      JSON.stringify({
        ...snapshot,
        files: project.files,
      }),
    );

    setSnapshots((prev) => [snapshot, ...prev]);
  };

  const calculateProjectSize = () => {
    const totalSize = Object.values(project.files).reduce(
      (acc: number, content: any) => {
        return acc + (content as string).length;
      },
      0,
    );

    if (totalSize < 1024) return `${totalSize} B`;
    if (totalSize < 1024 * 1024) return `${(totalSize / 1024).toFixed(1)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(1)} MB`;
  };

  const deleteSnapshot = (snapshotId: string) => {
    localStorage.removeItem(`snapshot_${snapshotId}`);
    setSnapshots((prev) => prev.filter((s) => s.id !== snapshotId));
  };

  const downloadSnapshot = (snapshot: Snapshot) => {
    const snapshotData = localStorage.getItem(`snapshot_${snapshot.id}`);
    if (!snapshotData) return;

    const blob = new Blob([snapshotData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}-snapshot-${snapshot.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Project Snapshots</h3>
            <p className="text-sm text-muted-foreground">
              Version history and rollback points
            </p>
          </div>
          <Button onClick={createSnapshot} size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Create Snapshot
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {snapshots.length === 0 ? (
            <div className="text-center py-12">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Snapshots Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create snapshots to save project states and enable rollback
              </p>
              <Button onClick={createSnapshot}>
                <Camera className="h-4 w-4 mr-2" />
                Create First Snapshot
              </Button>
            </div>
          ) : (
            snapshots.map((snapshot) => (
              <Card
                key={snapshot.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {snapshot.description}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3" />
                        {snapshot.timestamp.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      v{snapshot.id}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {snapshot.filesCount} files
                    </div>
                    <div>{snapshot.size}</div>
                  </div>

                  {snapshot.changes && (
                    <div>
                      <div className="text-sm font-medium mb-1">Changes:</div>
                      <div className="space-y-1">
                        {snapshot.changes.slice(0, 3).map((change, index) => (
                          <div
                            key={index}
                            className="text-xs text-muted-foreground flex items-center gap-1"
                          >
                            <div className="w-1 h-1 bg-gray-400 rounded-full" />
                            {change}
                          </div>
                        ))}
                        {snapshot.changes.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{snapshot.changes.length - 3} more changes
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onRestore(snapshot.id)}
                      className="flex-1"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Restore
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadSnapshot(snapshot)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>

                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
