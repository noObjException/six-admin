import React, { FC, useReducer, useState } from 'react'
import ContentContainer from 'components/ContentContainer'
import { Button, Dropdown, Empty, Menu, message, Table } from 'antd'
import { isEmpty } from 'lodash'
import ShowCode from './components/ShowCode'
import TableOption from './components/TableOption'
import faker from 'faker'
import SchemaForm, { Field, FormCard, FormConsumer, FormProvider, FormSlot } from '@uform/antd'
import SimpleTable, { IEnum, ISimpleTable } from 'components/SimpleTable'
import {
	initState,
	ITableField,
	ITableToolReducer,
	ITableToolState,
	tableReducers,
	TableToolContext,
} from 'components/SimpleTable/store'
import useHistory from 'hooks/useHistory'


export interface ITableForm {
	componentName: string,
	show?: Array<'checkbox' | 'actions'>,
	type?: 'graphql' | 'restful' | 'custom',
}


const TableTool: FC = () => {
	const [ state, dispatch ] = useReducer(tableReducers, initState)
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
	const { histories, addHistory } = useHistory()

	const [ tableConfig, setTableConfig ] = useState<ISimpleTable>({} as ISimpleTable)
	const preview = (tableProps: any) => {
		const record = {
			componentName: tableProps.componentName,
			showCheckbox: tableProps.show && tableProps.show.includes('checkbox'),
			showActions: tableProps.show && tableProps.show.includes('actions'),
			columns: fields.map(({ title, key, dataIndex, type, enums }) => ({ title, key, dataIndex, type, enums })),
			data: getMockData(fields.map(i => ({ key: i.key, type: i.type, enums: i.enums }))),
		}
		setTableConfig(record)
		addHistory(record)
	}

	const historyList = (
		<Menu onClick={({ key }: { key: any }) => backToHistory(histories[key].data)}>
			{histories.map((history, index) => (<Menu.Item key={index}>{`${history.createdAt} - ${history.data.componentName}`}</Menu.Item>))}
		</Menu>
	)

	const backToHistory = (tableConfig: ISimpleTable) => {
		setTableConfig(tableConfig)
		setField(tableConfig.columns)
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

	// restful url input
	const [ visibleUrl, setVisibleUrl ] = useState<boolean>(false)

	return (
		<TableToolContext.Provider value={contextValue}>
			<div className='flex'>
				<FormProvider>
					<ContentContainer
						className='w-full' title='添加表格'
						extra={<>
							<FormConsumer>
								{({ submit }) => (<Button type='primary' onClick={submit} disabled={isEmpty(fields)}>查看效果</Button>)}
							</FormConsumer>
							&nbsp;
							<Dropdown overlay={historyList} placement='bottomLeft' disabled={histories.length === 0}>
								<Button>历史纪录</Button>
							</Dropdown>
						</>}
					>
						<SchemaForm
							onSubmit={preview}
							labelCol={4}
							wrapperCol={20}
							autoAddColon={false}
							initialValues={tableConfig}
							effects={($) => {
								$('selectType', 'type')
									.subscribe(({ payload }) => {
										setVisibleUrl(payload.target.value === 'restful')
									})
							}}
						>
							<FormCard title='基本信息'>
								<Field
									title='组件名'
									name='componentName'
									type='string'
									required
								/>
								<Field
									title='是否显示'
									type='checkbox'
									name='show'
									default={[ 'checkbox', 'actions' ]}
									enum={[
										{ label: '多选框', value: 'checkbox' },
										{ label: '操作按钮', value: 'actions' },
									]}
								/>
								<Field
									title='数据源类型'
									type='radio'
									default='graphql'
									name='type'
									enum={[
										{ label: 'graphql', value: 'graphql' },
										{ label: 'restful', value: 'restful' },
										{ label: '自定义', value: 'custom' },
									]}
									x-effect={dispatch => {
										return {
											onChange(val: Event) {
												dispatch('selectType', val)
											},
										}
									}}
								/>
								{
									visibleUrl && (
										<Field
											title='&nbsp;'
											name='url'
											type='string'
											x-props={{ placeholder: 'restful请求地址, 例如: example' }}
											description='例如: example'
										/>
									)
								}

							</FormCard>
							<FormCard
								title='字段列表'
								extra={<>
									<Button icon='plus' className='mr-2' type='primary' onClick={() => setVisible(true)} />
									<Button icon='delete' onClick={() => setField([])} />
								</>}
							>
								<FormSlot name=''>
									{
										!fields.length &&
										<Empty
												image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
												imageStyle={{
													height: 200,
												}}
												description={false}
										>
											<Button type='primary' onClick={() => setVisible(true)} icon='plus'>字段</Button>
										</Empty>
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
								</FormSlot>
							</FormCard>
						</SchemaForm>

					</ContentContainer>
				</FormProvider>

				<ContentContainer
					className='w-full' title='效果'
					extra={<ShowCode data={{ componentName: tableConfig.componentName, columns: tableConfig.columns }}><Button
						type='primary' disabled={isEmpty(tableConfig.columns)}
					>查看代码</Button></ShowCode>}
				>
					{
						!isEmpty(tableConfig.columns) && (
							<SimpleTable
								rowKey='id'
								showActions={tableConfig.showActions}
								showCheckbox={tableConfig.showCheckbox}
								columns={tableConfig.columns}
								data={tableConfig.data}
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

// get mock data
const getMockData = (schemas: { key: string, type: string, enums?: IEnum[] }[]) => {
	return [ ...new Array(200) ].map((_, i) => {
		const types: { [key: string]: string | number } = {
			string: faker.random.word(),
			number: faker.random.number(8),
			picture: faker.random.word(),
		}
		const item: any = { id: i }
		schemas.forEach(schema => {
			if (schema.type === 'tags' && schema.enums) {
				const chooseIndex = faker.random.number(schema.enums.length - 1)
				item[schema.key] = schema.enums[chooseIndex].value
			} else if (schema.type === 'status') {
			} else {
				item[schema.key] = types[schema.type]
			}
		})

		return item
	})
}
