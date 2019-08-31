import React, { FC, useState } from "react";
import ContentContainer from "components/ContentContainer";
import SimpleForm from "components/SimpleForm";
import { Button, Modal } from "antd";
import ShowCode from "pages/tools/form/components/ShowCode";

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

  return (
    <div className="flex">
      <ContentContainer className='w-full' title='添加字段' extra={<><Button type='primary'>保存</Button>&nbsp;<Button>重置</Button></>}>
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
                                "title": "字段名"
                              },
                              "field_key": {
                                "type": "string",
                                "title": "字段key"
                              },
                              "field_type": {
                                "type": "string",
                                "title": "类型",
                                "enum": [
                                  { label: 'string', value: 'string' },
                                  { label: 'number', value: 'number' },
                                ]
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
            <SimpleForm schema={schema} showActions={false} />
          }
        </div>
      </ContentContainer>
    </div>
  )
}

export default FormTool
