// yes

export const has_token_expired = (expiringAt: string) => {
  const safety = 1000000; // 1,000 seconds extra

  if (parseInt(expiringAt) - safety >= Date.now()) return true;
  else return false;
}