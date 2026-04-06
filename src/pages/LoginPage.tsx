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
          <div className="login-icon">🐍</div>
          <h1 className="login-title">Snake Arena</h1>
          <p className="login-subtitle">
            {mode === 'login' ? '登录你的账号' : '创建新账号'}
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="username">用户昵称</label>
              <input
                id="username"
                className="form-input"
                type="text"
                placeholder="输入你的昵称"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">邮箱</label>
            <input
              id="email"
              className="form-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">密码</label>
            <input
              id="password"
              className="form-input"
              type="password"
              placeholder="至少 6 位密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            className="btn btn--primary btn--lg btn--full"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? '处理中...'
              : mode === 'login'
              ? '🚀 登录'
              : '✨ 注册'}
          </button>
        </form>

        <div className="login-switch">
          {mode === 'login' ? (
            <p>
              还没有账号？{' '}
              <button
                className="link-btn"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                立即注册
              </button>
            </p>
          ) : (
            <p>
              已有账号？{' '}
              <button
                className="link-btn"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                返回登录
              </button>
            </p>
          )}
        </div>
      </div>

      {/* 背景装饰动画 */}
      <div className="login-bg-decor">
        <div className="bg-orb bg-orb--1" />
        <div className="bg-orb bg-orb--2" />
        <div className="bg-orb bg-orb--3" />
      </div>
    </div>
  );
}
