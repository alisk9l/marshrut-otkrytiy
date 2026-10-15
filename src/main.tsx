import {createRoot} from 'react-dom/client';
import App from './app/App';
import {ProgressProvider} from './features/progress/ProgressProvider';
import './styles/global.css';
createRoot(document.getElementById('root')!).render(<ProgressProvider><App/></ProgressProvider>);
