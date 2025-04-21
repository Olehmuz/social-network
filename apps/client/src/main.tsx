import './index.css'
import './app/App.css'
import App from './app/App.tsx'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router"
import { ChatArea } from './widgets/chat/ui/chat-area.tsx'
import ProtectedRoute from './shared/lib/protected.route.tsx'
import SignIn from './pages/auth/sign-in/page.tsx'
import SignUp from './pages/auth/sign-up/page.tsx'
import { ChatSettings } from './widgets/chat/ui/chat-settings.tsx'

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<App />}>
            <Route path=":chatId" element={
              <ChatArea />
              }
            />
            <Route path=':chatId/settings' element={
              <ChatSettings />} 
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>  
);