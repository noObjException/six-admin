import React, { FC } from "react";
import {
  SchemaForm, FormButtonGroup, Submit, Reset,
} from '@uform/antd'
import { Observable } from "rxjs/internal/Observable";
import BaseProps from "types/base-props";

interface ISimpleForm extends BaseProps {
  columns?: Columns[]
  schema: any,
  onSubmit?: (val: any) => void,
  showActions?: boolean,
  initialValues?: any,
  value?: any,
  editable?: boolean
}

interface Columns {
  label: string,
  type: 'string' | 'number' | 'upload',
  key: string,
}

const SimpleForm: FC<ISimpleForm> = (props) => {

  return (
    <div className="overflow-scroll bg-white p-2">
      <SchemaForm
        effects={($: (event: string) => Observable<any>) => {
          $('onFormInit').subscribe(() => {

          })
        }}
        editable={props.editable}
        schema={props.schema}
        initialValues={props.initialValues}
        onSubmit={(val: any) => props.onSubmit && props.onSubmit(val)}
      >
        {
          props.showActions !== false &&
          <FormButtonGroup sticky offset={8}>
            <Submit>提交</Submit>
            <Reset>重置</Reset>
          </FormButtonGroup>
        }
      </SchemaForm>
    </div>
  )
}

export default SimpleForm
