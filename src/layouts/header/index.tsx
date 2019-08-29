import React, { FC, useState } from "react";
import { Icon, Layout } from "antd";

const { Header: AntdHeader } = Layout

const Header: FC = () => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <AntdHeader className='bg-white' style={{ background: '#fff', padding: 0 }}>
      <Icon
        className="ml-4"
        type={collapsed ? 'menu-unfold' : 'menu-fold'}
        onClick={() => setCollapsed(!collapsed)}
      />
    </AntdHeader>
  )
}

export default Header
