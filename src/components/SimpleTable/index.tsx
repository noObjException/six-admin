import React, { FC, useMemo } from 'react'
import { Button, Table, Divider, Tag } from 'antd'
import { ColumnProps, TableProps } from 'antd/lib/table'


export interface ISimpleTable extends TableProps<any> {
	componentName?: string,
	columns: IColumn[],
	data: string | any[],
	showCheckbox?: boolean,
	showActions?: boolean,
}


export interface IEnum {
	label: string,
	value: any,
	color?: string,
}


export type ITableFieldType = 'string' | 'number' | 'image' | 'tags'


export interface IColumn extends ColumnProps<any> {
	title: string,
	key: string | number,
	type?: ITableFieldType,
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
	const columns: IColumn[] = useMemo(() => {
		let c = props.columns.map(column => {
			if (column.enums) {
				const enums: { [key: string]: any } = { default: { label: 'un know', color: '#000' } }
				column.enums.forEach(({ label, value, color }) => {
					enums[value] = { label, color }
				})
				return {
					...column,
					render: (text: any) => (
						<Tag color={enums[text || 'default'].color || '#000'}>{enums[text].label || 'un know'}</Tag>
					),
				}
			}

			if (column.type === 'image') {
				return {
					...column,
					render: (text: any) => (
						<img src={text} alt='' className='w-12 h-12' />
					)
				}
			}

			return column
		})

		// add actions button
		if (props.showActions) {
			c.push({
				title: '操作',
				key: 'actions',
				render: () => (
					<>
						<Button size='small' type='link'>编辑</Button>
						<Divider type='vertical' />
						<Button size='small' type='link'>删除</Button>
					</>
				),
			})
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
