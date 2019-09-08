import React, { createContext, FC, useReducer } from 'react'
import ContentContainer from 'components/ContentContainer'
import FormOption from './components/FormOption'
import { Button, Empty, Table } from 'antd'


export interface IFormToolState {
	fields: any[]
}


export interface IFormToolReducer {
	addField(field: any): void
}


const defaultFunc = (payload: any) => console.log(payload)
const initState: IFormToolState & IFormToolReducer = {
	fields: [],

	addField: defaultFunc,
}

export const FormToolContext = createContext<IFormToolState & IFormToolReducer>(initState)

export const reducers = (state: IFormToolState, action: { type: string, payload: any }) => {
	switch (action.type) {
		case 'ADD_FIELD':
			console.log({ ...state, fields: [ ...state.fields, action.payload ] })
			return { ...state, fields: [ ...state.fields, action.payload ] }
		case 'DEL_FIELD':
			return { ...state, fields: [ ...state.fields, action.payload ] }
		default:
			return state
	}
}
const FormTool: FC = () => {
	const [ state, dispatch ] = useReducer(reducers, initState)
	const contextValue: IFormToolState & IFormToolReducer = {
		fields: state.fields,
		addField: (payload: any) => dispatch({ type: 'ADD_FIELD', payload }),
	}
	// const [ formResult, setFormResult ] = useState({})

	const { fields } = contextValue

	return (
		<FormToolContext.Provider value={contextValue}>
			<div className='flex'>
				<ContentContainer className='w-full' title='添加表单'>
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
								<Button type='primary'>Create Now</Button>
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
									{
										title: 'actions',
										key: 'actions',
										render: () => (
											<>
												<Button type='default' size='small' icon='edit' shape='circle' />&nbsp;
												<Button type='default' size='small' icon='delete' shape='circle' />
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
					{/*{*/}
					{/*	!isEmpty(schema) &&*/}
					{/*  <SimpleForm schema={schema} onSubmit={(val) => setFormResult(val)} showActions={!isEmpty(schema)} />*/}
					{/*}*/}
					{/*{!isEmpty(formResult) && <ShowSubmitResult data={formResult} onCancel={() => setFormResult({})} />}*/}
				</ContentContainer>
			</div>
		</FormToolContext.Provider>
	)
}

export default FormTool


