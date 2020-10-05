import axios from 'axios';

import {
  GraphQLObjectType,
  GraphQLList, 
  GraphQLSchema, GraphQLString
} from 'graphql';


const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: () => ({
    _id: {type: GraphQLString},
    ownerID: {type: GraphQLString},
    firstName: {type: GraphQLString},
    data: {type: new GraphQLList(GraphQLString)} // legendary
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    languages: {
      type: LanguageType,
      args: {
        ID: { type: GraphQLString }
      },
      resolve(_parent, args) {
        return axios.get(`/api/v2/mongo/languages/${args.ID}`, {
          headers: {Authorization: `Bearer ${process.env.TEMPORARY_ACCESS_TOKEN}`}
        }).then(res => res.data.payload);
      }
    }
  })
})


export default new GraphQLSchema({ query: RootQuery });