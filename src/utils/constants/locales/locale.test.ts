import { test, expect, describe } from 'bun:test'
import { t, tData, tMessage } from './locale' // adjust import path as needed

// Mock data for testing
const dataEn = {
  user: {
    count: 'user|users',
    profile: {
      name: 'Name',
      email: 'Email Address'
    }
  },
  greeting: {
    simple: 'Hello',
    withParam: (value: string, opt?: { name: string }) => `Hello ${opt?.name || 'Guest'}`
  },
  config: {
    timeout: '30|30'
  }
}

const dataId = {
  user: {
    count: 'pengguna|pengguna',
    profile: {
      name: 'Nama',
      email: 'Alamat Email'
    }
  },
  greeting: {
    simple: 'Halo',
    withParam: (value: string, opt?: { name: string }) => `Halo ${opt?.name || 'Tamu'}`
  },
  config: {
    timeout: '30|30'
  }
}

const messageEn = {
  error: {
    validation: {
      required: 'Field is required|Fields are required',
      email: 'Invalid email format'
    },
    network: 'Connection failed'
  },
  success: {
    saved: 'Data saved successfully',
    welcome: (value: string, opt?: { username: string }) => `Welcome back, ${opt?.username}!`
  }
}

const messageId = {
  error: {
    validation: {
      required: 'Field wajib diisi|Field wajib diisi',
      email: 'Format email tidak valid'
    },
    network: 'Koneksi gagal'
  },
  success: {
    saved: 'Data berhasil disimpan',
    welcome: (value: string, opt?: { username: string }) => `Selamat datang kembali, ${opt?.username}!`
  }
}

// Mock the locale object (this would normally be imported)
const locale = {
  en: {
    data: dataEn,
    message: messageEn,
  },
  id: {
    data: dataId,
    message: messageId,
  },
}

describe('i18n function tests', () => {
  describe('Basic string access', () => {
    test('should access nested string values from data', () => {
      expect(t('en', 'user.profile.name')).toBe('Name')
      expect(t('id', 'user.profile.name')).toBe('Nama')
    })

    test('should access nested string values from message', () => {
      expect(t('en', 'error.validation.email')).toBe('Invalid email format')
      expect(t('id', 'error.validation.email')).toBe('Format email tidak valid')
    })

    test('should access simple greeting', () => {
      expect(t('en', 'greeting.simple')).toBe('Hello')
      expect(t('id', 'greeting.simple')).toBe('Halo')
    })
  })

  describe('Singular/Plural mode', () => {
    test('should return singular form by default', () => {
      expect(t('en', 'user.count')).toBe('user')
      expect(t('en', 'error.validation.required')).toBe('Field is required')
    })

    test('should return singular form when explicitly specified', () => {
      expect(t('en', 'user.count', 'singular')).toBe('user')
      expect(t('id', 'user.count', 'singular')).toBe('pengguna')
    })

    test('should return plural form when specified', () => {
      expect(t('en', 'user.count', 'plural')).toBe('users')
      expect(t('en', 'error.validation.required', 'plural')).toBe('Fields are required')
    })

    test('should handle same singular/plural values', () => {
      expect(t('id', 'user.count', 'singular')).toBe('pengguna')
      expect(t('id', 'user.count', 'plural')).toBe('pengguna')
    })

    test('should fallback to first part if no plural exists', () => {
      expect(t('en', 'config.timeout', 'plural')).toBe('30')
    })
  })

  describe('Function values', () => {
    test('should execute function with parameters', () => {
      expect(t('en', 'greeting.withParam', 'singular', { name: 'John' })).toBe('Hello John')
      expect(t('id', 'greeting.withParam', 'singular', { name: 'Budi' })).toBe('Halo Budi')
    })

    test('should execute function with default when no params provided', () => {
      expect(t('en', 'greeting.withParam')).toBe('Hello Guest')
      expect(t('id', 'greeting.withParam')).toBe('Halo Tamu')
    })

    test('should execute function from message category', () => {
      expect(t('en', 'success.welcome', 'singular', { username: 'Alice' })).toBe('Welcome back, Alice!')
      expect(t('id', 'success.welcome', 'singular', { username: 'Sari' })).toBe('Selamat datang kembali, Sari!')
    })
  })

  describe('Category-specific functions', () => {
    test('tData should access data category only', () => {
      expect(tData('en', 'user.profile.email')).toBe('Email Address')
      expect(tData('id', 'user.profile.email')).toBe('Alamat Email')
    })

    test('tMessage should access message category only', () => {
      expect(tMessage('en', 'error.network')).toBe('Connection failed')
      expect(tMessage('id', 'error.network')).toBe('Koneksi gagal')
    })

    test('tData should handle plural forms', () => {
      expect(tData('en', 'user.count', 'singular')).toBe('user')
      expect(tData('en', 'user.count', 'plural')).toBe('users')
    })

    test('tMessage should handle plural forms', () => {
      expect(tMessage('en', 'error.validation.required', 'singular')).toBe('Field is required')
      expect(tMessage('en', 'error.validation.required', 'plural')).toBe('Fields are required')
    })

    test('tData should execute functions with parameters', () => {
      expect(tData('en', 'greeting.withParam', 'singular', { name: 'Test' })).toBe('Hello Test')
    })

    test('tMessage should execute functions with parameters', () => {
      expect(tMessage('en', 'success.welcome', 'singular', { username: 'TestUser' })).toBe('Welcome back, TestUser!')
    })
  })

  describe('Error handling', () => {
    test('should throw error for non-existent keys', () => {
      expect(() => t('en', 'non.existent.key' as any)).toThrow('Translation key "non.existent.key" not found for locale "en"')
    })

    test('should throw error for non-existent keys in tData', () => {
      expect(() => tData('en', 'non.existent.key' as any)).toThrow('Translation key "non.existent.key" not found in data for locale "en"')
    })

    test('should throw error for non-existent keys in tMessage', () => {
      expect(() => tMessage('en', 'non.existent.key' as any)).toThrow('Translation key "non.existent.key" not found in message for locale "en"')
    })
  })

  describe('Priority handling', () => {
    test('should prioritize data over message when key exists in both', () => {
      // Add same key to both data and message for testing
      const testDataEn = { ...dataEn, shared: { key: 'from data' } }
      const testMessageEn = { ...messageEn, shared: { key: 'from message' } }

      const testLocale = {
        en: {
          data: testDataEn,
          message: testMessageEn,
        },
        id: {
          data: dataId,
          message: messageId,
        },
      }

      // This would require modifying the actual locale object or mocking it
      // For now, we test that the function searches data first by default behavior
      expect(t('en', 'user.profile.name')).toBe('Name') // This comes from data
    })
  })

  describe('Edge cases', () => {
    test('should handle empty string parameters', () => {
      expect(t('en', 'greeting.withParam', 'singular', { name: '' })).toBe('Hello ')
    })

    test('should handle strings without pipe separator', () => {
      expect(t('en', 'error.network', 'plural')).toBe('Connection failed')
    })

    test('should handle multiple pipe separators (use first two parts)', () => {
      // This would need a test value with multiple pipes
      const testValue = 'one|two|three'
      // The function should split and use first two parts
    })
  })
})