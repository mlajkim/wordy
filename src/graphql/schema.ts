import {
  GraphQLObjectType, 
  GraphQLSchema
} from 'graphql';

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    // none yet
  })
})

export default new GraphQLSchema({
  query: RootQuery
});