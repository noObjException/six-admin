import React, { FC } from "react";
import ContentContainer from "components/ContentContainer";
import { Table } from "antd";
import { gql } from 'apollo-boost';
import { useQuery } from "@apollo/react-hooks";

const PRODUCT_CATEGORY_QUERY = gql`
  query Products($page: Int, $size: Int) {
    productCategories(page: $page, size: $size) {
      total
      items {
        id
        title
      }
    }
  }
`
const ProductCategory: FC = () => {

  const { loading, data: { productCategories = [] }, fetchMore } = useQuery<any>(PRODUCT_CATEGORY_QUERY, {
    variables: {
      page: 0,
      size: 10
    },
    // fetchPolicy: "cache-and-network"
  })

  const columns = [
    { title: '产品分类名', dataIndex: 'title', key: 'title' },
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

  return (
    <ContentContainer>
      <Table
        rowKey='id'
        dataSource={productCategories.items || []}
        columns={columns}
        loading={loading}
        pagination={{
          total: productCategories.total,
          showQuickJumper: true,
          onChange: handlePageChange,
        }}
      />
    </ContentContainer>
  )
}

export default ProductCategory
