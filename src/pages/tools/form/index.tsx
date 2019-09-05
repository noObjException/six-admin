import React, { FC, useState, useEffect } from "react";
import ContentContainer from "components/ContentContainer";
import SimpleForm from "components/SimpleForm";
import { Button, Modal } from "antd";
import ShowCode from "pages/tools/form/components/ShowCode";
import { isEmpty } from "@uform/utils";

const FormTool: FC = () => {
  const [schema, setSchema] = useState({})

  const handleSubmit = (fields: any[]) => {
    const properties: any = {}

    fields && fields.forEach((field: any) => {
      switch (field.field_type) {
        case 'select':
          properties[field.field_key] = {
            title: field.field_name,
            type: 'string',
            enum: [
              { label: 'l', value: 'v' }
            ],
            required: true,
          }
          break
        case 'textarea':
          properties[field.field_key] = {
            title: field.field_name,
            type: 'string',
            'x-component': 'textarea',
            required: true,
          }
          break
        case 'upload':
          properties[field.field_key] = {
            title: field.field_name,
            type: field.field_type,
            'x-props': {
              listType: 'card',
            },
            required: true,
          }
          break
        default:
          properties[field.field_key] = {
            title: field.field_name,
            type: field.field_type,
            required: true,
          }
      }
    })

    const schema = {
      type: 'object',
      properties,
    }

    console.log(schema)

    setSchema(schema)
  }


  const [formResult, setFormResult] = useState({})

  // test async get data
  const [options, setOptions] = useState<any[]>([])
  useEffect(() => {
    setTimeout(() => setOptions([
      { label: '输入框', value: 'string' },
      { label: '密码框', value: 'password' },
      { label: '数字输入框', value: 'number' },
      { label: '下拉选择', value: 'select' },
      { label: '开关', value: 'boolean' },
      { label: '单选框', value: 'radio' },
      { label: '多选框', value: 'checkbox' },
      { label: '文本框', value: 'textarea' },
      { label: '日期选择', value: 'date' },
      { label: '日期范围', value: 'daterange' },
      { label: '上传', value: 'upload' },
      { label: '范围选择', value: 'range' },
      { label: '穿梭框', value: 'transfer' },
      { label: '等级', value: 'rating' },
      { label: '时间', value: 'time' },
    ]), 1200)
  }, [])

  const value = {
    fields: [
      { field_name: '输入框', field_key: 'string', field_type: 'string', },
      { field_name: '输入框', field_key: 'string2', field_type: 'string', }
    ]
  }

  return (
    <div className="flex">
      <ContentContainer className='w-full' title='添加表单'>

        <SimpleForm
          onSubmit={(val) => handleSubmit(val.fields)}
          value={value}
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

      </ContentContainer>
      <ContentContainer className='w-full' title='效果' extra={<ShowCode data={schema}><Button type='primary' disabled={isEmpty(schema)}>打印JSON</Button></ShowCode>}>
        {
          !isEmpty(schema) &&
          <SimpleForm schema={schema} onSubmit={(val) => setFormResult(val)} showActions={!isEmpty(schema)} />
        }
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
