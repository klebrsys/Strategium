import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, Target } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../contexts/LanguageContext';
import { getObjectives, setObjectives, getGoals, getActionPlans } from '../services/storage';
import type { Objective, Goal, ActionPlan } from '../types';

export function Objectives() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [objectives, setObjectivesState] = useState<Objective[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingObjective, setEditingObjective] = useState<Objective | undefined>();

  const loadData = () => {
    if (user?.companyId) {
      const storedObjectives = getObjectives();
      const companyObjectives = storedObjectives.filter(o => o.companyId === user.companyId);
      setObjectivesState(companyObjectives);

      const storedGoals = getGoals();
      const companyGoals = storedGoals.filter(g => g.companyId === user.companyId);
      setGoals(companyGoals);

      const storedActionPlans = getActionPlans();
      const companyActionPlans = storedActionPlans.filter(p => p.companyId === user.companyId);
      setActionPlans(companyActionPlans);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.companyId]);

  const handleSubmit = (data: Partial<Objective>) => {
    if (!user?.companyId) return;

    const allObjectives = getObjectives();
    let updatedObjectives: Objective[];
    
    if (editingObjective) {
      updatedObjectives = allObjectives.map(o => 
        o.id === editingObjective.id ? { ...editingObjective, ...data } : o
      );
    } else {
      const newObjective: Objective = {
        id: Date.now().toString(),
        description: data.description!,
        startDate: data.startDate!,
        endDate: data.endDate!,
        goalId: data.goalId!,
        progress: data.progress || 0,
        achievedPercentage: 0,
        companyId: user.companyId,
      };
      updatedObjectives = [...allObjectives, newObjective];
    }
    
    setObjectives(updatedObjectives);
    setObjectivesState(updatedObjectives.filter(o => o.companyId === user.companyId));
    handleCancel();
  };

  const handleEdit = (objective: Objective) => {
    setEditingObjective(objective);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t('objectives.confirmDelete'))) return;

    const allObjectives = getObjectives();
    const updatedObjectives = allObjectives.filter(o => o.id !== id);
    setObjectives(updatedObjectives);
    setObjectivesState(updatedObjectives.filter(o => o.companyId === user?.companyId));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingObjective(undefined);
  };

  const getGoalDescription = (goalId: string) => {
    return goals.find(g => g.id === goalId)?.description || t('objectives.unknownGoal');
  };

  const getLinkedActionPlans = (objectiveId: string) => {
    return actionPlans.filter(plan => plan.objectiveId === objectiveId);
  };

  if (!user?.companyId) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('objectives.title')}</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="h-5 w-5 mr-2" />
            {t('objectives.new')}
          </button>
        )}
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingObjective ? t('objectives.edit') : t('objectives.new')}
          </h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            handleSubmit({
              description: formData.get('description') as string,
              startDate: formData.get('startDate') as string,
              endDate: formData.get('endDate') as string,
              goalId: formData.get('goalId') as string,
              progress: parseInt(formData.get('progress') as string, 10),
            });
          }} className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                {t('objectives.description')}
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={editingObjective?.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={t('objectives.descriptionPlaceholder')}
                required
              />
            </div>

            <div>
              <label htmlFor="goalId" className="block text-sm font-medium text-gray-700">
                {t('objectives.relatedGoal')}
              </label>
              <select
                id="goalId"
                name="goalId"
                defaultValue={editingObjective?.goalId}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              >
                <option value="">{t('objectives.selectGoal')}</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  {t('objectives.startDate')}
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  defaultValue={editingObjective?.startDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  {t('objectives.endDate')}
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  defaultValue={editingObjective?.endDate}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="progress" className="block text-sm font-medium text-gray-700">
                {t('objectives.manualProgress')}
              </label>
              <input
                type="range"
                id="progress"
                name="progress"
                min="0"
                max="100"
                defaultValue={editingObjective?.progress || "0"}
                className="mt-1 block w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {editingObjective ? t('common.save') : t('common.create')}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('objectives.description')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('objectives.relatedGoal')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('objectives.timeline')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('objectives.progress')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{t('objectives.actions')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {objectives.map((objective) => (
                <tr key={objective.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{objective.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Target className="h-4 w-4 mr-2" />
                      <span>{getGoalDescription(objective.goalId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t('objectives.manual')}:</span>
                        <span className="font-medium">{objective.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${objective.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t('objectives.fromPlans')}:</span>
                        <span className="font-medium">{objective.achievedPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${objective.achievedPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(objective)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title={t('common.edit')}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(objective.id)}
                        className="text-red-600 hover:text-red-900"
                        title={t('common.delete')}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {objectives.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Target className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('objectives.noObjectives')}</h3>
                    <p className="mt-1 text-sm text-gray-500">{t('objectives.getStarted')}</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        {t('objectives.new')}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}