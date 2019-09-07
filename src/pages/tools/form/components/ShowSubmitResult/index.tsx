import React, { FC } from 'react'
import { Modal } from 'antd';
import { isEmpty } from '@uform/utils';

interface IProps {
  data: object,
  onCancel: () => void
}

const ShowSubmitResult: FC<IProps> = (props) => {

  return (
    <Modal
      visible={!isEmpty(props.data)}
      onCancel={() => props.onCancel && props.onCancel()}
      onOk={() => {
        props.onCancel && props.onCancel()
      }}
    >
      <pre>
        {JSON.stringify(props.data, null, 2)}
      </pre>
    </Modal>
  )
}

export default ShowSubmitResult
