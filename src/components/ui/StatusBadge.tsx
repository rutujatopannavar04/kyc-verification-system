import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

type Status = 'pending' | 'verified' | 'rejected';

interface StatusBadgeProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const configs = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'bg-warning/10 text-warning border-warning/20',
    },
    verified: {
      label: 'Verified',
      icon: CheckCircle,
      className: 'bg-success/10 text-success border-success/20',
    },
    rejected: {
      label: 'Rejected',
      icon: XCircle,
      className: 'bg-destructive/10 text-destructive border-destructive/20',
    },
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border',
        config.className,
        sizes[size]
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
};

export { StatusBadge };
