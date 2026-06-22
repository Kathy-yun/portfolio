import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./AdminProjects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

const emptyForm = {
  title: "",
  description: "",
  image: "",
  tags: "",
  link: "",
};

function AdminProjects() {
  const { token, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // 加载项目列表
  const loadProjects = () => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
      })
      .catch((err) => console.error("加载失败:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // 提交表单（创建/更新）
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      title: form.title,
      description: form.description,
      image: form.image,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      link: form.link,
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setForm(emptyForm);
        setEditingId(null);
        loadProjects();
      } else {
        alert(data.error?.message || "操作失败");
      }
    } catch {
      alert("操作失败");
    }
  };

  // 编辑：填充表单
  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(", "),
      link: project.link,
    });
  };

  // 删除
  const handleDelete = async (id: number) => {
    if (!confirm("确定删除这个项目吗？")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.success) {
        loadProjects();
        if (editingId === id) {
          setEditingId(null);
          setForm(emptyForm);
        }
      } else {
        alert(data.error?.message || "删除失败");
      }
    } catch {
      alert("删除失败");
    }
  };

  // 取消编辑
  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (loading) {
    return (
      <section className="page-section">
        <div className="container"><p>加载中...</p></div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <div className="admin-header">
          <h1 className="page-title">管理项目作品</h1>
          <button className="btn btn-outline" onClick={logout}>
            退出登录
          </button>
        </div>

        {/* 表单 */}
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2 className="admin-form-title">
            {editingId ? "编辑项目" : "添加新项目"}
          </h2>
          <div className="form-group">
            <label>项目名称 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              placeholder="输入项目名称"
            />
          </div>
          <div className="form-group">
            <label>项目描述 *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={3}
              placeholder="输入项目描述"
            />
          </div>
          <div className="form-group">
            <label>图片地址</label>
            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="/images/project1.jpg"
            />
          </div>
          <div className="form-group">
            <label>技术标签（逗号分隔）</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          <div className="form-group">
            <label>项目链接</label>
            <input
              type="text"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? "保存修改" : "添加项目"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
              >
                取消
              </button>
            )}
          </div>
        </form>

        {/* 项目列表 */}
        <div className="admin-list">
          <h2 className="admin-form-title">现有项目（{projects.length}）</h2>
          {projects.map((project) => (
            <div key={project.id} className="admin-item">
              <div className="admin-item-info">
                <Link to={`/projects/${project.id}`} className="admin-item-title">
                  {project.title}
                </Link>
                <span className="admin-item-tags">
                  {project.tags.join(", ")}
                </span>
              </div>
              <div className="admin-item-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(project)}
                >
                  编辑
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(project.id)}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default AdminProjects;
