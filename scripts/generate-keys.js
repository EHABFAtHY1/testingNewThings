const fs = require('fs');
const path = require('path');
const { generateKeyPairSync } = require('crypto');

const keysDir = path.join(__dirname, '..', 'keys');
const privateKeyPath = path.join(keysDir, 'private.pem');
const publicKeyPath = path.join(keysDir, 'public.pem');

if (!fs.existsSync(keysDir)) {
  fs.mkdirSync(keysDir, { recursive: true });
}

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

fs.writeFileSync(privateKeyPath, privateKey, 'utf8');
fs.writeFileSync(publicKeyPath, publicKey, 'utf8');

console.log('RSA keys generated successfully.');
console.log(`Private key: ${privateKeyPath}`);
console.log(`Public key : ${publicKeyPath}`);
