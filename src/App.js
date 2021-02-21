import logo from './logo.svg';
import './App.css';
import { Route, Switch, useParams, Redirect} from 'react-router-dom';
import Home from "./pages/home";
import Developers from "./pages/developers";
import Error from "./pages/error";


import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Switch>
      <Route path="/developers" component={Developers}/>
      <Route exact path="/" component={Home}/>
      <Route component={Error} />

    </Switch>
  );
}

export default App;
