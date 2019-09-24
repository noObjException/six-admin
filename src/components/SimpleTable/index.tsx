import React, { FC } from 'react'
import { Table } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'

interface ITableForm extends TableProps<any> {
	columns?: Columns[]
	data?: string | any[],
}

interface Columns extends ColumnProps<any> {
	type?: 'string' | 'number' | 'picture' | 'tags',
}

const SimpleTable: FC<ITableForm> = (props) => {

	return (
		<div className="overflow-scroll bg-white p-2">
			<Table
				rowKey={props.rowKey || 'id'}
				columns={props.columns}
				dataSource={props.dataSource}
			/>
		</div>
	)
}

export default SimpleTable
