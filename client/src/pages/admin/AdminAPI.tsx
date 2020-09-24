
type Props = {
  profile: {UNIQUE_ID: String};
  setDataLoading: (arg0: boolean) => void;

}
export const change_user_db = async (props: Props, changingType: string, changingValue: string) => {
  props.setDataLoading(true);

  let endpoint = `/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/${changingType}`;
  await fetch(endpoint, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      value: `${changingValue}`
    })
  })

  endpoint = `/api/mongo/user/put/${props.profile.UNIQUE_ID}/one/lastTransactionID`;
  await fetch(endpoint, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      value: ''
    })
  })

  props.setDataLoading(false);
}