import React, { FC } from "react";
import { Layout, Menu, Icon } from 'antd'
import useRouter from 'use-react-router'

const { Sider: AntdSider } = Layout;

const menus = [
  { title: '产品列表', icon: 'video-camera', path: 'products' },
  { title: '产品分类列表', icon: 'video-camera', path: 'product-categories' },
  { title: '用户列表', icon: 'user', path: 'users' },
]

const Sider: FC = () => {
  const { history } = useRouter()

  return (
    <AntdSider className='min-h-screen'>
      <div className='h-12 bg-blue-100 m-4 flex-center'>Logo</div>
      <Menu theme='dark' onClick={({ key }) => history.push(key)}>
        {menus.map(({ title, icon, path }) => (
          <Menu.Item key={path}>
            <Icon type={icon} />
            <span>{title}</span>
          </Menu.Item>
        ))}
      </Menu>
    </AntdSider>
  )
}

export default Sider
