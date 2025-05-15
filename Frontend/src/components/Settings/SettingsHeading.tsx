import React from 'react';

interface SettingsHeadingProps {
  children: React.ReactNode;
}

const SettingsHeading: React.FC<SettingsHeadingProps> = ({ children }) => {
  const headingStyle = {
    color: '#0E1117',
    fontFamily: 'Archivo',
    fontWeight: 600,
    fontSize: '26px',
    textAlign: 'left',
    marginBottom: '30px', // Added spacing
  };

  return (
    <h2 style={headingStyle}>{children}</h2>
  );
};

export default SettingsHeading;
