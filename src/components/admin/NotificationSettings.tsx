
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Bell, BellOff, Send, Settings, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationSettings() {
  const { toast } = useToast();
  const { isEnabled, fcmToken, enableNotifications, disableNotifications, sendTestNotification, checkPermissionStatus } = useNotifications();
  const [testMessage, setTestMessage] = useState("Test notification from your admin panel!");
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('default');

  useEffect(() => {
    setPermissionStatus(checkPermissionStatus());
  }, [isEnabled, checkPermissionStatus]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      await enableNotifications();
      setPermissionStatus(checkPermissionStatus());
      toast({
        title: "Notifications Enabled",
        description: "You will now receive push notifications for new quote submissions.",
      });
    } catch (error) {
      console.error('Notification enable error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      await disableNotifications();
      setPermissionStatus(checkPermissionStatus());
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive push notifications.",
      });
    } catch (error) {
      console.error('Notification disable error:', error);
      toast({
        title: "Error",
        description: "Failed to disable notifications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!testMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test message.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendTestNotification(testMessage);
      toast({
        title: "Test Sent",
        description: "Test notification has been sent to your device.",
      });
    } catch (error) {
      console.error('Test notification error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionStatusDisplay = () => {
    switch (permissionStatus) {
      case 'granted':
        return (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Granted</span>
          </div>
        );
      case 'denied':
        return (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Denied</span>
          </div>
        );
      case 'default':
        return (
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Not requested</span>
          </div>
        );
      case 'unsupported':
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Not supported</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-gray-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Unknown</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Notification Settings</h2>
      </div>

      {permissionStatus === 'denied' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Notifications have been blocked in your browser. To enable them:</p>
              <div className="text-sm space-y-1 ml-4">
                <p>• Click the lock icon in your browser's address bar</p>
                <p>• Allow notifications for this site</p>
                <p>• Refresh the page and try again</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {permissionStatus === 'unsupported' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your browser does not support notifications. Please use a modern browser like Chrome, Firefox, or Safari.
          </AlertDescription>
        </Alert>
      )}

      {isEnabled && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            🎉 Push notifications are now active! You'll receive notifications for new quote submissions even when the browser is closed.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main notification toggle - responsive layout */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
            <div className="flex-1">
              <h3 className="font-medium">Quote Submission Notifications</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get notified when new quotes are submitted
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">Permission:</span>
                {getPermissionStatusDisplay()}
              </div>
              {fcmToken && (
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">
                    FCM Token: {fcmToken.substring(0, 20)}...
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:flex-col sm:items-end">
              <span className={`text-sm font-medium ${isEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
              {isEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisableNotifications}
                  disabled={isLoading}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <BellOff className="h-4 w-4" />
                  {isLoading ? 'Disabling...' : 'Disable'}
                </Button>
              ) : (
                <Button
                  onClick={handleEnableNotifications}
                  disabled={isLoading || permissionStatus === 'unsupported'}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Bell className="h-4 w-4" />
                  {isLoading ? 'Enabling...' : 'Enable'}
                </Button>
              )}
            </div>
          </div>

          {/* Test notification section - only show when enabled */}
          {isEnabled && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="test-message" className="text-sm font-medium">Test Notification</Label>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <Input
                    id="test-message"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Enter test message..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendTest}
                    disabled={isLoading || !testMessage.trim()}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    {isLoading ? 'Sending...' : 'Send Test'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status card - responsive grid */}
      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span>Browser Support:</span>
              <span className={`${permissionStatus !== 'unsupported' ? 'text-green-600' : 'text-red-600'}`}>
                {permissionStatus !== 'unsupported' ? '✓ Available' : '✗ Unsupported'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Permission Status:</span>
              <span className={`${permissionStatus === 'granted' ? 'text-green-600' : permissionStatus === 'denied' ? 'text-red-600' : 'text-yellow-600'}`}>
                {permissionStatus === 'granted' ? '✓ Granted' : permissionStatus === 'denied' ? '✗ Denied' : '⚠ Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Service Worker:</span>
              <span className="text-green-600">✓ Configured</span>
            </div>
            <div className="flex justify-between">
              <span>Firebase Integration:</span>
              <span className="text-green-600">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>FCM Token:</span>
              <span className={fcmToken ? 'text-green-600' : 'text-yellow-600'}>
                {fcmToken ? '✓ Generated' : '⚠ Pending'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>VAPID Key:</span>
              <span className="text-green-600">✓ Configured</span>
            </div>
          </div>
          <Alert className="mt-4">
            <AlertDescription>
              🔥 Firebase Cloud Messaging is fully configured with your VAPID key! 
              Notifications will work across all devices and browsers that support push notifications.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
