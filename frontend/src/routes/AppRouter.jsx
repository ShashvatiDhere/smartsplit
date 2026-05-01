import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../pages/Dashboard';
import { Groups } from '../pages/Groups';
import { GroupDetails } from '../pages/GroupDetails';
import { Expenses } from '../pages/Expenses';
import { Notifications } from '../pages/Notifications';
import { Settlements } from '../pages/Settlements';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:id" element={<GroupDetails />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settlements" element={<Settlements />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
