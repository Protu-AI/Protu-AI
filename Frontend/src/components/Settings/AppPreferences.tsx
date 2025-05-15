import React from 'react';
import SettingsSection from '@/components/Settings/SettingsSection';
import SettingsHeading from './SettingsHeading';

const AppPreferences: React.FC = () => {
  return (
    <SettingsSection>
      <SettingsHeading>App Preferences</SettingsHeading>
      App Preferences Content
    </SettingsSection>
  );
};

export default AppPreferences;
