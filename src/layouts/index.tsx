import React, { FC } from "react";
import Routes from "./routers";
import { Layout } from 'antd'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Sider from "./sider";
import Header from "./header";

const { Content } = Layout

const DefaultLayout: FC = (props) => {

  return (
    <Router>
      <Layout>
        <Route path='' component={Sider} />
        <Layout>
          <Route path='' component={Header} />

          <Content>
            <Routes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default DefaultLayout
