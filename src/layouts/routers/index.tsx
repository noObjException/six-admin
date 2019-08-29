import React, { FC, ReactNode } from "react";
import { BrowserRouter as Router, Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";

const Index = () => <div>index</div>
const Home = () => <div>Home</div>
interface IRoute {
  path: string,
  name?: string,
  exact?: boolean,
  component: React.ComponentClass<any, any> | React.FunctionComponent<any> | React.ComponentClass<RouteComponentProps<any, StaticContext, any>, any> | React.FunctionComponent<RouteComponentProps<any, StaticContext, any>> | undefined,
}

const routes: IRoute[] = [
  { path: '/', component: Index },
  { path: '/home', component: Home },
]

const Routes: FC = () => {
  return (
    <Router>
      {routes.map(({ path, exact = true, component }, key) => (
        <Route path={path} exact={exact} component={component} key={key} />
      ))}
    </Router>
  )
}

export default Routes
