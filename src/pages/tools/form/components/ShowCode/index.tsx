import React, { useState } from 'react'
import { Modal, Tabs, message } from 'antd';
import copy from 'copy-to-clipboard';

const ShowCode = (props: any) => {
  const [visible, setVisible] = useState(false)

  if (props.children) {
    return (
      <>
        <span onClick={() => setVisible(!visible)}>{props.children}</span>
        <Modal
          visible={visible}
          onCancel={() => setVisible(false)}
          okText='复制'
          onOk={() => copy(JSON.stringify(props.data, null, 2), {
            debug: true,
            message: 'Press to copy',
          }) && message.success('复制成功')}
        >
          <Tabs type="card">
            <Tabs.TabPane tab='JSON' key='1'>
              <pre>
                {JSON.stringify(props.data, null, 2)}
              </pre>
            </Tabs.TabPane>
            <Tabs.TabPane tab='TSX' key='2'>
              <pre>
                import React from 'react'
                {JSON.stringify(props.data, null, 2)}
              </pre>
            </Tabs.TabPane>
            <Tabs.TabPane tab='JSX' key='3'>
              <pre>
                import React from 'react'
                {JSON.stringify(props.data, null, 2)}
              </pre>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </>
    )
  }

  return (
    <pre>
      {JSON.stringify(props.data, null, 2)}
    </pre>
  )
}

export default ShowCode
