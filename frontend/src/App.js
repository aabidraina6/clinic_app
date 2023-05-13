import './App.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {BrowserRouter , Route , Routes}  from 'react-router-dom';
import Dashboard from './dashboard';
import CurrentToken from './currentToken';
function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path='/dashboard' element = {<Dashboard/>}></Route>
    <Route path='/current-token' element = {<CurrentToken/>}></Route>
  </Routes>
  </BrowserRouter>
  );
}

export default App;
