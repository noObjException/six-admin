import { IEnum, ITableFieldType } from 'components/SimpleTable'
import faker from 'faker'


export interface IMockDataSchema {
	key: string | number,
	type?: ITableFieldType,
	enums?: IEnum[],
}


const types: { [key: string]: string | number } = {
	string: faker.random.word(),
	number: faker.random.number(8),
	picture: faker.random.word(),
}

export const getMockData = (schemas: IMockDataSchema[], num: number = 200) => {
	return [ ...new Array(num) ].map((_, i) => {
		const item: any = { id: i }

		schemas.forEach(schema => {
			if (schema.type === 'tags' && schema.enums) {
				const chooseIndex = faker.random.number(schema.enums.length - 1)
				item[schema.key] = schema.enums[chooseIndex].value
			} else {
				item[schema.key] = types[schema.type || 'string']
			}
		})

		return item
	})
}
