import { createContext, useReducer } from 'react'

import { IColumn } from 'components/SimpleTable'

export interface ITableToolReducer {
	addField(field: any): void,

	setField(field: any): void,

	updateField(index: number, field: any): void,

	delField(field: any): void,
}


const defaultFunc = (payload: any) => console.log(payload)
export const initState: ITableToolState & ITableToolReducer = {
	fields: [],

	addField: defaultFunc,
	setField: defaultFunc,
	updateField: defaultFunc,
	delField: defaultFunc,
}

export const TableToolContext = createContext<ITableToolState & ITableToolReducer>(initState)



export interface ITableToolState {
	fields: IColumn[],
}


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
	return {
		fields: state.fields,
		addField: (payload: IColumn) => dispatch({ type: 'ADD_FIELD', payload }),
		setField: (payload: IColumn) => dispatch({ type: 'SET_FIELD', payload }),
		updateField: (index: number, payload: IColumn) => dispatch({
			type: 'UPDATE_FIELD',
			payload: { index, payload },
		}),
		delField: (payload: number) => dispatch({ type: 'DEL_FIELD', payload }),
	} as ITableToolReducer & ITableToolState
}
