import { useState } from 'react'
import { now } from 'utils/time'
import { isEmpty } from 'lodash'


const HISTORY_KEY = 'schema_table_history'

export default function useHistory<T = any>(data: string = '[]') {
	const [ histories, setHistories ] = useState<T[]>(JSON.parse(localStorage.getItem(HISTORY_KEY) || data).filter((i: { data: any }) => !isEmpty(i.data)))
	// history
	const addHistory = (val: any) => {
		if (!val) {
			return
		}

		const histories: any[] = [
			{ createdAt: now('YYYY-MM-DD HH:mm'), data: val },
			...JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').filter((i: { data: any }) => !isEmpty(i.data)).slice(0, 19),
		]

		setHistories(histories)
		localStorage.setItem(HISTORY_KEY, JSON.stringify(histories))
	}

	return { histories, addHistory }
}

