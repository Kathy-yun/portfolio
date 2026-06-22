import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css";

function Login() {
  const { login, isLogged, logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 已登录状态
  if (isLogged) {
    return (
      <section className="page-section">
        <div className="container login-container">
          <h1 className="page-title">已登录</h1>
          <p className="section-desc">你已经以管理员身份登录。</p>
          <div className="login-actions">
            <button className="btn btn-primary" onClick={() => navigate("/admin")}>
              进入管理页面
            </button>
            <button className="btn btn-outline" onClick={logout}>
              退出登录
            </button>
          </div>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await login(username, password);
    setLoading(false);
    if (ok) {
      navigate("/admin");
    } else {
      setError("用户名或密码错误");
    }
  };

  return (
    <section className="page-section">
      <div className="container login-container">
        <h1 className="page-title">管理员登录</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="请输入用户名"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="请输入密码"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Login;
