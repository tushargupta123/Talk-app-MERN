import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Chat from './Pages/Chat';

function App() {
  return (
    <div class="App">
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/chats" element={<Chat/>}/>
    </Routes>
    </div>
  );
}

export default App;
