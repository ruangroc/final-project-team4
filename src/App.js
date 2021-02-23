import './App.css';
import { Route, Switch} from 'react-router-dom';
import Home from "./pages/home";
import Developers from "./pages/developers";
import Error from "./pages/error";
import ComhinePlaylists from "./pages/combineplaylists";
import CollabPlaylist from "./pages/collabplaylist";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Switch>
      <Route path="/developers" component={Developers}/>
      <Route path="/combineplaylists" component={ComhinePlaylists}/>
      <Route path="/collabplaylist" component={CollabPlaylist}/>

      <Route exact path="/" component={Home}/>
      <Route component={Error} />

    </Switch>
  );
}

export default App;
