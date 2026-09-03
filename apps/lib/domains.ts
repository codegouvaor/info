export type Environment = 'production' | 'localhost'

export interface DomainConfig {
  main: string
  studios: string
  sso: string
  protocol: string
}

const DOMAINS: Record<Environment, DomainConfig> = {
  production: {
    main: 'etheriatimes.com',
    studios: 'studios.etheriatimes.com',
    sso: 'sso.etheriatimes.com',
    protocol: 'https',
  },
  localhost: {
    main: 'etheriatimes.localhost',
    studios: 'studios.etheriatimes.localhost',
    sso: 'sso.etheriatimes.localhost',
    protocol: 'http',
  },
}

export function detectEnvironment(): Environment {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production' ? 'production' : 'localhost'
  }

  return window.location.hostname.includes('localhost') ? 'localhost' : 'production'
}

export function getDomainConfig(): DomainConfig {
  return DOMAINS[detectEnvironment()]
}

export function getDomainUrl(service: 'main' | 'studios' | 'sso', path: string = ''): string {
  const config = getDomainConfig()
  return `${config.protocol}://${config[service]}${path}`
}

export function switchDomain(target: 'main' | 'studios' | 'sso', path: string): string {
  return getDomainUrl(target, path)
}
