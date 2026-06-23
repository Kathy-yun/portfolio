import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="hero-greeting">你好，我是</p>
        <h1 className="hero-name">你的名字</h1>
        <p className="hero-desc">
          一名热爱创造的设计师与开发者。专注于构建简洁、优雅且用户友好的数字体验。
          欢迎浏览我的作品集，了解我参与的项目与创作。
        </p>
        <div>
          <Link to="/projects" className="btn btn-primary">
            查看作品
          </Link>
          <Link to="/contact" className="btn btn-outline">
            联系我
          </Link>
        </div>
      </div>
      <div className="hero-photo" aria-label="个人照片">
        <img src="images/portrait.jpg" alt="个人照片" />
      </div>
    </section>
  );
}

export default Home;
