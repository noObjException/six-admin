import React, { createContext, FC, useReducer, useState } from 'react'
import ContentContainer from 'components/ContentContainer'
import FormOption from './components/FormOption'
import { Button, Empty, Table, Dropdown, Menu, message, Switch } from 'antd'
import { isEmpty } from 'lodash'
import SimpleForm from 'components/SimpleForm'
import ShowCode from './components/ShowCode'
import ShowSubmitResult from './components/ShowSubmitResult'
import { now } from 'utils/time'
import SchemaForm, { Field } from '@uform/antd'


const HISTORY_KEY = 'schema_history'

interface IFormField {
	name: string,
	key: string,
	type: string,
	description?: string,
	required?: boolean,
	enum?: {
		label: string,
		value: string,
	}[]
}
export interface IFormToolState {
	fields: IFormField[]
}


export interface IFormToolReducer {
	addField(field: any): void,

	setField(field: any): void,

	updateField(index: number, field: any): void,

	delField(field: any): void,
}


const defaultFunc = (payload: any) => console.log(payload)
const initState: IFormToolState & IFormToolReducer = {
	fields: [],

	addField: defaultFunc,
	setField: defaultFunc,
	updateField: defaultFunc,
	delField: defaultFunc,
}

export const FormToolContext = createContext<IFormToolState & IFormToolReducer>(initState)

export const reducers = (state: IFormToolState, action: { type: string, payload: any }) => {
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

const types: { [key: string]: string } = {
	string: '输入框',
	password: '密码框',
	number: '数字输入框',
	select: '下拉选择',
	boolean: '开关',
	radio: '多选框',
	checkbox: '多选框',
	textarea: '文本框',
	date: '日期选择',
	daterange: '日期范围',
	upload: '上传',
	range: '范围选择',
	transfer: '穿梭框',
	rating: '等级',
	time: '时间',
}

const FormTool: FC = () => {
	const [ state, dispatch ] = useReducer(reducers, initState)
	const contextValue: IFormToolState & IFormToolReducer = {
		fields: state.fields,
		addField: (payload: any) => dispatch({ type: 'ADD_FIELD', payload }),
		setField: (payload: any) => dispatch({ type: 'SET_FIELD', payload }),
		updateField: (index: number, payload: any) => dispatch({ type: 'UPDATE_FIELD', payload: { index, payload } }),
		delField: (payload: number) => dispatch({ type: 'DEL_FIELD', payload }),
	}
	const { fields, setField, delField } = contextValue

	const [ formResult, setFormResult ] = useState({})

	// 预览效果
	const [ schema, setSchema ] = useState({})
	const preview = () => {
		const properties: any = {}
		fields && fields.forEach((field: any) => {
			switch (field.type) {
				case 'select':
					properties[field.key] = {
						title: field.name,
						type: 'string',
						enum: field.enum,
						required: field.required,
					}
					break
				case 'radio':
					properties[field.key] = {
						title: field.name,
						type: 'radio',
						enum: field.enum,
						required: field.required,
					}
					break
				case 'checkbox':
					properties[field.key] = {
						title: field.name,
						type: 'checkbox',
						enum: field.enum,
						required: field.required,
					}
					break
				case 'transfer':
					properties[field.key] = {
						title: field.name,
						type: 'transfer',
						enum: field.enum,
						required: field.required,
					}
					break
				case 'textarea':
					properties[field.key] = {
						title: field.name,
						type: 'string',
						'x-component': 'textarea',
						required: field.required,
					}
					break
				case 'upload':
					properties[field.key] = {
						title: field.name,
						type: field.type,
						'x-props': {
							listType: 'card',
						},
						required: field.required,
					}
					break
				default:
					properties[field.key] = {
						title: field.name,
						type: field.type,
						required: field.required,
						'x-rules': field['x-rules'],
					}
			}
		})

		const schema = {
			type: 'object',
			properties: {
				layout: {
					type: 'object',
					'x-props': {
						labelCol: 4,
						wrapperCol: 20,
					},
					'x-component': 'layout',
					properties,
				},
			},
		}
		console.log('schema', schema)
		setSchema(schema)

		addHistory(fields)
	}


	const [ visible, setVisible ] = useState(false)
	const [ initialValues, setInitialValues ] = useState({})
	const [ editIndex, setEditIndex ] = useState<number | undefined>(undefined)

	const handleEdit = (index: number, record: any) => {
		setVisible(true)
		setInitialValues(record)
		setEditIndex(index)
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
		</Menu>)
	const backToHistory = (fields: any) => {
		setField(fields)
		message.success('加载成功')
	}

	return (
		<FormToolContext.Provider value={contextValue}>
			<div className='flex'>
				<ContentContainer
					className='w-full' title='添加表单'
					extra={<>
						<Button type='primary' onClick={preview} disabled={isEmpty(fields)}>查看效果</Button>&nbsp;
						<Dropdown overlay={historyList} placement='bottomLeft' disabled={histories.length === 0}>
							<Button>历史纪录</Button>
						</Dropdown>
					</>}
				>
					<SchemaForm>
						<Field
							title='组件名'
							name='componentName'
							type='string'
						/>
						<Field
							title='布局'
							name='layout'
							type='string'
							enum={[
								{ label: '内联', value: 'inline' },
								{ label: '垂直', value: 'ver' }
							]}
						/>
					</SchemaForm>
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
									{ title: 'name', key: 'name', dataIndex: 'name' },
									{ title: 'key', key: 'key', dataIndex: 'key' },
									{ title: 'type', key: 'type', dataIndex: 'type', render: (text) => types[text] || '未知' },
									{
										title: '必填',
										key: 'required',
										dataIndex: 'required',
										render: (checked) => <Switch checked={checked} checkedChildren="是" unCheckedChildren="否" />,
									},
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
					extra={<ShowCode data={schema}><Button type='primary' disabled={isEmpty(schema)}>查看代码</Button></ShowCode>}
				>
					{
						!isEmpty(schema) &&
						<SimpleForm schema={schema} showActions={!isEmpty(schema)} onSubmit={val => setFormResult(val)} />
					}
					{!isEmpty(formResult) && <ShowSubmitResult data={formResult} onCancel={() => setFormResult({})} />}
				</ContentContainer>
			</div>

			<FormOption
				visible={visible}
				onCancel={() => setVisible(false)}
				initialValues={initialValues}
				editIndex={editIndex}
			/>
		</FormToolContext.Provider>
	)
}

export default FormTool
