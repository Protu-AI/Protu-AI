import { Navbar } from '@/components/common/Navbar';
import SettingsLayout from '@/layouts/SettingsLayout';
import SettingsSidebar from '@/components/Settings/SettingsSidebar';
import { Route, Routes, useSearchParams, useLocation, useNavigate, useMatch } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { MainLayout } from '@/layouts/MainLayout';
import { useEffect } from 'react';
import ContactInfo from '@/components/Settings/ContactInfo';
import AccountSecurity from '@/components/Settings/AccountSecurity';
import NotificationSettings from '@/components/Settings/NotificationSettings';
import PrivacySettings from '@/components/Settings/PrivacySettings';
import AppPreferences from '@/components/Settings/AppPreferences';
import LearningPreferences from '@/components/Settings/LearningPreferences';
import AccountManagement from '@/components/Settings/AccountManagement';
import SupportHelp from '@/components/Settings/SupportHelp';
import LinkedAccounts from '@/components/Settings/LinkedAccounts';
import SubscriptionDetails from '@/components/Settings/SubscriptionDetails';
import SavedPaymentMethods from '@/components/Settings/SavedPaymentMethods';
import InvoiceTransactionHistory from '@/components/Settings/InvoiceTransactionHistory';
import PromotionsDiscounts from '@/components/Settings/PromotionsDiscounts';

const headingStyle = {
  color: '#0E1117',
  fontFamily: 'Archivo',
  fontWeight: 600,
  fontSize: '32px',
  textAlign: 'left',
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
          <Route path="/notification-settings" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Notification Settings</h2>
              <NotificationSettings />
            </div>
          } />
          <Route path="/privacy-settings" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Privacy Settings</h2>
              <PrivacySettings />
            </div>
          } />
          <Route path="/app-preferences" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>App Preferences</h2>
              <AppPreferences />
            </div>
          } />
          <Route path="/learning-preferences" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Learning Preferences</h2>
              <LearningPreferences />
            </div>
          } />
          <Route path="/account-management" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Account Management</h2>
              <AccountManagement />
            </div>
          } />
          <Route path="/support-help" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Support &amp; Help</h2>
              <SupportHelp />
            </div>
          } />
          <Route path="/linked-accounts" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Linked Accounts</h2>
              <LinkedAccounts />
            </div>
          } />
          <Route path="/subscription-details" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Subscription Details</h2>
              <SubscriptionDetails />
            </div>
          } />
          <Route path="/saved-payment-methods" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Saved Payment Methods</h2>
              <SavedPaymentMethods />
            </div>
          } />
          <Route path="/invoice-transaction-history" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Invoice &amp; Transaction History</h2>
              <InvoiceTransactionHistory />
            </div>
          } />
          <Route path="/promotions-discounts" element={
            <div>
              <h2 style={{ ...headingStyle, marginBottom: '64px' }}>Promotions &amp; Discounts</h2>
              <PromotionsDiscounts />
            </div>
          } />
        </Routes>
      </SettingsLayout>
    </MainLayout>
  );
}
