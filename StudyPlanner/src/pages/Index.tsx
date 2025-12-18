import { useState, useEffect } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useStudyPlanner } from '@/hooks/useStudyPlanner';
import { useReminders } from '@/hooks/useReminders';
import { useAuth } from '@/hooks/useAuth';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Courses from './Courses';
import Tasks from './Tasks';
import Exams from './Exams';
import CalendarView from './CalendarView';
import Settings from './Settings';
import Auth from './Auth';
import AIAssistant from './AIAssistant';

const Index = () => {
  const { isAuthenticated, loading } = useAuth();
  const {
    courses,
    tasks,
    exams,
    settings,
    saveCourse,
    deleteCourse,
    saveTask,
    deleteTask,
    updateTaskStatus,
    saveExam,
    deleteExam,
    updateSettings,
    resetAll,
  } = useStudyPlanner();

  useReminders(courses, tasks, exams, settings.reminders);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Dashboard
                    courses={courses}
                    tasks={tasks}
                    exams={exams}
                    onEditTask={saveTask}
                    onDeleteTask={deleteTask}
                    onEditExam={saveExam}
                    onDeleteExam={deleteExam}
                    onTaskStatusChange={updateTaskStatus}
                  />
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <Courses
                    courses={courses}
                    onSave={saveCourse}
                    onDelete={deleteCourse}
                  />
                } 
              />
              <Route 
                path="/tasks" 
                element={
                  <Tasks
                    tasks={tasks}
                    courses={courses}
                    onSave={saveTask}
                    onDelete={deleteTask}
                    onStatusChange={updateTaskStatus}
                  />
                } 
              />
              <Route 
                path="/exams" 
                element={
                  <Exams
                    exams={exams}
                    courses={courses}
                    onSave={saveExam}
                    onDelete={deleteExam}
                  />
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <CalendarView
                    courses={courses}
                    tasks={tasks}
                    exams={exams}
                  />
                } 
              />
              <Route 
                path="/ai-assistant" 
                element={
                  <AIAssistant
                    courses={courses}
                    tasks={tasks}
                    exams={exams}
                  />
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <Settings
                    settings={settings}
                    onUpdateSettings={updateSettings}
                    onResetAll={resetAll}
                  />
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
