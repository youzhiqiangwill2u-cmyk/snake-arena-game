import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

type AuthMode = 'login' | 'register';

/**
 * 登录/注册页面
 * NOTE: 表单在登录和注册模式间切换，共享同一界面
 */
export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [registered, setRegistered] = useState(false);

  // 已登录则跳转到游戏首页
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  /**
   * 处理表单提交
   */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'register') {
        if (!username.trim()) {
          setError('请输入用户昵称');
          return;
        }
        const { error: err } = await signUp(email, password, username.trim());
        if (err) {
          setError(err);
        } else {
          setRegistered(true);
        }
      } else {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (registered) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">✅</div>
            <h1 className="login-title">注册成功</h1>
            <p className="login-subtitle">请检查你的邮箱并点击确认链接以完成注册</p>
          </div>
          <button
            className="btn btn--primary btn--lg btn--full"
            onClick={() => {
              setRegistered(false);
              setMode('login');
            }}
          >
            返回登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>▲</div>
          <h1 className="login-title">TERMINAL ACCESS</h1>
          <p className="login-subtitle">
            {mode === 'login' ? 'ESTABLISH SECURE CONNECTION' : 'INITIALIZE NEW OPERATOR'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="username" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-low-em)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Operator ID</label>
              <input
                id="username"
                className="form-input"
                type="text"
                placeholder="NICKNAME"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-low-em)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="IDENTITY@GATEWAY.COM"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-low-em)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Access Key</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="form-error" style={{ color: 'var(--accent-danger)', fontSize: '0.8rem', marginBottom: '1rem', padding: '8px', background: 'rgba(255, 77, 77, 0.05)', borderLeft: '2px solid var(--accent-danger)' }}>
              {error}
            </div>
          )}

          <button
            className="btn btn--primary btn--lg"
            style={{ width: '100%', marginTop: '1rem' }}
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'PROCESSING...'
              : mode === 'login'
              ? 'EXECUTE LOGIN'
              : 'INITIALIZE ACCOUNT'}
          </button>
        </form>

        <div className="login-switch" style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-low-em)' }}>
          {mode === 'login' ? (
            <p>
              NEW OPERATOR?{' '}
              <button
                className="link-btn"
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                REGISTER NOW
              </button>
            </p>
          ) : (
            <p>
              EXISTING OPERATOR?{' '}
              <button
                className="link-btn"
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                RETURN TO GATEWAY
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

