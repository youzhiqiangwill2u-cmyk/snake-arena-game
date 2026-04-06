import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import { IS_TEST_MODE } from './lib/constants';
import type { ReactNode } from 'react';

/**
 * 路由守卫：未登录用户重定向到登录页
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-center">
        <div className="loading-spinner" />
        <p className="loading-text">加载中...</p>
      </div>
    );
  }

  // 测试模式下始终允许访问，非测试模式下检查用户状态
  if (!IS_TEST_MODE && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * 应用根组件
 * NOTE: 配置认证 Provider 和路由
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<GamePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
