import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { kycApi } from '@/utils/api';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, ArrowRight, Shield, User } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // ---------------------------------------
  // STATE FOR REAL KYC DATA
  // ---------------------------------------
  const [status, setStatus] = useState<'pending' | 'verified' | 'rejected' | 'not_submitted'>('pending');
  const [docs, setDocs] = useState(0);

  // ---------------------------------------
  // FETCH KYC STATUS FROM BACKEND
  // ---------------------------------------
  const fetchKycStatus = async () => {
    try {
      const res = await kycApi.getStatus();

      setStatus(res.data.status);

      let count = 0;
      if (res.data.faceImageUrl) count++;
      if (res.data.idDocumentUrl) count++;
      setDocs(count);

    } catch (err) {
      console.log("Error fetching KYC status:", err);
    }
  };

  useEffect(() => {
    fetchKycStatus();
  }, []);

  // ---------------------------------------
  // MAP STATUS TO COLOR
  // ---------------------------------------
  const statusColor =
    status === "verified" ? "text-green-600" :
    status === "rejected" ? "text-red-600" :
    status === "not_submitted" ? "text-muted-foreground" :
    "text-yellow-500"; // pending

  const statusLabel =
    status === "verified" ? "Verified" :
    status === "rejected" ? "Rejected" :
    status === "not_submitted" ? "Not Submitted" :
    "Pending";

  return (
    <div className="space-y-8">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Complete your KYC verification to unlock all features.
          </p>
        </div>

        <Link to="/dashboard/submit">
          <Button variant="gradient" className="gap-2">
            {status === "not_submitted" || status === "rejected" ? "Start Verification" : "Resubmit KYC"}
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { label: 'Verification Status', value: statusLabel, icon: Clock, color: statusColor },
          { label: 'Documents Submitted', value: docs.toString(), icon: FileText, color: 'text-primary' },
          { label: 'Account Type', value: user?.role === "user" ? "Personal" : "Admin", icon: User, color: 'text-primary' },
        ].map((stat, index) => (
          <Card key={index} variant="elevated" className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <stat.icon size={20} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <Link to="/dashboard/submit">
            <Card variant="elevated" className="group hover:shadow-glow transition-all duration-300 cursor-pointer animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <FileText size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      Submit KYC
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Upload your documents for verification</p>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/dashboard/status">
            <Card variant="elevated" className="group hover:shadow-glow transition-all duration-300 cursor-pointer animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-success/10 text-success">
                    <CheckCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      Check Status
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">View your verification status</p>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Help Section */}
      <Card variant="glass" className="animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent rounded-xl">
              <Shield className="text-primary" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Our support team is available 24/7 to assist you with the verification process.
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                Contact Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
