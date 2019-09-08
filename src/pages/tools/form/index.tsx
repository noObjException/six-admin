import React, { createContext, FC, useReducer, useState } from 'react'
import ContentContainer from 'components/ContentContainer'
import FormOption from './components/FormOption'
import { Button, Empty, Table } from 'antd'
import { isEmpty } from 'lodash'
import SimpleForm from 'components/SimpleForm'


export interface IFormToolState {
	fields: any[]
}


export interface IFormToolReducer {
	addField(field: any): void,
	delField(field: any): void,
}


const defaultFunc = (payload: any) => console.log(payload)
const initState: IFormToolState & IFormToolReducer = {
	fields: [],

	addField: defaultFunc,
	delField: defaultFunc,
}

export const FormToolContext = createContext<IFormToolState & IFormToolReducer>(initState)

export const reducers = (state: IFormToolState, action: { type: string, payload: any }) => {
	switch (action.type) {
		case 'ADD_FIELD':
			return { ...state, fields: [ ...state.fields, action.payload ] }
		case 'DEL_FIELD':
			const fields = [...state.fields]
			fields.splice(action.payload, 1)
			return { ...state, fields }
		default:
			return state
	}
}
const FormTool: FC = () => {
	const [ state, dispatch ] = useReducer(reducers, initState)
	const contextValue: IFormToolState & IFormToolReducer = {
		fields: state.fields,
		addField: (payload: any) => dispatch({ type: 'ADD_FIELD', payload }),
		delField: (payload: number) => dispatch({ type: 'DEL_FIELD', payload }),
	}
	const { fields, delField } = contextValue

	// const [ formResult, setFormResult ] = useState({})

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
		        required: true,
		      }
		      break
		    case 'textarea':
		      properties[field.key] = {
		        title: field.name,
		        type: 'string',
		        'x-component': 'textarea',
		        required: true,
		      }
		      break
		    case 'upload':
		      properties[field.key] = {
		        title: field.name,
		        type: field.type,
		        'x-props': {
		          listType: 'card',
		        },
		        required: true,
		      }
		      break
		    default:
		      properties[field.key] = {
		        title: field.name,
		        type: field.type,
		        required: true,
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
	}

	const handleDelete = (index: number) => {
		delField(index)
	}

	return (
		<FormToolContext.Provider value={contextValue}>
			<div className='flex'>
				<ContentContainer
					className='w-full' title='添加表单' extra={<><Button type='primary' onClick={preview} disabled={isEmpty(fields)}>查看效果</Button></>}
				>
					<FormOption>
						{
							!fields.length ?
								<Empty
									image='https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original'
									imageStyle={{
										height: 200,
									}}
									description={false}
								>
									<Button type='primary'>Create Now</Button>
								</Empty>
								:
								<Button type='primary' className='mb-2'>Create Now</Button>
						}
					</FormOption>
					{
						fields.length > 0 &&
            <Table
                rowKey='key'
                dataSource={fields}
                columns={[
									{ title: 'name', key: 'name', dataIndex: 'name' },
									{ title: 'key', key: 'key', dataIndex: 'key' },
									{ title: 'type', key: 'type', dataIndex: 'type' },
									{ title: '必填', key: 'required', dataIndex: 'required' },
									{
										title: 'actions',
										key: 'actions',
										render: (_, record, index) => (
											<>
												<Button type='default' size='small' icon='edit' shape='circle' />&nbsp;
												<Button type='default' size='small' icon='delete' shape='circle' onClick={() => handleDelete(index)}/>
											</>
										),
									},
								]}
                pagination={false}
            />
					}

				</ContentContainer>
				<ContentContainer
					className='w-full' title='效果'
					// extra={<ShowCode data={schema}><Button type='primary' disabled={isEmpty(schema)}>打印JSON</Button></ShowCode>}
				>
					{
						!isEmpty(schema) &&
            <SimpleForm schema={schema} showActions={!isEmpty(schema)} />
					}
					{/*{!isEmpty(formResult) && <ShowSubmitResult data={formResult} onCancel={() => setFormResult({})} />}*/}
				</ContentContainer>
			</div>
		</FormToolContext.Provider>
	)
}

export default FormTool


