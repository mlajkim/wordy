import gql from 'graphql-tag';

export const YEARS_QUERY = gql `
  query YearsQuery($ID: String, $accessToken: String) {
    years (ID: $ID, accessToken: $accessToken) {
      year
      sem
    }
  }
`;

/**
 * THESE WORKS KINDA OKAY WITH DEPENDECY WARNING
 
const {loading, error, data} = useQuery(YEARS_QUERY, {
  variables: { ID: user.ID, accessToken: API.getAccessToken() }
});
useEffect(() => {
  if(!loading && !error) store.dispatch(setYears(data.years));
}, [loading, error]);

 */