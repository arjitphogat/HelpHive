import { createClient } from '@libsql/client';

const tursoConfig = {
  url: process.env.TURSO_DATABASE_URL || 'libsql://helphive-arjitphogat.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
};

export const turso = createClient(tursoConfig);

export async function testConnection() {
  try {
    const result = await turso.execute('SELECT 1');
    console.log('Turso connection successful:', result);
    return true;
  } catch (error) {
    console.error('Turso connection failed:', error);
    return false;
  }
}

export default turso;