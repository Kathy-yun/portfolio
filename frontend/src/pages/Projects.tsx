import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Projects.css";

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error("加载项目失败:", err));
  }, []);

  return (
    <section className="page-section">
      <div className="container">
        <h1 className="page-title">项目作品</h1>
        <div className="projects-grid">
          {projects.map((project) => (
            <Link
              to={`/projects/${project.id}`}
              key={project.id}
              className="project-card"
            >
              <div className="project-thumb">
                <img src={project.image} alt={project.title} />
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
