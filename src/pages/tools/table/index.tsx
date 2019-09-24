import React, { createContext, FC, useReducer, useState } from 'react'
import ContentContainer from 'components/ContentContainer'
import { Button, Dropdown, Empty, Menu, message, Table, Tag } from 'antd'
import { isEmpty } from 'lodash'
import ShowCode from './components/ShowCode'
import TableOption from './components/TableOption'
import { now } from 'utils/time'
import { ColumnProps } from 'antd/lib/table'
import faker from 'faker'
// import SchemaForm, { Field } from '@uform/antd'
import SimpleTable from '../../../components/SimpleTable'


const HISTORY_KEY = 'schema_table_history'


export interface ITableField {
	title: string,
	key: string,
	dataIndex: string,
	type: string,
	enum?: { label: string, value: any, color: string }[]
}


export interface ITableToolState {
	fields: ITableField[]
}


export interface ITableToolReducer {
	addField(field: any): void,

	setField(field: any): void,

	updateField(index: number, field: any): void,

	delField(field: any): void,
}


const defaultFunc = (payload: any) => console.log(payload)
const initState: ITableToolState & ITableToolReducer = {
	fields: [],

	addField: defaultFunc,
	setField: defaultFunc,
	updateField: defaultFunc,
	delField: defaultFunc,
}

export const TableToolContext = createContext<ITableToolState & ITableToolReducer>(initState)

export const reducers = (state: ITableToolState, action: { type: string, payload: any }) => {
	console.log(action)
	switch (action.type) {
		case 'ADD_FIELD':
			return { ...state, fields: [ ...state.fields, action.payload ] }
		case 'SET_FIELD':
			return { ...state, fields: action.payload }
		case 'UPDATE_FIELD':
			state.fields.splice(action.payload.index, 1, action.payload.payload)
			return { ...state, fields: [ ...state.fields ] }
		case 'DEL_FIELD':
			state.fields.splice(action.payload, 1)
			return { ...state, fields: [ ...state.fields ] }
		default:
			return state
	}
}

const TableTool: FC = () => {
	const [ state, dispatch ] = useReducer(reducers, initState)
	const contextValue: ITableToolState & ITableToolReducer = {
		fields: state.fields,
		addField: (payload: ITableField) => dispatch({ type: 'ADD_FIELD', payload }),
		setField: (payload: ITableField) => dispatch({ type: 'SET_FIELD', payload }),
		updateField: (index: number, payload: ITableField) => dispatch({
			type: 'UPDATE_FIELD',
			payload: { index, payload },
		}),
		delField: (payload: number) => dispatch({ type: 'DEL_FIELD', payload }),
	}
	const { fields, setField, delField } = contextValue

	const [ columns, setColumns ] = useState<ColumnProps<ITableField>[]>([])

	const preview = () => {
		setColumns(fields.map(({ title, key, dataIndex }) => ({ title, key, dataIndex })))
		addHistory(fields)
	}

	const [ histories, setHistories ] = useState<any[]>(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'))
	// history
	const addHistory = (val: any) => {
		const histories: any[] = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').filter((i: { data: any[] }) => i.data.length > 0)
		if (histories.length >= 20) {
			histories.shift()
		}
		histories.unshift({ createdAt: now('YYYY-MM-DD HH:mm'), data: val })
		if (val) {
			setHistories(histories)
			localStorage.setItem(HISTORY_KEY, JSON.stringify(histories))
		}
	}
	const historyList = (
		<Menu onClick={({ key }: { key: any }) => backToHistory(histories[key].data)}>
			{histories.map((history, index) => (<Menu.Item key={index}>{history.createdAt}</Menu.Item>))}
		</Menu>
	)
	const backToHistory = (fields: any) => {
		setField(fields)
		message.success('加载成功')
	}

	const [ visible, setVisible ] = useState(false)
	const [ initialValues, setInitialValues ] = useState({})
	const [ editIndex, setEditIndex ] = useState<number | undefined>(undefined)
	const handleEdit = (index: number, record: any) => {
		setVisible(true)
		setInitialValues(record)
		setEditIndex(index)
	}

	return (
		<TableToolContext.Provider value={contextValue}>
			<div className='flex'>
				<ContentContainer
					className='w-full' title='添加表格'
					extra={<>
						<Button type='primary' onClick={preview} disabled={isEmpty(fields)}>查看效果</Button>&nbsp;
						<Dropdown overlay={historyList} placement='bottomLeft' disabled={histories.length === 0}>
							<Button>历史纪录</Button>
						</Dropdown>
					</>}
				>
					{/*<SchemaForm>*/}
					{/*	<Field*/}
					{/*		title='组件名'*/}
					{/*		name='componentName'*/}
					{/*		type='string'*/}
					{/*	/>*/}
					{/*	<Field*/}
					{/*		title='多选框'*/}
					{/*		name='multi'*/}
					{/*		type='boolean'*/}
					{/*	/>*/}
					{/*</SchemaForm>*/}
					{
						!fields.length ?
							<Empty
								image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
								imageStyle={{
									height: 200,
								}}
								description={false}
							>
								<Button type='primary' onClick={() => setVisible(true)} icon='plus'>字段</Button>
							</Empty>
							:
							<Button type='primary' className='mb-2' onClick={() => setVisible(true)} icon='plus'>字段</Button>
					}
					{
						fields.length > 0 && (
							<Table
								rowKey='key'
								dataSource={fields}
								columns={[
									{ title: 'title', key: 'title', dataIndex: 'title' },
									{ title: 'key', key: 'key', dataIndex: 'key' },
									{ title: 'type', key: 'type', dataIndex: 'type' },
									{
										title: 'actions',
										key: 'actions',
										render: (_, record, index) => (
											<>
												<Button
													type='default'
													size='small'
													icon='edit'
													shape='circle'
													onClick={() => handleEdit(index, record)}
												/>&nbsp;
												<Button
													type='default'
													size='small'
													icon='delete'
													shape='circle'
													onClick={() => delField(index)}
												/>
											</>
										),
									},
								]}
								pagination={false}
							/>
						)
					}
				</ContentContainer>

				<ContentContainer
					className='w-full' title='效果'
					extra={<ShowCode data={columns}><Button type='primary' disabled={isEmpty(columns)}>查看代码</Button></ShowCode>}
				>
					{
						!isEmpty(columns) && (
							<SimpleTable
								rowKey='id'
								columns={columns}
								dataSource={getMockData(fields.map(i => ({ key: i.key, type: i.type, enum: i.enum })))}
							/>
						)
					}
				</ContentContainer>
			</div>

			<TableOption
				visible={visible}
				onCancel={() => setVisible(false)}
				initialValues={initialValues}
				editIndex={editIndex}
			/>
		</TableToolContext.Provider>
	)
}

export default TableTool

const getMockData = (schemas: { key: string, type: string, enum?: { label: string, value: any, color?: string }[] }[]) => {
	return [ ...new Array(200) ].map((_, i) => {
		const types: { [key: string]: string | number } = {
			string: faker.random.word(),
			number: faker.random.number(8),
			picture: faker.random.word(),
		}
		const item: any = { id: i }
		schemas.forEach(schema => {
			if (schema.type === 'tags' && schema.enum) {
				const chooseIndex = faker.random.number(schema.enum.length - 1)
				item[schema.key] = <Tag color={schema.enum[chooseIndex].color}>{schema.enum[chooseIndex].label}</Tag>
			} else if (schema.type === 'status') {
			} else {
				item[schema.key] = types[schema.type]
			}
		})

		return item
	})
}
