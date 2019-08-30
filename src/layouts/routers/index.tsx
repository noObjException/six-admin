import React, { FC } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import { StaticContext } from "react-router";
import Products from "pages/product";
import Users from "pages/user";
import ProductCategory from "pages/product-category";

const Index = () => <div>index</div>

interface IRoute {
  path: string,
  name?: string,
  exact?: boolean,
  component: React.ComponentClass<any, any> | React.FunctionComponent<any> | React.ComponentClass<RouteComponentProps<any, StaticContext, any>, any> | React.FunctionComponent<RouteComponentProps<any, StaticContext, any>> | undefined,
}

const routes: IRoute[] = [
  { path: '/', component: Index },
  { path: '/products', component: Products },
  { path: '/product-categories', component: ProductCategory },
  { path: '/users', component: Users },
]

const Routes: FC = () => {
  return (
    <>
      {routes.map(({ path, exact = true, component }, key) => (
        <Route path={path} exact={exact} component={component} key={key} />
      ))}
    </>
  )
}

export default Routes
