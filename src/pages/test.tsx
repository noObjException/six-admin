import React, { FC } from 'react'
import SimpleTable from 'components/SimpleTable'

interface Iasd {
  fds: string
  dad: string
  das: string
  ad3232: string

}

const asd: FC = () => {

  const columns = [
    {
      "title": "sd",
      "key": "fds",
      "dataIndex": "fds"
    },
    {
      "title": "sda",
      "key": "dad",
      "dataIndex": "dad"
    },
    {
      "title": "dasd",
      "key": "das",
      "dataIndex": "das"
    },
    {
      "title": "sada",
      "key": "ad3232",
      "dataIndex": "ad3232"
    }
  ]

  const data: any = []

  return (
    <SimpleTable
      columns={columns}
      data={data}
    />
  )
}

export default asd
