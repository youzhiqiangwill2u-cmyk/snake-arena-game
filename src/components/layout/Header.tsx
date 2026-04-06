import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 顶部导航栏
 * NOTE: 显示 Logo、导航链接和用户信息/退出按钮
 */
export default function Header() {
  const { profile, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🎮 游戏', icon: '🎮' },
    { path: '/leaderboard', label: '🏆 排行榜', icon: '🏆' },
    { path: '/profile', label: '👤 我的', icon: '👤' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🐍</span>
          <span className="logo-text">Snake Arena</span>
        </Link>

        <nav className="header-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'nav-link--active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-user">
          {profile && (
            <>
              <span className="user-greeting">
                你好, <strong>{profile.username}</strong>
              </span>
              <button className="btn btn--ghost btn--sm" onClick={signOut}>
                退出
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
