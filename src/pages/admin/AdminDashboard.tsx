import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/button';
import { Users, FileCheck, Clock, CheckCircle, XCircle, ArrowRight, TrendingUp } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // Demo stats
  const stats = [
    { label: 'Total Submissions', value: '124', icon: Users, change: '+12%', color: 'text-primary' },
    { label: 'Pending Review', value: '18', icon: Clock, change: '+5', color: 'text-warning' },
    { label: 'Verified', value: '98', icon: CheckCircle, change: '+8', color: 'text-success' },
    { label: 'Rejected', value: '8', icon: XCircle, change: '-2', color: 'text-destructive' },
  ];

  const recentSubmissions = [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'pending', date: '2 hours ago' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'verified', date: '5 hours ago' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', status: 'pending', date: '1 day ago' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', status: 'rejected', date: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-warning/10 text-warning';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.fullName}. Here's what's happening today.
          </p>
        </div>
        <Link to="/admin/submissions">
          <Button variant="gradient" className="gap-2">
            View All Submissions
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            variant="elevated" 
            className="animate-slide-up hover:shadow-glow transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <TrendingUp size={12} className="text-success" />
                    <span>{stat.change} this week</span>
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-xl">
                  <stat.icon size={24} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card variant="elevated" className="animate-fade-in">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Submissions</h2>
            <Link to="/admin/submissions" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentSubmissions.map((submission) => (
                <tr key={submission.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {submission.name.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-foreground">{submission.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{submission.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(submission.status)}`}>
                      {submission.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground text-sm">{submission.date}</td>
                  <td className="p-4 text-right">
                    <Link to={`/admin/review/${submission.id}`}>
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
