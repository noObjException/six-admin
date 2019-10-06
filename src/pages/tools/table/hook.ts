import { createContext, useReducer } from 'react'

import { IColumn } from 'components/SimpleTable'

export interface ITableToolReducer {
	addField(field: IColumn): void,

	setFields(field: IColumn[]): void,

	updateField(index: number, field: IColumn): void,

	delField(index: number): void,
}


export interface ITableToolState {
	fields: IColumn[],
}

const defaultFunc = (payload: any) => console.log(payload)
export const initState: ITableToolState & ITableToolReducer = {
	fields: [],

	addField: defaultFunc,
	setFields: defaultFunc,
	updateField: defaultFunc,
	delField: defaultFunc,
}

export const TableToolContext = createContext<ITableToolState & ITableToolReducer>(initState)


export const tableReducers = (state: ITableToolState, action: { type: string, payload: any }) => {
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
export default function useTableToolState() {
	const [ state, dispatch ] = useReducer(tableReducers, initState)

	console.log('fields', state.fields)

	return {
		fields: state.fields,
		addField: (payload: IColumn) => dispatch({ type: 'ADD_FIELD', payload }),
		setFields: (payload: IColumn[]) => dispatch({ type: 'SET_FIELD', payload }),
		updateField: (index: number, payload: IColumn) => dispatch({
			type: 'UPDATE_FIELD',
			payload: { index, payload },
		}),
		delField: (index: number) => dispatch({ type: 'DEL_FIELD', payload: index }),
	} as ITableToolReducer & ITableToolState
}
