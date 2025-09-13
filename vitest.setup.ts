import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Estende o expect com matchers do jest-dom
expect.extend(matchers)

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup()
})
