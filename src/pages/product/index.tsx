import React, { FC, useState } from "react";
import ContentContainer from "components/ContentContainer";
import { Table, Modal } from "antd";
import { gql } from 'apollo-boost';
import { useQuery } from "@apollo/react-hooks";
import SimpleForm from "components/SimpleForm";

const PRODUCT_QUERY = gql`
  query Products($page: Int, $size: Int) {
    products(page: $page, size: $size) {
      total
      items {
        id
        title
        price
      }
    }
  }
`
const Product: FC = () => {

  const { loading, data: { products = [] }, fetchMore } = useQuery<any>(PRODUCT_QUERY, {
    variables: {
      page: 0,
      size: 10
    },
    // fetchPolicy: "cache-and-network"
  })

  const columns = [
    { title: '产品名', dataIndex: 'title', key: 'title' },
    { title: '价格', dataIndex: 'price', key: 'price' },
  ];

  const handlePageChange = (page: number, pageSize: number | undefined) => {
    fetchMore({
      variables: {
        page: page - 1,
        size: pageSize,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return fetchMoreResult
      }
    })
  }

  const [visible, setVisible] = useState(true)

  return (
    <ContentContainer>
      <Table
        rowKey='id'
        dataSource={products.items || []}
        columns={columns}
        loading={loading}
        pagination={{
          total: products.total,
          showQuickJumper: true,
          onChange: handlePageChange,
        }}
      />
      <Modal visible={visible} onCancel={() => setVisible(false)}>
        <SimpleForm schema={{}}/>
      </Modal>
    </ContentContainer>
  )
}

export default Product
