import React, { FC } from "react";
import {
  SchemaForm, FormButtonGroup, Submit, Reset,
} from '@uform/antd'

interface ISimpleForm {
  columns?: Columns[]
  schema: any,
  onSubmit?: (val: any) => void,
  showActions?: boolean,
}

interface Columns {
  label: string,
  type: 'string' | 'number' | 'upload',
  key: string,
}

const SimpleForm: FC<ISimpleForm> = (props) => {


  return (
    <div className="overflow-scroll">
      <SchemaForm
        schema={props.schema}
        onSubmit={(val: any) => props.onSubmit && props.onSubmit(val)}
      >
        {
          props.showActions !== false &&
          <FormButtonGroup>
            <Submit>提交</Submit>
            <Reset>重置</Reset>
          </FormButtonGroup>
        }
      </SchemaForm>
    </div>
  )
}

export default SimpleForm
