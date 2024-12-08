import React from 'react';
import {
  Building2, Users2, Settings, LayoutDashboard, LogOut,
  Eye, Target, Gem, Compass, Flag, CheckSquare,
  ClipboardList, BarChart2, MapPin
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  onNavigate: (page: string) => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  const toggleSubmenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-2 mb-8">
        <Building2 className="h-8 w-8 text-blue-400" />
        <span className="text-xl font-bold">Strategium</span>
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>{t('sidebar.dashboard')}</span>
        </button>
        
        {(user?.role === 'ADMIN' || user?.role === 'MASTER') && (
          <>
            <button
              onClick={() => onNavigate('vision')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Eye className="h-5 w-5" />
              <span>{t('sidebar.vision')}</span>
            </button>

            <button
              onClick={() => onNavigate('mission')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Target className="h-5 w-5" />
              <span>{t('sidebar.mission')}</span>
            </button>

            <button
              onClick={() => onNavigate('values')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Gem className="h-5 w-5" />
              <span>{t('sidebar.values')}</span>
            </button>

            <div>
              <button
                onClick={() => toggleSubmenu('strategic')}
                className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>{t('sidebar.strategicPlanning')}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${expandedMenu === 'strategic' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {expandedMenu === 'strategic' && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-700 pl-4">
                  <button
                    onClick={() => onNavigate('strategic-map')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{t('sidebar.strategicMap')}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('swot')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <BarChart2 className="h-4 w-4" />
                    <span>{t('sidebar.swot')}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('perspectivas')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <Compass className="h-4 w-4" />
                    <span>{t('sidebar.perspectives')}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('goals')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <Flag className="h-4 w-4" />
                    <span>{t('sidebar.goals')}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('objectives')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <CheckSquare className="h-4 w-4" />
                    <span>{t('sidebar.objectives')}</span>
                  </button>
                  <button
                    onClick={() => onNavigate('action-plans')}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left text-sm"
                  >
                    <ClipboardList className="h-4 w-4" />
                    <span>{t('sidebar.actionPlans')}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('users')}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
            >
              <Users2 className="h-5 w-5" />
              <span>{t('sidebar.users')}</span>
            </button>
          </>
        )}
        
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('companies')}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
          >
            <Building2 className="h-5 w-5" />
            <span>{t('sidebar.companies')}</span>
          </button>
        )}
        
        <button
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors w-full text-left"
        >
          <Settings className="h-5 w-5" />
          <span>{t('sidebar.settings')}</span>
        </button>
      </nav>
      
      <button
        onClick={logout}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors mt-auto absolute bottom-4"
      >
        <LogOut className="h-5 w-5" />
        <span>{t('sidebar.logout')}</span>
      </button>
    </aside>
  );
}