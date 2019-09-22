import React, { FC } from "react";
import { Layout, Menu, Icon } from 'antd'
import useRouter from 'use-react-router'

const { Sider: AntdSider } = Layout;

interface IMenu {
  title: string,
  icon: string,
  path?: string,
  children?: IMenu[]
}
const menus: IMenu[] = [
  // { title: '产品列表', icon: 'video-camera', path: 'products' },
  // { title: '产品分类列表', icon: 'video-camera', path: 'product-categories' },
  // { title: '用户列表', icon: 'user', path: 'users' },
  // {
  //   title: '工具', icon: 'user',
  //   children: [
  //     { title: '表单生成', icon: 'form', path: 'tools/form' },
  //   ]
  // },
  { title: '表单生成', icon: 'form', path: 'tools/form' },
  { title: '表格生成', icon: 'table', path: 'tools/table' },
]

const Sider: FC = () => {
  const { history } = useRouter()

  return (
    <AntdSider className='min-h-screen'>
      <div className='h-12 bg-blue-100 m-4 flex-center'>Logo</div>
      <Menu theme='dark' mode='inline' onClick={({ key }) => isNaN(Number(key)) && history.push(`/${key}`)}>
        {menus.map((menu: IMenu, key) => (

          menu.children ?
            <Menu.SubMenu
              key={key + '1'}
              title={(
                <>
                  <Icon type={menu.icon} />
                  <span>{menu.title}</span>
                </>
              )}
            >
              {
                menu.children.map((child) => (
                  <Menu.Item key={child.path}>
                    <Icon type={child.icon} />
                    <span>{child.title}</span>
                  </Menu.Item>
                ))
              }
            </Menu.SubMenu>
            :
            <Menu.Item key={menu.path || key}>
              <Icon type={menu.icon} />
              <span>{menu.title}</span>
            </Menu.Item>
        ))}
      </Menu>
    </AntdSider>
  )
}

export default Sider
