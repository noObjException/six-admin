import React, { FC } from "react";
import {
  SchemaForm, FormButtonGroup, Submit, Reset,
} from '@uform/antd'
import { Observable } from "rxjs/internal/Observable";


interface ISimpleForm {
  columns?: Columns[]
  schema: any,
  onSubmit?: (val: any) => void,
  showActions?: boolean,
  value?: any,
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
        effects={($: (event: string) => Observable<any>) => {
          $('onFormInit').subscribe(() => {

          })
        }}
        schema={props.schema}
        value={props.value}
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
