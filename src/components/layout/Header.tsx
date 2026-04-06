import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 顶部导航栏
 * NOTE: 显示 Logo、导航链接和用户信息/退出按钮
 */
export default function Header() {
  const { profile, signOut, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'ARENA', icon: '🎮' },
    { path: '/leaderboard', label: 'RANKING', icon: '🏆' },
    { path: '/profile', label: 'PROFILE', icon: '👤' },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <span className="logo-icon">▲</span>
          <span className="logo-text">SNAKE ARENA</span>
        </Link>

        {user && (
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
        )}

        <div className="header-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {profile ? (
            <>
              <span className="user-greeting" style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                CONNECTED: <strong>{profile.username}</strong>
              </span>
              <button 
                className="btn btn--ghost" 
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={signOut}
              >
                DISCONNECT
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn--primary" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
              ACCESS
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

