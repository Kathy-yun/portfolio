import { useLocation } from "react-router-dom";
import "./PageTransition.css";

/**
 * 页面切换过渡包装器：路由变化时触发淡入动画
 */
function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // key 随路径变化，React 重新挂载 div 从而触发 CSS 动画
  return (
    <div className="page-transition" key={location.pathname}>
      {children}
    </div>
  );
}

export default PageTransition;
