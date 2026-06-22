import "./About.css";

function About() {
  return (
    <section className="page-section">
      <div className="container">
        <h1 className="page-title">关于我</h1>
        <div className="about-grid">
          <div className="about-photo">
            <img src="/images/portrait.jpg" alt="个人照片" className="about-img" />
          </div>
          <div className="about-content">
            <p>
              在这里填写你的个人经历与背景。可以介绍你的教育经历、职业道路、
              技能特长，以及是什么驱动你不断前行。
            </p>
            <p>
              这里可以继续补充更多细节——你擅长的技术栈、合作过的团队、
              参与过的开源项目，或者你在工作之外的兴趣爱好。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
