import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import ActivityList from './components/ActivityList';
import Map from './components/Map';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/activities" component={ActivityList} />
          <Route path="/map" component={Map} />
        </Switch>
        <div className="theme-toggle">
          <ThemeToggle />
        </div>
      </div>
    </Router>
  );
};

export default App;
