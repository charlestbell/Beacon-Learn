const fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: jest.fn().mockResolvedValue({}),
});

export default fetch;

it('This is only here becasue jest thinks that this is a test file for some reason, and its not letting me ignore this file with a testPathIgnorePattern without also ignoring the fetch mock above', () => {
  const one = 1;
  expect(one).toBe(1);
});
