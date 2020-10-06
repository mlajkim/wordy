import gql from 'graphql-tag';

export const YEARS_QUERY = gql `
  query YearsQuery($ID: String, $accessToken: String) {
    years (ID: $ID, accessToken: $accessToken) {
      year
      sem
    }
  }
`;