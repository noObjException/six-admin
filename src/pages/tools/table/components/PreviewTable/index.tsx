import React, { FC } from 'react'
import ShowCode from './ShowCode'
import { Button } from 'antd'
import SimpleTable, { IColumn } from 'components/SimpleTable'
import { getMockData, IMockDataSchema } from 'utils/mock'
import ContentContainer from 'components/ContentContainer'
import { isEmpty } from 'lodash'
import { ITableForm } from '../TableConfigForm'


interface IProps {
	schema?: ITableForm
}


const PreviewTable: FC<IProps> = (props) => {
	const schema = props.schema || {} as ITableForm

	const showActions = schema.show && schema.show.includes('actions')
	const showCheckbox = schema.show && schema.show.includes('checkbox')
	const columns = schema.columns || []
	const mockData = getMockData(columns.map(({ key, type, enums }: IColumn): IMockDataSchema => ({
		key,
		type,
		enums,
	})))

	return (
		<ContentContainer
			className='w-full' title='效果'
			extra={
				<ShowCode data={schema}>
					<Button type='primary' disabled={isEmpty(columns)}>查看代码</Button>
				</ShowCode>
			}
		>
			{
				!isEmpty(columns) && (
					<SimpleTable
						rowKey='id'
						showActions={showActions}
						showCheckbox={showCheckbox}
						columns={columns}
						data={mockData}
					/>
				)
			}
		</ContentContainer>
	)
}

export default PreviewTable
