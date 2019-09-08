import React, { FC, useContext, useState } from 'react'
import { Modal, Radio, Button } from 'antd'
import SchemaForm, {
	Field,
	createFormActions,
	FormSlot,
	FormProvider,
	FormConsumer,
} from '@uform/antd'
import { FormToolContext, } from '../../index'


const actions = createFormActions()

const FormOption: FC = (props) => {
  const { addField } = useContext(FormToolContext)
	const [ visible, setVisible ] = useState(false)
	const [ visibleOptions, setVisibleOptions ] = useState(false)
	const [ optionType, setOptionType ] = useState('url')

  const handleSubmit = (field: any) => {
    // const properties: any = {}
		// console.log(fields)
    // fields && fields.forEach((field: any) => {
    //   switch (field.field_type) {
    //     case 'select':
    //       properties[field.field_key] = {
    //         title: field.field_name,
    //         type: 'string',
    //         enum: [
    //           { label: 'l', value: 'v' },
    //         ],
    //         required: true,
    //       }
    //       break
    //     case 'textarea':
    //       properties[field.field_key] = {
    //         title: field.field_name,
    //         type: 'string',
    //         'x-component': 'textarea',
    //         required: true,
    //       }
    //       break
    //     case 'upload':
    //       properties[field.field_key] = {
    //         title: field.field_name,
    //         type: field.field_type,
    //         'x-props': {
    //           listType: 'card',
    //         },
    //         required: true,
    //       }
    //       break
    //     default:
    //       properties[field.field_key] = {
    //         title: field.field_name,
    //         type: field.field_type,
    //         required: true,
    //       }
    //   }
    // })
		//
    // const schema = {
    //   type: 'object',
    //   properties: {
    //     layout: {
    //       type: 'object',
    //       'x-props': {
    //         labelCol: 4,
    //         wrapperCol: 20,
    //       },
    //       'x-component': 'layout',
    //       properties,
    //     },
    //   },
    // }

    addField(field)
	  setVisible(false)
	  actions.reset()
  }

  return (
		<>
			<span onClick={() => setVisible(!visible)}>{props.children}</span>
			<FormProvider>
				<Modal
					title='添加字段'
					visible={visible}
					width={'60vw'}
					onCancel={() => setVisible(false)}
          footer={<FormConsumer>{({submit})=>(<Button type='primary' onClick={submit}>确定</Button>)}</FormConsumer>}
				>
					<SchemaForm
						className='overflow-scroll'
						style={{ maxHeight: '60vh' }}
						autoAddColon={false}
						actions={actions}
						labelCol={4}
						wrapperCol={20}
						effects={($) => {
							$('selectType', 'type')
								.subscribe(({ payload }) => {
									setVisibleOptions(payload === 'select')
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
							type='string'
							required
							title='类型'
							name='type'
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
									onChange(val: any, options: any) {
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
											/>
										)
									}
									{
										optionType === 'enum' && (
											<Field
												title='&nbsp;'
												name='array'
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
					</SchemaForm>
				</Modal>
			</FormProvider>
		</>
	)
}

export default FormOption
