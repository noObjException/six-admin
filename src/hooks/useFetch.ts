import { useEffect, useState } from 'react'
import request from 'utils/request'

export function useFetch<T = any, Q = any>(url: string, query?: Q) {
	const [ data, setData ] = useState<T>()

	useEffect(() => {

		async function fetch() {
			const res = await request.get<T>(url, query)
			console.log(res)
			setData(res.data)
		}

		fetch()
	}, [ url, query ])

	return { data }
}
