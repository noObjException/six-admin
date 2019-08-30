import React from 'react';
import DefaultLayout from 'layouts';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';


const client = new ApolloClient({
  uri: 'http://127.0.0.1:3003/graphql',
  cache: new InMemoryCache(),
})

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <DefaultLayout />
    </ApolloProvider>
  );
}

export default App;
