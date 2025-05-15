import React from 'react';
import SettingsSection from '@/components/Settings/SettingsSection';
import SettingsHeading from './SettingsHeading';

const PrivacySettings: React.FC = () => {
  return (
    <SettingsSection>
      <SettingsHeading>Privacy Settings</SettingsHeading>
      Privacy Settings Content
    </SettingsSection>
  );
};

export default PrivacySettings;
