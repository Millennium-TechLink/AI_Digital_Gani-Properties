#!/usr/bin/env node

/**
 * Generate a secure JWT secret key
 * 
 * Usage:
 *   node scripts/generate-jwt-secret.js
 * 
 * Outputs a base64-encoded random string suitable for JWT_SECRET
 */

import { randomBytes } from 'crypto';

// Generate 32 random bytes and encode as base64
const secret = randomBytes(32).toString('base64');

console.log('\n🔐 Generated JWT Secret:\n');
console.log(secret);
console.log('\n📋 Copy this value to your .env file as JWT_SECRET\n');
console.log('Example:');
console.log(`JWT_SECRET=${secret}\n`);
