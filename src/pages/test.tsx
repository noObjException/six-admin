import React, { FC } from 'react'
import SimpleForm from 'components/SimpleForm'

const TForm: FC = () => {

  const schema = {
  "type": "object",
  "properties": {
    "string": {
      "title": "输入框",
      "type": "string",
      "required": true
    },
    "string2": {
      "title": "输入框",
      "type": "string",
      "required": true
    }
  }
}

  return (
    <SimpleForm schema={schema} />
  )
} 

export default TForm
