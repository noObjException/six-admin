import React, { useState, FC, useEffect } from 'react'
import { Modal, Tabs, message } from 'antd';
import copy from 'copy-to-clipboard';
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const tsxTemp = (code: string) => (
  `import React, { FC } from 'react'
import SimpleForm from 'components/SimpleForm'

const Form: FC = () => {

  const schema = ${code}

  return (
    <SimpleForm schema={schema} />
  )
} 

export default Form`
)

const jsxTemp = (code: string) => (
  `import React from 'react'
import SimpleForm from 'components/SimpleForm'

const Form = () => {

  const schema = ${code}

  return (
    <SimpleForm schema={schema} />
  )
} 

export default Form`
)

const codeHighlighter = (code: string) => <SyntaxHighlighter language="javascript" style={docco}>{code}</SyntaxHighlighter>

interface IProps {
  data: object
}
const ShowCode: FC<IProps> = (props) => {
  const [visible, setVisible] = useState(false)
  const [copyText, setCopyText] = useState('')

  // have to set it
  useEffect(() => {
    const code = JSON.stringify(props.data, null, 2)
    setCopyText(code)
  }, [props.data])

  const handleChange = (key: 'json' | 'tsx' | 'jsx') => {
    const json = JSON.stringify(props.data, null, 2)
    switch (key) {
      case 'json':
        setCopyText(json)
        break
      case 'tsx':
        setCopyText(tsxTemp(json))
        break
      case 'jsx':
        setCopyText(jsxTemp(json))
        break
      default:
        setCopyText(json)
    }
  }

  return (
    <>
      <span onClick={() => setVisible(!visible)}>{props.children}</span>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        okText='复制'
        onOk={() => copy(copyText, { debug: true }) && message.success('复制成功')}
      >
        <Tabs type="card" onChange={(key) => handleChange(key as 'json' | 'tsx' | 'jsx')}>
          <Tabs.TabPane tab='JSON' key='json'>
            {codeHighlighter(copyText)}
          </Tabs.TabPane>
          <Tabs.TabPane tab='TSX' key='tsx'>
            {codeHighlighter(copyText)}
          </Tabs.TabPane>
          <Tabs.TabPane tab='JSX' key='jsx'>
            {codeHighlighter(copyText)}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  )
}

export default ShowCode
