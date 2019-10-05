import { IEnum } from 'components/SimpleTable'
import faker from 'faker'


export interface IMockDataSchema {
	key: string
	type: string
	enums?: IEnum[]
}


export const getMockData = (schemas: IMockDataSchema[], num: number = 200) => {
	return [ ...new Array(num) ].map((_, i) => {
		const types: { [key: string]: string | number } = {
			string: faker.random.word(),
			number: faker.random.number(8),
			picture: faker.random.word(),
		}

		const item: any = { id: i }
		schemas.forEach(schema => {
			if (schema.type === 'tags' && schema.enums) {
				const chooseIndex = faker.random.number(schema.enums.length - 1)
				item[schema.key] = schema.enums[chooseIndex].value
			} else if (schema.type === 'status') {
			} else {
				item[schema.key] = types[schema.type]
			}
		})

		return item
	})
}
