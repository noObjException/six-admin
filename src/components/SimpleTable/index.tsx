import React, { FC, useMemo } from 'react'
import { Button, Table, Divider, Tag } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'


export interface ISimpleTable extends TableProps<any> {
	columns: Columns[],
	data: string | any[],
	showCheckbox?: boolean,
	showActions?: boolean,
}


interface Columns extends ColumnProps<any> {
	type?: 'string' | 'number' | 'picture' | 'tags',
	enum?: { label: string, value: any, color?: string }[],
}


const SimpleTable: FC<ISimpleTable> = (props) => {
	// add multiple selection
	const rowSelection = useMemo(() => {
		if (props.showCheckbox) {
			return {
				onChange: (selectedRowKeys: any, selectedRows: any) => {
					console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
				},
				getCheckboxProps: (record: { name: string; }) => ({
					disabled: record.name === 'Disabled User', // Column configuration not to be checked
					name: record.name,
				}),
			}
		}

		return undefined
	}, [ props.showCheckbox ])

	// parse columns
	const columns: Columns[] = useMemo(() => {
		let c = props.columns.map(column => {
			if (column.enum) {
				const enums: { [key: string]: any } = {}
				column.enum.forEach(({ label, value, color }) => {
					enums[value] = { label, color }
				})
				return {
					...column,
					render: (text: any) => (
						<Tag color={enums[text].color}>{enums[text].label}</Tag>
					),
				}
			}

			return column
		})

		// add actions button
		if (props.showActions) {
			c = [
				...c,
				{
					title: '操作',
					key: 'actions',
					render: () => (
						<>
							<Button size='small' type='link'>编辑</Button>
							<Divider type='vertical' />
							<Button size='small' type='link'>删除</Button>
						</>
					),
				},
			]
		}

		return c

	}, [ props.columns, props.showActions ])

	const dataSource = useMemo(() => {
		return Array.isArray(props.data) ? props.data : []
	}, [ props.data ])

	return (
		<div className='overflow-scroll bg-white p-2'>
			<Table
				rowSelection={rowSelection}
				rowKey={props.rowKey || 'id'}
				columns={columns}
				dataSource={dataSource}
			/>
		</div>
	)
}

export default SimpleTable
