import { Navbar } from '@/components/common/Navbar';
import SettingsLayout from '@/layouts/SettingsLayout';
import SettingsSidebar from '@/components/Settings/SettingsSidebar';
import { Route, Routes, useSearchParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/layouts/MainLayout';
import { useEffect } from 'react';
import ContactInfo from '@/components/Settings/ContactInfo';
import AccountSecurity from '@/components/Settings/AccountSecurity';

const headingStyle = {
  color: '#0E1117',
  fontFamily: 'Archivo',
  fontWeight: 600,
  fontSize: '32px',
  textAlign: 'left' as const,
  marginTop: '32px',
  marginLeft: '-32px',
};

export function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const accountSecurityMatch = useMatch('/settings/account-security');
  const contactInfoMatch = useMatch('/settings/contact-info');

  useEffect(() => {
    if (location.pathname === '/settings') {
      if (!accountSecurityMatch && !contactInfoMatch) {
        navigate('/settings/account-security', { replace: true });
      }
    }
  }, [location.pathname, navigate, accountSecurityMatch, contactInfoMatch]);

  return (
    <MainLayout>
      <SettingsLayout sidebar={<SettingsSidebar />}>
        <Routes>
          <Route path="/account-security" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Account Security</h2>
              <AccountSecurity />
            </div>
          } />
          <Route path="/contact-info" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Contact Info</h2>
              <ContactInfo />
            </div>
          } />
        </Routes>
      </SettingsLayout>
    </MainLayout>
  );
}
