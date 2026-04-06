import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * 页面布局容器
 * NOTE: 包含顶部导航 + 内容区域，所有已认证页面共享此布局
 */
export default function Layout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
