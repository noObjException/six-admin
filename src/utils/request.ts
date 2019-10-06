import fly, { FlyRequestConfig, FlyResponse } from 'flyio'

fly.config.timeout = 5000

fly.interceptors.request.use((request: FlyRequestConfig) => {

	return request
})

fly.interceptors.response.use((response: FlyResponse) => {

	return response
}, err => {
	console.log(err)
})

export default fly
