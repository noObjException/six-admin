import React, { FC, useState } from 'react'
import useTableToolState, { TableToolContext } from './hook'
import TableConfigForm, { ITableForm } from './components/TableConfigForm'
import PreviewTable from './components/PreviewTable'


const TableTool: FC = () => {
	const contextValue = useTableToolState()
  const [ config, setConfig ] = useState<ITableForm>()

	return (
		<TableToolContext.Provider value={contextValue}>
			<div className='flex'>
				<TableConfigForm onPreview={(val) => setConfig(val)} />

				<PreviewTable schema={config} />
			</div>
		</TableToolContext.Provider>
	)
}

export default TableTool
