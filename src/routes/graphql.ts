import axios from 'axios';

import {
  GraphQLObjectType,
  GraphQLList, 
  GraphQLSchema, GraphQLString, GraphQLInt, GraphQLBoolean
} from 'graphql';

const WordType = new GraphQLObjectType({
  name: 'Word',
  fields: () => ({
    _id: {type: GraphQLString},
    ownerID: {type: GraphQLString},
    dateAdded: {type: GraphQLString},
    year: {type: GraphQLInt},
    semester: {type: GraphQLInt},
    language: {type: GraphQLString},
    tag: {type: GraphQLString},
    word:{type: GraphQLString},
    pronun:{type: GraphQLString},
    define:{type: GraphQLString},
    example:{type: GraphQLString},
    isPublic:{type: GraphQLBoolean}
  })
})

const LanguageType = new GraphQLObjectType({
  name: 'Language',
  fields: () => ({
    _id: {type: GraphQLString},
    ownerID: {type: GraphQLString},
    firstName: {type: GraphQLString},
    data: {type: new GraphQLList(GraphQLString)} // legendary
  })
})

const YearType = new GraphQLObjectType({
  name: 'Year',
  fields: () => ({
    _id: {type: GraphQLString},
    ownerID: {type: GraphQLString},
    year: {type: GraphQLString},
    sem: {type: GraphQLString}
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    years: {
      type: new GraphQLList(YearType), 
      args: { ID: { type: GraphQLString }, accessToken: { type: GraphQLString}},
      resolve(_parent, args) {
        return axios.get(`/api/v2/mongo/years/all/${args.ID}`, {
          headers: {Authorization: `Bearer ${process.env.TEMPORARY_ACCESS_TOKEN}`}
        }).then(res => res.data.payload)
      }
    },
    words: {
      type: new GraphQLList(WordType),
      args: { ID: { type: GraphQLString }},
      resolve(_parent, args) {
        return axios.get(`/api/v2/mongo/words/${args.ID}`, {
          headers: {Authorization: `Bearer ${process.env.TEMPORARY_ACCESS_TOKEN}`}
        }).then(res => res.data.payload)
      }
    },
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