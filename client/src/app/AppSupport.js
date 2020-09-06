
export default async function RetrieveAllWords (ownerId) {
  const response = await fetch('/api/word/' + ownerId, {
    method: 'GET',
    headers: {'Content-Type':'application/json'}
  })
  const json = await response.json();

  return json;
}

