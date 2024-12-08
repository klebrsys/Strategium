import React, { useState, useEffect } from 'react';
import { Eye, Target, Gem, Quote } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getVisions, getMissions, getValues } from '../services/storage';
import type { Vision, Mission, Value } from '../types';

export function StrategicOverview() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [vision, setVision] = useState<Vision | null>(null);
  const [mission, setMission] = useState<Mission | null>(null);
  const [values, setValues] = useState<Value[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (user?.companyId) {
      // Load Vision
      const visions = getVisions();
      const companyVision = visions.find(v => v.companyId === user.companyId);
      setVision(companyVision || null);

      // Load Mission
      const missions = getMissions();
      const companyMission = missions.find(m => m.companyId === user.companyId);
      setMission(companyMission || null);

      // Load Values
      const allValues = getValues();
      const companyValues = allValues.filter(v => v.companyId === user.companyId);
      setValues(companyValues);

      // Trigger animation after loading
      setTimeout(() => setShowAnimation(true), 100);
    }
  }, [user?.companyId]);

  if (!user?.companyId) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard.title')}</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Vision Card */}
        <div className={`transform transition-all duration-700 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-xl p-6 h-full">
            <div className="flex items-center space-x-3 mb-4">
              <Eye className="h-6 w-6 text-indigo-600" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('vision.title')}</h2>
            </div>
            <div className="relative">
              <Quote className="h-8 w-8 text-indigo-600 mb-4" />
              <p className="text-lg text-gray-800 leading-relaxed">
                {vision?.description || t('vision.empty')}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Card */}
        <div className={`transform transition-all duration-700 delay-100 ${
          showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="bg-gradient-to-br from-white to-emerald-50 rounded-xl shadow-xl p-6 h-full">
            <div className="flex items-center space-x-3 mb-4">
              <Target className="h-6 w-6 text-emerald-600" />
              <h2 className="text-2xl font-semibold text-gray-900">{t('mission.title')}</h2>
            </div>
            <div className="relative">
              <Quote className="h-8 w-8 text-emerald-600 mb-4" />
              <p className="text-lg text-gray-800 leading-relaxed">
                {mission?.description || t('mission.empty')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className={`transform transition-all duration-700 delay-200 ${
        showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Gem className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">{t('values.title')}</h2>
          </div>
          
          {values.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={value.id}
                  className={`bg-white rounded-lg p-4 shadow-md transform transition-all duration-500 hover:scale-105`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{value.description}</h3>
                  {value.meaning && (
                    <p className="text-sm text-gray-600">{value.meaning}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">{t('values.empty')}</p>
          )}
        </div>
      </div>

      {values.length > 0 && (
        <div className="flex justify-center space-x-4 mt-6">
          <div className="px-4 py-2 bg-indigo-50 rounded-full text-indigo-700 text-sm font-medium animate-fade-in">
            {t('dashboard.purposeDriven')}
          </div>
          <div className="px-4 py-2 bg-teal-50 rounded-full text-teal-700 text-sm font-medium animate-fade-in delay-100">
            {t('dashboard.makingImpact')}
          </div>
          <div className="px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium animate-fade-in delay-200">
            {t('dashboard.creatingValue')}
          </div>
        </div>
      )}
    </div>
  );
}