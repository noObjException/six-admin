import { ITableForm } from '../../TableConfigForm'



// tsx temp
export const getTsxTemp = (props: ITableForm): string => {
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
      showActions={${(props.show || false) && props.show.includes('actions')}}
      showCheckbox={${(props.show || false) && props.show.includes('checkbox')}}
    />
  )
} 

export default ${props.componentName || 'TableName'}`
}

// jsx temp
export const getJsxTemp = (props: ITableForm): string => (
	`import React from 'react'
import SimpleTable from 'components/SimpleTable'

const ${props.componentName || 'TableName'} = () => {

  const columns = ${JSON.stringify(props.columns, null, 2)}
  const data = []

  return (
    <SimpleTable 
      columns={columns}
      data={data}
      showActions={${(props.show || false) && props.show.includes('actions')}}
      showCheckbox={${(props.show || false) && props.show.includes('checkbox')}}
    />
  )
} 

export default ${props.componentName || 'TableName'}`
)
