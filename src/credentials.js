import SHA256 from 'crypto-js/sha256'
// const bigInt = require('jsbn').bigInt
var bigInt = require("big-integer");

// * Credential generation algorithm
function hash(val) {
  return bigInt(SHA256(val.toString()).toString(), 16).mod(
    bigInt('731499577')
  )
}

// wrong impl
function genRandom(digit) {
  return Math.floor(Math.random() * Math.pow(2, digit)).toString()
}

let generate_32_bit_hex = () =>
  SHA256(Math.random().toString(16), 16).substring(2, 2 + 8);
let generate_random_bigint = length => {
  let bitNum = "";
  for (let i = 0; i < length / 32; i += 1) bitNum += generate_32_bit_hex();
  return bigInt(bitNum, 16);
};



export function generate(seed, currentCourseId, rynmParams) {
  let credentials = {}

  // console.log('[WORKER]', seed)

  // Signatures: (s, e, v)
  let s = seed.signature.s
  let e = seed.signature.e
  let v = seed.signature.v
  // Message: uk
  let uk = seed.uk
  // Public key
  let a = seed.pubkey.a
  let b = seed.pubkey.b
  let g = seed.pubkey.g
  let h = seed.pubkey.h
  let n = seed.pubkey.n
  // Private random variables
  let priv = {}
  // Credential parameters
  let params = {}

  // Generate randoms
  let randAttr = ['s', 'e', 'w', 'z', 'x']
  randAttr.forEach(i => {
    priv['r' + i] = generate_random_bigint(32)
  })
  for (let i = 0; i < 20; i++) {
    priv['r' + i.toString()] = generate_random_bigint(32)
  }

  priv['w'] = generate_random_bigint(32)
  priv['r'] = generate_random_bigint(32)
  priv['r_'] = bigInt(priv['rz']).subtract(
    bigInt(e).multiply(bigInt(priv['rw']))
  )
  // console.log('[WORKER]', priv)

  // Calculate C sets
  let grnym = hash(currentCourseId).modPow(
    bigInt(rynmParams.exp),
    bigInt(rynmParams.gamma)
  )

  params['Cs'] = bigInt(g)
    .modPow(bigInt(s), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['rs']), bigInt(n))
    )
    .mod(bigInt(n))
  params['Ce'] = bigInt(g)
    .modPow(bigInt(e), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['re']), bigInt(n))
    )
    .mod(bigInt(n))
  params['Cv'] = bigInt(v)
    .multiply(
      bigInt(g).modPow(bigInt(priv['w']), bigInt(n))
    )
    .mod(bigInt(n))
  params['Cw'] = bigInt(g)
    .modPow(bigInt(priv['w']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['rw']), bigInt(n))
    )
    .mod(bigInt(n))
  priv['z'] = bigInt(e).multiply(bigInt(priv['w']))
  params['C'] = params['Cv']
    .modPow(bigInt(e), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r']), bigInt(n))
    )
    .mod(bigInt(n))
  params['Cx'] = bigInt(g)
    .modPow(bigInt(uk), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['rx']), bigInt(n))
    )
    .mod(bigInt(n))
  params['Cz'] = bigInt(g)
    .modPow(priv['z'], bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['rz']), bigInt(n))
    )
    .mod(bigInt(n))

  // Calculate Y sets
  params['y1'] = params['Cv']
    .modPow(bigInt(priv['r1']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r2']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y2'] = bigInt(g)
    .modPow(bigInt(priv['r1']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r3']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y3'] = bigInt(a)
    .modPow(bigInt(priv['r4']), bigInt(n))
    .multiply(
      bigInt(b).modPow(bigInt(priv['r5']), bigInt(n))
    )
    .multiply(
      bigInt(g).modPow(bigInt(priv['r6']), bigInt(n))
    )
    .multiply(
      bigInt(h).modPow(bigInt(priv['r7']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y4'] = bigInt(g)
    .modPow(bigInt(priv['r4']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r8']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y5'] = bigInt(g)
    .modPow(bigInt(priv['r5']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r9']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y6'] = bigInt(g)
    .modPow(bigInt(priv['r10']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r11']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y7'] = bigInt(g)
    .modPow(bigInt(priv['r6']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r12']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y8'] = params['Cv']
    .modPow(bigInt(priv['r10']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r7']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y9'] = bigInt(g)
    .modPow(bigInt(priv['r13']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r14']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y10'] = bigInt(g)
    .modPow(bigInt(priv['r15']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r16']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y11'] = bigInt(g)
    .modPow(bigInt(priv['r17']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r18']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y12'] = params['Cw']
    .modPow(bigInt(priv['r17']), bigInt(n))
    .multiply(
      bigInt(h).modPow(bigInt(priv['r19']), bigInt(n))
    )
    .mod(bigInt(n))
  params['y13'] = grnym.modPow(
    bigInt(priv['r4']),
    bigInt(rynmParams.gamma)
  )

  // Calculate x sets
  params['x'] = hash(
    bigInt(g)
    .multiply(bigInt(h))
    .multiply(params['C'])
    .multiply(params['Cv'])
    .multiply(params['Cs'])
    .multiply(params['Ce'])
    .multiply(params['Cx'])
    .multiply(params['Cz'])
    .multiply(params['Cw'])
  )

  // Calculate z sets
  let i = 0
  let arr = [
    e,
    priv['r'],
    priv['re'],
    uk,
    s,
    priv['z'],
    priv['r'],
    priv['rx'],
    priv['rs'],
    e,
    priv['re'],
    priv['rz'],
    priv['z'],
    priv['rz'],
    priv['w'],
    priv['rw'],
    e,
    priv['re'],
    priv['r_']
  ]
  arr.forEach(j => {
    i = i + 1
    params['z' + i.toString()] = bigInt(
      priv['r' + i.toString()].toString()
    ).add(
      bigInt(params['x'].toString()).multiply(
        bigInt(j.toString())
      )
    )
  })

  // Calculate rnym
  params['rnym'] = grnym.modPow(
    bigInt(uk),
    bigInt(rynmParams.gamma)
  )

  for (let key in params) {
    credentials[key] = params[key].toString()
  }
  // console.log('[WORKER]', credentials)
  return credentials
}