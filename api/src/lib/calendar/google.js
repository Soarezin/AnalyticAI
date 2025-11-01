export async function createEventStub({ title, date, description }) {
  // TODO: Integrar com Google Calendar OAuth2.
  return {
    ok: true,
    simulated: true,
    title,
    date,
    description
  };
}
