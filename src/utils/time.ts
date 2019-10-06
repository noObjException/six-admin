import dayjs from 'dayjs'


export const now = (format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
	return dayjs().format(format)
}


export const formatTime = (date: Date|string, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
	return dayjs(date).format(format)
}
