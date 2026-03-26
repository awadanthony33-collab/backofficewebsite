import { ConfigProvider } from '../node_modules/antd/es/index';
import './App.css';
import LoginPage from './pages/LoginPage';

function App() {
           return( <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a4091b',
        },
      }}
    >
 <LoginPage/>
    </ConfigProvider>
           )
}

export default App;