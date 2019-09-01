import React, { FC, useState, useEffect, useRef } from "react";
import ContentContainer from "components/ContentContainer";
import SimpleForm from "components/SimpleForm";
import { Button, Modal } from "antd";
import ShowCode from "pages/tools/form/components/ShowCode";
import { isEmpty } from "@uform/utils";


const FormTool: FC = () => {
  const [formSchema, setFormSchema] = useState([])
  const properties: any = {}

  formSchema && formSchema.forEach((field: any) => {
    properties[field.field_key] = {
      title: field.field_name,
      type: field.field_type,
      required: true,
    }
  })

  const schema = {
    type: "object",
    properties: properties,
  }

  const [formResult, setFormResult] = useState({})

  const [options, setOptions] = useState<any[]>([])
  useEffect(() => {
    setTimeout(() => setOptions([{ label: 'string', value: 'string' }]), 1200)
  }, [options])

  return (
    <div className="flex">
      <ContentContainer className='w-full' title='添加表单'>
        <div className="">
          <SimpleForm
            onSubmit={(val) => setFormSchema(val.fields)}
            schema={{
              "type": "object",
              "properties": {
                "fields": {
                  "type": "array",
                  "x-props": {
                    "renderAddition": "添加",
                    "renderRemove": "删除"
                  },
                  "maxItems": 100,
                  "items": {
                    "type": "object",
                    "properties": {
                      "UFORM_NO_NAME_FIELD_$0": {
                        "type": "object",
                        "x-component": "block",
                        "properties": {
                          "UFORM_NO_NAME_FIELD_$1": {
                            "type": "object",
                            "x-props": {
                              "labelCol": 4,
                              "wrapperCol": 20
                            },
                            "x-component": "layout",
                            "properties": {
                              "field_name": {
                                "type": "string",
                                "title": "字段名",
                              },
                              "field_key": {
                                "type": "string",
                                "title": "字段key"
                              },
                              "field_type": {
                                "type": "string",
                                "title": "类型",
                                "enum": options,
                                default: 'string'
                              },
                            }
                          }
                        }
                      },
                    }
                  }
                }
              }
            }} />
        </div>
      </ContentContainer>
      <ContentContainer className='w-full' title='效果' extra={<ShowCode data={schema}><Button type='primary' disabled={formSchema.length === 0}>打印JSON</Button></ShowCode>}>
        <div className="">
          {
            formSchema &&
            <SimpleForm schema={schema} onSubmit={(val) => setFormResult(val)} showActions={!isEmpty(formSchema)} />
          }
        </div>
        {!isEmpty(formResult) && <ShowResult data={formResult} onCancel={() => setFormResult({})} />}
      </ContentContainer>
    </div>
  )
}

export default FormTool

const ShowResult = (props: any) => {

  return (
    <Modal
      visible={!isEmpty(props.data)}
      onCancel={() => props.onCancel && props.onCancel()}
      onOk={() => props.onCancel && props.onCancel()}
    >
      <pre>
        {JSON.stringify(props.data, null, 2)}
      </pre>
    </Modal>
  )
}
