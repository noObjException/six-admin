import React, { FC, useState } from 'react'
import { Select, Tag, Button, Input } from 'antd'


interface IValidator {
	title: string,
	key?: string | number,
}


const rules = [
	{ label: '最大值', value: 'max' },
	{ label: '最小值', value: 'min' },
	{ label: '数字', value: 'number' },
	{ label: '整数', value: 'integer' },
	{ label: 'url', value: 'url' },
	{ label: 'email', value: 'email' },
	{ label: '手机号', value: 'phone' },
	{ label: '货币', value: 'money' },
	{ label: '中文', value: 'zh' },
	{ label: '日期格式', value: 'date' },
	{ label: 'ipv4地址', value: 'ipv4' },
	{ label: 'ipv6地址', value: 'ipv6' },
	{ label: '身份证', value: 'idcard' },
]


interface IProps {
	onChange?: (value: any) => void
}


const ValidatorOption: FC<IProps> = (props) => {
	const [ tags, setTags ] = useState<IValidator[]>([])
	const [ visible, setVisible ] = useState(false)
	const [ inputVisible, setInputVisible ] = useState(false)

	const addRule = () => {
		setVisible(true)
	}

	const handleChooseRule = ({ label, key }: any) => {
		setVisible(false)

		if ([ 'min', 'max' ].includes(key)) {
			setInputVisible(true)
		}

		const newTags = [ ...tags, { title: label, key } ]
		changeTags(newTags)
	}

	const handleClose = (val: string) => {
		const leftTags = tags.filter(tag => tag.title !== val)
		changeTags(leftTags)
	}

	const handleInput = (value: string | number) => {
		setInputVisible(false)
		const lastTag = tags[tags.length - 1]
		tags.splice(tags.length - 1, 1, { title: `${lastTag.title}: ${value}`, key: lastTag.key })
		changeTags(tags)
	}

	const changeTags = (value: any) => {
		setTags(value)
		props.onChange && props.onChange(value.map(({ key }: IValidator) => key))
	}

	return (
		<div>
			{
				tags.map(tag => (
					<Tag
						color='blue'
						key={tag.key}
						closable
						onClose={handleClose}
					>{tag.title}</Tag>
				))
			}

			{
				inputVisible && (
					<Input.Search
						className='w-40'
						placeholder='input search text'
						enterButton='确定'
						size='small'
						type='number'
						onSearch={handleInput}
					/>
				)
			}

			{
				visible && (
					<div>
						<Select
							showSearch
							style={{ width: 120 }}
							placeholder='Select a rule'
							optionFilterProp='children'
							filterOption={(input, option) =>
								// @ts-ignore
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							onSelect={handleChooseRule}
							labelInValue={true}
						>
							{rules.filter(rule => !tags.map(tag => tag.key).includes(rule.value)).map(rule => (
								<Select.Option value={rule.value} key={rule.value}>{rule.label}</Select.Option>
							))}
						</Select>
						&nbsp;
						<Button ghost type='primary' onClick={() => setVisible(false)}>取消</Button>
					</div>
				)
			}

			<div className='mt-2'>
				<Button onClick={addRule} icon='plus' type='primary' disabled={visible || inputVisible}>添加</Button>
			</div>
		</div>
	)
}

export default ValidatorOption
