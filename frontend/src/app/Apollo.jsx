"use client";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from "@apollo/client";


export default function Apollo({children}){
    const httpLink = createHttpLink({
        uri: 'http://localhost:8000/',
    });
    const client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache(),
    });
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}