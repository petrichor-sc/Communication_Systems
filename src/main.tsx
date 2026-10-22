import {createRoot} from 'react-dom/client';
import Notebook from './notebook';
import './globals.css';
import './journey.css';
import './dark.css';
import './lecture0.css';
createRoot(document.getElementById('root')!).render(<Notebook/>);
