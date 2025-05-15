import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SettingsSidebarProps {
  className?: string;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ className }) => {
  const listPadding = 'px-16';
  const location = useLocation();

  return (
    <div className={cn('w-full h-full py-16 bg-white', className)}>
      <div className="text-left text-4xl font-semibold mb-16 px-16">Settings</div>

      <div className={listPadding}>
        <h2 className="text-2xl font-semibold text-[#A6B5BB] mb-6">
          User Settings
        </h2>
        <ul className="relative before:absolute before:top-[-10px] before:bottom-[-10px] before:left-[0px] before:w-[1px] before:bg-[#A6B5BB] before:ml-[0px]">
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/contact-info"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Contact Info
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/account-security"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Account Security
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/notification-settings"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Notification Settings
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/privacy-settings"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Privacy Settings
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/app-preferences"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  App Preferences
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/learning-preferences"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Learning Preferences
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/account-management"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Account Management
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/support-help"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Support &amp; Help
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="pl-[13px]">
            <NavLink
              to="/settings/linked-accounts"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Linked Accounts
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>

      <div className={listPadding}>
        <h2 className="text-2xl font-semibold text-[#A6B5BB] mb-6 mt-8">
          Payment and Billing
        </h2>
        <ul className="relative before:absolute before:top-[-10px] before:bottom-[-10px] before:left-[0px] before:w-[1px] before:bg-[#A6B5BB] before:ml-[0px]">
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/subscription-details"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Subscription Details
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/saved-payment-methods"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Saved Payment Methods
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="mb-2 pl-[13px]">
            <NavLink
              to="/settings/invoice-transaction-history"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Invoice and Transaction History
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
          <li className="pl-[13px]">
            <NavLink
              to="/settings/promotions-discounts"
              className={({ isActive }) =>
                cn(
                  'block text-lg relative transition-all duration-300',
                  'text-[#A6B5BB]',
                  isActive && 'text-[#5F24E0]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  Promotions and Discounts
                  {isActive && (
                    <span className="absolute left-[-16.5px] top-1/2 -translate-y-1/2 w-[6px] h-[22px] bg-[#5F24E0] rounded-md" />
                  )}
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsSidebar;
