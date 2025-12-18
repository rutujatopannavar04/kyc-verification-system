import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { adminApi } from "@/utils/api";
import { toast } from "@/hooks/use-toast";

import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

interface Submission {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "pending" | "verified" | "rejected";
  faceImageUrl?: string;
  idDocumentUrl?: string;
  submittedAt: string;
}

const AllSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "verified" | "rejected"
  >("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const response = await adminApi.getAllSubmissions();

      const formatted = response.data.map((s: any) => ({
        id: s.id,
        fullName: s.fullName,
        email: s.email,
        phone: s.phone,
        status: s.status,
        faceImageUrl: s.faceImageUrl,
        idDocumentUrl: s.idDocumentUrl,
        submittedAt: s.submittedAt,
      }));

      setSubmissions(formatted);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load submissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "verified" | "rejected"
  ) => {
    try {
      await adminApi.updateStatus(id, status);

      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, status: status } : sub
        )
      );

      toast({
        title: `KYC ${status === "verified" ? "Verified 🎉" : "Rejected"}`,
        description: `Status updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-primary" size={32} />
          <p className="text-muted-foreground mt-4">Loading submissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            All KYC Submissions
          </h1>
          <p className="text-muted-foreground text-sm">
            Review and manage user verification requests
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="elevated">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={18} />}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "pending", "verified", "rejected"] as const).map(
                (status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-left text-sm">User</th>
                <th className="p-4 text-left text-sm">Contact</th>
                <th className="p-4 text-left text-sm">Documents</th>
                <th className="p-4 text-left text-sm">Status</th>
                <th className="p-4 text-left text-sm">Submitted</th>
                <th className="p-4 text-right text-sm">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr
                  key={submission.id}
                  className="border-b border-border hover:bg-muted/30"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          submission.faceImageUrl ||
                          `https://ui-avatars.com/api/?name=${submission.fullName}`
                        }
                        alt={submission.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium">{submission.fullName}</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <p>{submission.email}</p>
                    <p className="text-xs text-muted-foreground">
                      {submission.phone}
                    </p>
                  </td>

                  <td className="p-4">
                    <img
                      src={submission.faceImageUrl}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </td>

                  <td className="p-4">
                    <StatusBadge status={submission.status} />
                  </td>

                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>

                  <td className="p-4 text-right">
                    {submission.status === "pending" && (
                      <>
                        <Button
                          variant="ghost"
                          className="text-green-600"
                          onClick={() =>
                            handleUpdateStatus(submission.id, "verified")
                          }
                        >
                          <CheckCircle size={18} />
                        </Button>

                        <Button
                          variant="ghost"
                          className="text-red-600"
                          onClick={() =>
                            handleUpdateStatus(submission.id, "rejected")
                          }
                        >
                          <XCircle size={18} />
                        </Button>
                      </>
                    )}

                    <Link to={`/admin/review/${submission.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 ml-2">
                        <Eye size={16} />
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSubmissions.length === 0 && (
          <p className="p-10 text-center text-muted-foreground">
            No submissions found.
          </p>
        )}
      </Card>

      <p className="text-center text-muted-foreground">
        Showing {filteredSubmissions.length} of {submissions.length} submissions
      </p>
    </div>
  );
};

export default AllSubmissions;
