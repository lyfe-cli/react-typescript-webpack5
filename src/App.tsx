import React, { lazy, ReactElement, Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import styles from './App.less';
import 'antd/dist/antd.css';

// 供应商知识图
const Template = lazy(() => import(/* webpackChunkName: 'template'*/ './pages/Tpl/Template'));

const App = (): ReactElement => {
  return (
    <div className={styles.app}>
      <Suspense fallback>
        <Router>
          <Switch>
            <Route exact path="/" />
            <Route path="/tpl" component={Template} />
          </Switch>
        </Router>
      </Suspense>
    </div>
  );
};

export default App;
