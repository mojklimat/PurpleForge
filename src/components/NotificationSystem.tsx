import React from 'react';
import { X, AlertTriangle, Shield, Target, CheckCircle, Info } from 'lucide-react';
import { NotificationData } from '../types/simulation';

interface NotificationSystemProps {
  notifications: NotificationData[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onRemove,
  onClear
}) => {
  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'red-attack':
        return <Target className="h-5 w-5 text-red-400" />;
      case 'blue-detection':
        return <Shield className="h-5 w-5 text-blue-400" />;
      case 'blue-mitigation':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'system-alert':
        return <Info className="h-5 w-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getNotificationStyles = (type: NotificationData['type'], severity: NotificationData['severity']) => {
    const baseStyles = "border-l-4 shadow-lg backdrop-blur-sm";
    
    switch (type) {
      case 'red-attack':
        return `${baseStyles} bg-red-900/80 border-red-500 text-red-100`;
      case 'blue-detection':
        return `${baseStyles} bg-blue-900/80 border-blue-500 text-blue-100`;
      case 'blue-mitigation':
        return `${baseStyles} bg-green-900/80 border-green-500 text-green-100`;
      case 'system-alert':
        return severity === 'error' 
          ? `${baseStyles} bg-red-900/80 border-red-500 text-red-100`
          : `${baseStyles} bg-yellow-900/80 border-yellow-500 text-yellow-100`;
      default:
        return `${baseStyles} bg-gray-900/80 border-gray-500 text-gray-100`;
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {/* Clear All Button */}
      {notifications.length > 1 && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onClear}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 px-3 py-1 rounded-md transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Notifications */}
      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationStyles(notification.type, notification.severity)} rounded-lg p-4 animate-slide-in-right`}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {notification.message}
                  </p>
                  <p className="text-xs opacity-70 mt-2">
                    {notification.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                
                <button
                  onClick={() => onRemove(notification.id)}
                  className="ml-2 flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Show count if more notifications exist */}
      {notifications.length > 5 && (
        <div className="text-center">
          <div className="bg-slate-800/80 backdrop-blur-sm text-gray-300 text-xs px-3 py-2 rounded-lg">
            +{notifications.length - 5} more notifications
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;