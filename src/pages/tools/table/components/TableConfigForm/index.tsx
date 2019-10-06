import React, { FC, useContext, useState } from 'react'
import ContentContainer from 'components/ContentContainer'
import SchemaForm, { FormConsumer, FormProvider, FormSlot } from '@uform/react'
import { Button, Dropdown, Empty, Icon, Menu, message, Table } from 'antd'
import { Field, FormCard } from '@uform/antd'
import { TableToolContext } from '../../hook'
import useHistory from 'hooks/useHistory'
import { IColumn } from 'components/SimpleTable'
import TableFieldForm from './TableFieldForm'
import { isEmpty } from 'lodash'


export interface ITableForm {
	componentName: string,
	columns: IColumn[],
	show?: Array<'checkbox' | 'actions'>,
	type?: 'graphql' | 'restful' | 'custom',
}


interface IProps {
	onPreview?: (val: any) => void
}


const TableConfigForm: FC<IProps> = (props) => {
	const { fields, setFields, delField } = useContext(TableToolContext)
	const { histories, addHistory } = useHistory()

	const [ tableConfig, setTableConfig ] = useState<ITableForm>({} as ITableForm)
	const preview = (tableProps: ITableForm) => {
		const record: ITableForm = {
			...tableProps,
			columns: fields.map(({ title, key, dataIndex, type, enums }): IColumn => ({
				title,
				key,
				dataIndex,
				type,
				enums,
			})),
		}
		setTableConfig(record)
		addHistory(record)

		props.onPreview && props.onPreview(record)
	}

	const historyList = (
		<Menu onClick={({ key }: { key: any }) => backToHistory(histories[key].data)}>
			{histories.map((history, index) => (
				<Menu.Item key={index}>{`${history.createdAt} - ${history.data.componentName}`}</Menu.Item>))}
		</Menu>
	)

	const backToHistory = (tableConfig: ITableForm) => {
		setTableConfig(tableConfig)
		setFields(tableConfig.columns)
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

	// 填充模板
	const temps: { title: string, columns: IColumn[] }[] = [
		{
			title: 'id模板',
			columns: [
				{ title: 'id', key: 'id', dataIndex: 'id', type: 'string' },
				{ title: '创建时间', key: 'createdAt', dataIndex: 'createdAt', type: 'string' },
				{ title: '修改时间', key: 'updatedAt', dataIndex: 'updatedAt', type: 'string' },
			],
		},
		{
			title: 'id-title模板',
			columns: [
				{ title: 'id', key: 'id', dataIndex: 'id', type: 'string' },
				{ title: '标题', key: 'title', dataIndex: 'title', type: 'string' },
				{ title: '创建时间', key: 'createdAt', dataIndex: 'createdAt', type: 'string' },
				{ title: '修改时间', key: 'updatedAt', dataIndex: 'updatedAt', type: 'string' },
			],
		},
	]
	const tempList = (
		<Menu onClick={({ key }: { key: any }) => setFields(temps[key].columns)}>
			{temps.map((i, k) => (
				<Menu.Item key={k}>{i.title}</Menu.Item>
			))}
		</Menu>
	)

	return (
		<>
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
						effects={($: any) => {
							$('selectType', 'type')
								.subscribe(({ payload }: any) => {
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
								x-effect={dispatch => ({
									onChange(val: Event) {
										dispatch('selectType', val)
									},
								})}
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
								<Button icon='delete' onClick={() => setFields([])} />
							</>}
						>
							<FormSlot name=''>
								{
									!fields.length &&
									(
										<Empty
											image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
											imageStyle={{
												height: 200,
											}}
											description={false}
										>
											<Dropdown.Button
												overlay={tempList}
												type='primary'
												onClick={() => setVisible(true)}
											>
												<Icon type='plus' />字段
											</Dropdown.Button>
										</Empty>
									)
								}
								{/*{JSON.stringify(fields)}*/}
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

			<TableFieldForm
				visible={visible}
				onCancel={() => setVisible(false)}
				initialValues={initialValues}
				editIndex={editIndex}
			/>
		</>
	)
}

export default TableConfigForm
