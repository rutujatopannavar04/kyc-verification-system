import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { adminApi } from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, CheckCircle, XCircle, RefreshCw, Calendar, Image, FileText } from 'lucide-react';

interface KYCDetails {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  idNumber: string;
  status: 'pending' | 'verified' | 'rejected';
  faceImageUrl?: string;
  idDocumentUrl?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

const KYCReview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [kycData, setKycData] = useState<KYCDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchKYCDetails();
  }, [id]);

  const fetchKYCDetails = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getSubmission(id!);
      setKycData(response.data);
    } catch (error) {
      // Demo data
      setKycData({
        id: id!,
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 000-0000',
        address: '123 Main Street, Suite 100, New York, NY 10001, USA',
        idNumber: 'ABC123456789',
        status: 'pending',
        faceImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        idDocumentUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&h=400&fit=crop',
        submittedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: 'verified' | 'rejected') => {
    try {
      setUpdating(true);
      await adminApi.updateStatus(id!, status);
      
      setKycData(prev => prev ? { ...prev, status, reviewedAt: new Date().toISOString() } : null);
      
      toast({
        title: status === 'verified' ? 'KYC Approved' : 'KYC Rejected',
        description: `The verification has been ${status}.`,
      });
    } catch (error) {
      // Demo update
      setKycData(prev => prev ? { ...prev, status, reviewedAt: new Date().toISOString() } : null);
      
      toast({
        title: status === 'verified' ? 'KYC Approved' : 'KYC Rejected',
        description: `Demo: The verification has been ${status}.`,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-primary" size={32} />
          <p className="text-muted-foreground mt-4">Loading KYC details...</p>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">KYC submission not found.</p>
        <Link to="/admin/submissions">
          <Button variant="outline" className="mt-4">Back to Submissions</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/submissions">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={16} />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">KYC Review</h1>
            <p className="text-muted-foreground text-sm">Review submission details and documents</p>
          </div>
        </div>
        <StatusBadge status={kycData.status} size="lg" />
      </div>

      {/* User Summary Card */}
      <Card variant="elevated" className="animate-scale-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <img
              src={kycData.faceImageUrl || `https://ui-avatars.com/api/?name=${kycData.fullName}`}
              alt={kycData.fullName}
              className="w-24 h-24 rounded-2xl object-cover shadow-soft-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{kycData.fullName}</h2>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail size={14} /> {kycData.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={14} /> {kycData.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <Calendar size={12} />
                Submitted on {new Date(kycData.submittedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User size={18} />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Full Name', value: kycData.fullName, icon: User },
              { label: 'Email', value: kycData.email, icon: Mail },
              { label: 'Phone', value: kycData.phone, icon: Phone },
              { label: 'ID Number', value: kycData.idNumber, icon: CreditCard },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                <item.icon size={16} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-medium text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin size={16} className="text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm font-medium text-foreground">{kycData.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText size={18} />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <Image size={14} /> Face Photo
              </p>
              <div className="rounded-xl overflow-hidden bg-muted aspect-square">
                <img
                  src={kycData.faceImageUrl}
                  alt="Face"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <FileText size={14} /> ID Document
              </p>
              <div className="rounded-xl overflow-hidden bg-muted aspect-video">
                <img
                  src={kycData.idDocumentUrl}
                  alt="ID Document"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {kycData.status === 'pending' && (
        <Card variant="elevated" className="animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Verification Decision</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="success"
                size="lg"
                className="flex-1 gap-2 bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => handleUpdateStatus('verified')}
                disabled={updating}
              >
                <CheckCircle size={18} />
                Approve Verification
              </Button>
              <Button
                variant="destructive"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => handleUpdateStatus('rejected')}
                disabled={updating}
              >
                <XCircle size={18} />
                Reject Verification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {kycData.status !== 'pending' && (
        <Card variant="glass" className="animate-fade-in">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              This submission was <strong className={kycData.status === 'verified' ? 'text-success' : 'text-destructive'}>{kycData.status}</strong>
              {kycData.reviewedAt && (
                <> on {new Date(kycData.reviewedAt).toLocaleDateString()}</>
              )}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KYCReview;
