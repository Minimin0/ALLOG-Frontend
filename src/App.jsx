import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter.jsx';

// 앱 최상위: 라우터로 감싸고 실제 경로 매핑은 AppRouter가 담당
export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
