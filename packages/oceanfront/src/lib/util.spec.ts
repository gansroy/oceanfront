import { isDigit } from './util'

test('isDigit validate', async () => {
  expect(isDigit('0')).toEqual(true)
  expect(isDigit('9')).toEqual(true)
  expect(isDigit('')).toEqual(false)
  expect(isDigit('m0')).toEqual(false)
  expect(isDigit(undefined as any)).toEqual(false)
  expect(isDigit(null as any)).toEqual(true)
})
