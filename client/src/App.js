import './App.css';
import Home from './component/js/home'
import Meeting from './component/js/meeting'
import Login from './component/js/login'
import Dash from './component/js/dashboard'
import Nf from './component/js/nf'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import NewMeeting from './component/js/newMeeting';
function App() {

  return (
    <BrowserRouter>
    <div className="App">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/dashboard" element={<Dash/>}/>
      <Route path="/dashboard/new" element={<NewMeeting/>}/>
      <Route path="/dashboard/meeting" element={<Meeting/>}/>
      <Route path="*" element={<Nf/>}/>
    </Routes>
    </div>
    </BrowserRouter>
  
  );
}

export default App;
