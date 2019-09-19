import React, { FC, useContext, useState } from 'react'
import { Modal, Radio, Button } from 'antd'
import SchemaForm, {
	Field,
	createFormActions,
	FormSlot,
	FormProvider,
	FormConsumer,
	FormBlock,
} from '@uform/antd'
import { FormToolContext } from '../../index'
import ValidatorOption from './ValidatorOption'


const actions = createFormActions()


interface IProps {
	initialValues?: any,
	editIndex?: number | undefined,
	visible: boolean,
	onCancel?: () => void
}


const FormOption: FC<IProps> = (props) => {
	const { addField, updateField } = useContext(FormToolContext)
	const [ visibleOptions, setVisibleOptions ] = useState(false)
	const [ optionType, setOptionType ] = useState('url')
	const [ rules, setRules ] = useState([])

	const handleSubmit = (field: any) => {
		switch (field.type) {
			case 'select':

				break
			case 'radio':
			default:
				console.log('default', field)
		}

		field['x-rules'] = rules

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
					width={'48vw'}
					onCancel={() => props.onCancel && props.onCancel()}
					footer={<FormConsumer>{({ submit }) => (<Button type='primary' onClick={submit}>确定</Button>)}</FormConsumer>}
				>
					<SchemaForm
						className='overflow-scroll'
						style={{ maxHeight: '60vh' }}
						autoAddColon={false}
						actions={actions}
						labelCol={4}
						wrapperCol={20}
						initialValues={props.initialValues}
						effects={($) => {
							$('selectType', 'type')
								.subscribe(({ payload }) => {
									setVisibleOptions(['select', 'radio', 'checkbox'].includes(payload))
								})
						}}
						onSubmit={handleSubmit}
					>
						<Field
							type='string'
							required
							title='字段名'
							name='name'
						/>
						<Field
							type='string'
							required
							title='字段key'
							name='key'
						/>
						<Field
							type='boolean'
							required
							title='是否必填'
							name='required'
							default={true}
						/>
						<Field
							type='string'
							required
							title='类型'
							name='type'
							default='string'
							enum={[
								{ label: '输入框', value: 'string' },
								{ label: '密码框', value: 'password' },
								{ label: '数字输入框', value: 'number' },
								{ label: '下拉选择', value: 'select' },
								{ label: '开关', value: 'boolean' },
								{ label: '单选框', value: 'radio' },
								{ label: '多选框', value: 'checkbox' },
								{ label: '文本框', value: 'textarea' },
								{ label: '日期选择', value: 'date' },
								{ label: '日期范围', value: 'daterange' },
								{ label: '上传', value: 'upload' },
								{ label: '范围选择', value: 'range' },
								{ label: '穿梭框', value: 'transfer' },
								{ label: '等级', value: 'rating' },
								{ label: '时间', value: 'time' },
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
							visibleOptions && (
								<>
									<Field type='object' title='options'>
										<FormSlot name='name'>
											<Radio.Group
												defaultValue='url' buttonStyle='solid'
												onChange={({ target: { value } }) => setOptionType(value)}
											>
												<Radio.Button value='url'>url</Radio.Button>
												<Radio.Button value='enum'>enum</Radio.Button>
											</Radio.Group>
										</FormSlot>
									</Field>
									{
										optionType === 'url' && (
											<Field
												type='string'
												title='&nbsp;'
												name='url'
												description='请输入获取options的url'
											/>
										)
									}
									{
										optionType === 'enum' && (
											<Field
												title='&nbsp;'
												name='enum'
												type='array'
												x-component='table'
												x-props={{
													width: 100,
													operationsWidth: 1,
												}}
											>
												<Field type='object'>
													<Field name='label' type='string' title='label' />
													<Field name='value' type='string' title='value' />
												</Field>
											</Field>
										)
									}
								</>
							)
						}

						<FormBlock title='验证规则'>
							<ValidatorOption onChange={val => {
								setRules(val)
							}} />
							{/*<Field*/}
							{/*	name='validations'*/}
							{/*	type='checkbox'*/}
							{/*	enum={[*/}
							{/*		{ label: '必填', value: 'required' },*/}
							{/*		{ label: '最大值', value: 'max' },*/}
							{/*		{ label: '最小值', value: 'min' },*/}
							{/*	]}*/}
							{/*/>*/}
						</FormBlock>
					</SchemaForm>
				</Modal>
			</FormProvider>
		</>
	)
}

export default FormOption
