import dayjs from 'dayjs'


export const now = (format: string = 'YYYY-MM-DD HH:mm:ss') => {
	return dayjs().format(format)
}
