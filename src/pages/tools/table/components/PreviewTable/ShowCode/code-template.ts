import { IColumn } from 'components/SimpleTable'


export interface ITableTemp {
	componentName?: string,
	columns: IColumn[],
}


// tsx temp
export const getTsxTemp = (props: ITableTemp): string => {
	const types = {
		string: 'string',
		number: 'number',
		picture: 'string',
		tags: 'IEnum[]',
		default: 'string'
	}

	let interfaceContent = ''
	props.columns.forEach((column, index) => interfaceContent += `  ${column.key}: ${types[column.type || 'default']}, ${index === props.columns.length - 1 ? '' : '\n'}`)

	return `import React, { FC } from 'react'
import SimpleTable, { IEnum } from 'components/SimpleTable'

interface I${props.componentName || 'Data'} {
${interfaceContent}
}

const ${props.componentName || 'TableName'}: FC = () => {

  const columns = ${JSON.stringify(props.columns, null, 2)}
  
  const data: I${props.componentName || 'Data'}[] = []

  return (
    <SimpleTable 
      columns={columns}
      data={data}
    />
  )
} 

export default ${props.componentName || 'TableName'}`
}

// jsx temp
export const getJsxTemp = (props: ITableTemp): string => (
	`import React from 'react'
import SimpleTable from 'components/SimpleTable'

const ${props.componentName || 'TableName'} = () => {

  const columns = ${JSON.stringify(props.columns, null, 2)}
  const data = []

  return (
    <SimpleTable 
      columns='{columns}' 
      dataSoure='{data}'
    />
  )
} 

export default ${props.componentName || 'TableName'}`
)
