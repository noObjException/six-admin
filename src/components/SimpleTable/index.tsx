import React, { FC, useMemo } from 'react'
import { Button, Table, Divider, Tag } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'


export interface ISimpleTable extends TableProps<any> {
	componentName?: string,
	columns: IColumns[],
	data: string | any[],
	showCheckbox?: boolean,
	showActions?: boolean,
}


export interface IEnum {
	label: string
	value: any
	color?: string
}


export interface IColumns extends ColumnProps<any> {
	type?: 'string' | 'number' | 'picture' | 'tags',
	enums?: IEnum[],
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
	const columns: IColumns[] = useMemo(() => {
		let c = props.columns.map(column => {
			if (column.enums) {
				const enums: { [key: string]: any } = { default: { label: 'un know', color: '#000' }}
				column.enums.forEach(({ label, value, color }) => {
					enums[value] = { label, color }
				})
				console.log('enums', enums)
				return {
					...column,
					render: (text: any) => (
						<Tag color={enums[text || 'default'].color || '#000'}>{enums[text].label || 'un know'}</Tag>
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
