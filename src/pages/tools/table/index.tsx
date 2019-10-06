import React, { FC, useState } from 'react'
import useTableToolState, { TableToolContext } from './hook'
import FormConfig, { ITableForm } from './components/FormConfig'
import PreviewTable from './components/PreviewTable'


const TableTool: FC = () => {

	const contextValue = useTableToolState()
  const [ config, setConfig ] = useState<ITableForm>()

	return (
		<TableToolContext.Provider value={contextValue}>
			<div className='flex'>
				<FormConfig onPreview={(val) => setConfig(val)} />

				<PreviewTable schema={config} />
			</div>
		</TableToolContext.Provider>
	)
}

export default TableTool
