import { type FormEvent } from "react";
import "./Contact.css";

function Contact() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.data.message);
        form.reset();
      }
    } catch {
      alert("发送失败，请稍后重试");
    }
  };

  return (
    <section className="page-section">
      <div className="container">
        <h1 className="page-title">联系我</h1>
        <p className="section-desc">
          有任何问题或合作意向，欢迎通过表单留言。
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="你的姓名"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="your@email.com"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="message">留言内容</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder="请输入你想说的话..."
            />
          </div>
          <button type="submit" className="btn btn-primary">
            发送留言
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
