import React, { FC, useContext, useState } from 'react'
import { Modal, Button } from 'antd'
import SchemaForm, {
	Field,
	createFormActions,
	FormProvider,
	FormConsumer,
} from '@uform/antd'
import { TableToolContext } from '../../../hook'
import { IColumn } from 'components/SimpleTable'


const actions = createFormActions()


interface IProps {
	initialValues?: any,
	editIndex?: number | undefined,
	visible: boolean,
	onCancel?: () => void,
}


const TableOption: FC<IProps> = (props) => {
	const { addField, updateField } = useContext(TableToolContext)
	const [ visibleOptions, setVisibleOptions ] = useState(false)

	const handleSubmit = (field: IColumn) => {
		field.dataIndex = field.key.toString()

		if (field.enums) {
			console.log(field)
		}
		console.log(field)

		if (props.editIndex !== undefined) {
			updateField(props.editIndex, field)
		} else {
			addField(field)
		}

		props.onCancel && props.onCancel()
		actions.reset()
	}

	return (
		<>
			<FormProvider>
				<Modal
					title='添加字段'
					visible={props.visible}
					width={'54vw'}
					onCancel={() => props.onCancel && props.onCancel()}
					footer={<>
						<Button onClick={props.onCancel}>取消</Button>
						<FormConsumer>
							{({ submit }) => (<Button type='primary' onClick={submit}>确定</Button>)}
						</FormConsumer>
					</>}
				>
					<SchemaForm
						className='overflow-scroll'
						style={{ maxHeight: '60vh' }}
						autoAddColon={false}
						actions={actions}
						labelCol={3}
						wrapperCol={21}
						initialValues={props.initialValues}
						onSubmit={handleSubmit}
						effects={($) => {
							$('selectType', 'type')
								.subscribe(({ payload }) => {
									setVisibleOptions([ 'tags' ].includes(payload))
								})
						}}
					>
						<Field type='string' required title='字段名' name='title' />
						<Field type='string' required title='字段key' name='key' />
						<Field
							type='string'
							required
							title='类型'
							name='type'
							default='string'
							enum={[
								{ label: '文字', value: 'string' },
								{ label: '数字', value: 'number' },
								{ label: '图片', value: 'picture' },
								{ label: '标签', value: 'tags' },
							]}
							x-effect={dispatch => {
								return {
									onChange(val: any) {
										dispatch('selectType', val)
									},
								}
							}}
						/>

						{
							visibleOptions &&
							<Field
									title='标签'
									name='enums'
									type='array'
									x-component='table'
									x-props={{
										width: 60,
										operationsWidth: 1,
									}}
							>
								<Field type='object'>
									<Field name='label' type='string' title='名称' />
									<Field name='value' type='string' title='值' />
									<Field
											name='color'
											type='string'
											title='颜色'
											enum={[
												{ label: 'magenta', value: 'magenta' },
												{ label: 'red', value: 'red' },
												{ label: 'volcano', value: 'volcano' },
												{ label: 'orange', value: 'orange' },
												{ label: 'gold', value: 'gold' },
											]}
									/>
								</Field>
							</Field>
						}
					</SchemaForm>
				</Modal>
			</FormProvider>
		</>
	)
}

export default TableOption
