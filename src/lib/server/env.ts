const REQUIRED_ENV_VARS = [
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "DATABASE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "OPENAI_API_KEY",
] as const

type RequiredEnvVar = (typeof REQUIRED_ENV_VARS)[number]

function getRequiredEnvVar(name: RequiredEnvVar) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

export const env = {
  BETTER_AUTH_SECRET: getRequiredEnvVar("BETTER_AUTH_SECRET"),
  BETTER_AUTH_URL: getRequiredEnvVar("BETTER_AUTH_URL"),
  DATABASE_URL: getRequiredEnvVar("DATABASE_URL"),
  GOOGLE_CLIENT_ID: getRequiredEnvVar("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getRequiredEnvVar("GOOGLE_CLIENT_SECRET"),
  OPENAI_API_KEY: getRequiredEnvVar("OPENAI_API_KEY"),
  OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() || "gpt-4.1-mini",
} as const
