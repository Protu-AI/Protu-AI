import React from 'react';
import SettingsSection from '@/components/Settings/SettingsSection';
import SettingsHeading from './SettingsHeading';

const NotificationSettings: React.FC = () => {
  return (
    <SettingsSection>
      <SettingsHeading>Notification Settings</SettingsHeading>
      Notification Settings Content
    </SettingsSection>
  );
};

export default NotificationSettings;
