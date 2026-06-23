import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProjectDetail.css";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProject(data.data);
        }
      })
      .catch(() => {
        // 静态部署时无后端，从本地 JSON 查找对应项目
        fetch(`${import.meta.env.BASE_URL}projects.json`)
          .then((res) => res.json())
          .then((data) => {
            const found = data.find(
              (p: Project) => p.id === Number(id)
            );
            if (found) setProject(found);
          })
          .catch((err) => console.error("加载项目失败:", err))
          .finally(() => setLoading(false));
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="page-section">
        <div className="container">
          <p>加载中...</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="page-section">
        <div className="container">
          <h1 className="page-title">项目不存在</h1>
          <Link to="/projects" className="btn btn-primary">
            返回项目列表
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-section">
      <div className="container">
        <Link to="/projects" className="back-link">
          ← 返回项目列表
        </Link>
        <div className="project-detail">
          <div className="project-detail-image">
            <img src={`${import.meta.env.BASE_URL}${project.image}`} alt={project.title} />
          </div>
          <div className="project-detail-info">
            <h1 className="page-title">{project.title}</h1>
            <div className="project-detail-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <p className="project-detail-desc">{project.description}</p>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                查看项目
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetail;
