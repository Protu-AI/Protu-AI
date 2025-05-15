import React from 'react';
import SettingsSection from '@/components/Settings/SettingsSection';
import SettingsHeading from './SettingsHeading';

const SavedPaymentMethods: React.FC = () => {
  return (
    <SettingsSection>
      <SettingsHeading>Saved Payment Methods</SettingsHeading>
      Saved Payment Methods Content
    </SettingsSection>
  );
};

export default SavedPaymentMethods;
