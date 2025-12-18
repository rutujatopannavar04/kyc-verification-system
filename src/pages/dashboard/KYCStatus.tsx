import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { kycApi } from '@/utils/api';
import { useAuthStore } from '@/store/authStore';

import {
  ArrowLeft,
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Image,
} from 'lucide-react';

interface KYCStatusResponse {
  status: 'pending' | 'verified' | 'rejected' | 'not_submitted';
  faceImageUrl?: string | null;
  idDocumentUrl?: string | null;
  submittedAt?: string | null;
}

const KYCStatusPage: React.FC = () => {
  const { user } = useAuthStore();
  const [kyc, setKyc] = useState<KYCStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // Fetch real KYC status from backend
  // ---------------------------------------------------------
  const fetchStatus = async () => {
    try {
      const res = await kycApi.getStatus();
      setKyc(res.data);
    } catch (err) {
      console.log("Error loading KYC:", err);
      setKyc(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // ---------------------------------------------------------
  // Loading UI
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-primary" size={32} />
          <p className="text-muted-foreground mt-3">Loading status...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // If no KYC submitted
  // ---------------------------------------------------------
  if (!kyc || kyc.status === "not_submitted") {
    return (
      <div className="max-w-xl mx-auto">
        <Card variant="elevated" className="text-center p-10">
          <FileText size={48} className="mx-auto text-muted-foreground mb-3" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No KYC Found</h2>
          <p className="text-muted-foreground mb-6">
            You have not submitted any KYC yet.
          </p>

          <Link to="/dashboard/submit">
            <Button variant="gradient">Submit KYC Now</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Get UI details for each status
  // ---------------------------------------------------------
  const statusConfig = {
    pending: {
      title: "Verification in Progress",
      description: "Your documents are being reviewed.",
      icon: Clock,
      color: "text-yellow-500",
    },
    verified: {
      title: "Verification Successful",
      description: "Your KYC has been approved!",
      icon: CheckCircle,
      color: "text-green-600",
    },
    rejected: {
      title: "Verification Rejected",
      description: "Please resubmit corrected documents.",
      icon: XCircle,
      color: "text-red-600",
    },
  };

  const info = statusConfig[kyc.status];
  const StatusIcon = info.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            Back
          </Button>
        </Link>

        <div>
          <h1 className="text-2xl font-bold">KYC Status</h1>
          <p className="text-muted-foreground text-sm">
            Your current verification status
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card variant="elevated" className="overflow-hidden">
        <div
          className={`h-2 ${
            kyc.status === 'verified'
              ? 'bg-green-500'
              : kyc.status === 'rejected'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}
        />

        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl ${
                kyc.status === 'verified'
                  ? 'bg-green-100'
                  : kyc.status === 'rejected'
                  ? 'bg-red-100'
                  : 'bg-yellow-100'
              }`}
            >
              <StatusIcon className={info.color} size={30} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold">{info.title}</h2>
                <StatusBadge status={kyc.status} />
              </div>
              <p className="text-muted-foreground">{info.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submitted Documents */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image size={20} />
            Submitted Documents
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Face */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Face Photo</p>
              <div className="rounded-xl bg-muted overflow-hidden aspect-square">
                {kyc.faceImageUrl ? (
                  <img src={kyc.faceImageUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User className="text-muted-foreground" size={48} />
                  </div>
                )}
              </div>
            </div>

            {/* ID Document */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">ID Document</p>
              <div className="rounded-xl bg-muted overflow-hidden aspect-video">
                {kyc.idDocumentUrl ? (
                  <img src={kyc.idDocumentUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="text-muted-foreground" size={48} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Time */}
      {kyc.submittedAt && (
        <p className="text-center text-sm text-muted-foreground">
          Submitted on{" "}
          {new Date(kyc.submittedAt).toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short",
          })}
        </p>
      )}
    </div>
  );
};

export default KYCStatusPage;
