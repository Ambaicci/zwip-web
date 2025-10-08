// src/utils/lazyLoad.tsx
import { lazy } from 'react';

// Lazy load components for better performance
export const SendMoney = lazy(() => import('../SendMoney'));
export const Recharge = lazy(() => import('../Recharge'));
export const ReceiveMoney = lazy(() => import('../ReceiveMoney'));
export const Pay = lazy(() => import('../Pay'));
export const ScanQR = lazy(() => import('../ScanQR'));
export const CashAtAgent = lazy(() => import('../CashAtAgent'));
export const Transactions = lazy(() => import('../Transactions'));
export const Settings = lazy(() => import('../Settings'));
export const Profile = lazy(() => import('../Profile'));
export const MoreServices = lazy(() => import('../MoreServices'));
