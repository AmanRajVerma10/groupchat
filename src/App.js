import ChatBox from './components/ChatBox';
import Layout from './components/Layout';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import { Switch, Route } from 'react-router-dom';

function App() {
  const token=localStorage.getItem('token');
  return (
    <Layout>
      <Switch>
        <Route path="/login" exact><SignIn></SignIn></Route>
        <Route path="/sign-up" exact><SignUp></SignUp></Route>
        {token && <Route path="/chat" exact><ChatBox></ChatBox></Route>}
      </Switch>
    </Layout>
  );
}

export default App;

