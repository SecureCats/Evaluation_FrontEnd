import SHA256 from 'crypto-js/sha256'
const BigInteger = require('jsbn').BigInteger

// * Credential generation algorithm
function hash(val) {
  return new BigInteger(SHA256(val.toString()).toString(), 16).mod(
    new BigInteger('731499577')
  )
}

function genRandom(digit) {
  return Math.floor(Math.random() * Math.pow(2, digit)).toString()
}

export function generate(seed, currentCourseId, rynmParams) {
  let credentials = {}

  seed = JSON.parse(seed)
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
    priv['r' + i] = genRandom(32)
  })
  for (let i = 0; i < 20; i++) {
    priv['r' + i.toString()] = Math.floor(
      Math.random() * Math.pow(2, 32)
    ).toString()
  }

  priv['w'] = genRandom(32)
  priv['r'] = genRandom(32)
  priv['r_'] = new BigInteger(priv['rz']).subtract(
    new BigInteger(e).multiply(new BigInteger(priv['rw']))
  )
  // console.log('[WORKER]', priv)

  // Calculate C sets
  let grnym = hash(currentCourseId).modPow(
    new BigInteger(rynmParams.exp),
    new BigInteger(rynmParams.gamma)
  )

  params['Cs'] = new BigInteger(g)
    .modPow(new BigInteger(s), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['rs']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['Ce'] = new BigInteger(g)
    .modPow(new BigInteger(e), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['re']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['Cv'] = new BigInteger(v)
    .multiply(
      new BigInteger(g).modPow(new BigInteger(priv['w']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['Cw'] = new BigInteger(g)
    .modPow(new BigInteger(priv['w']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['rw']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  priv['z'] = new BigInteger(e).multiply(new BigInteger(priv['w']))
  params['C'] = params['Cv']
    .modPow(new BigInteger(e), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['Cx'] = new BigInteger(g)
    .modPow(new BigInteger(uk), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['rx']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['Cz'] = new BigInteger(g)
    .modPow(priv['z'], new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['rz']), new BigInteger(n))
    )
    .mod(new BigInteger(n))

  // Calculate Y sets
  params['y1'] = params['Cv']
    .modPow(new BigInteger(priv['r1']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r2']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y2'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r1']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r3']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y3'] = new BigInteger(a)
    .modPow(new BigInteger(priv['r4']), new BigInteger(n))
    .multiply(
      new BigInteger(b).modPow(new BigInteger(priv['r5']), new BigInteger(n))
    )
    .multiply(
      new BigInteger(g).modPow(new BigInteger(priv['r6']), new BigInteger(n))
    )
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r7']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y4'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r4']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r8']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y5'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r5']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r9']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y6'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r10']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r11']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y7'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r6']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r12']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y8'] = params['Cv']
    .modPow(new BigInteger(priv['r10']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r7']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y9'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r13']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r14']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y10'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r15']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r16']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y11'] = new BigInteger(g)
    .modPow(new BigInteger(priv['r17']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r18']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y12'] = params['Cw']
    .modPow(new BigInteger(priv['r17']), new BigInteger(n))
    .multiply(
      new BigInteger(h).modPow(new BigInteger(priv['r19']), new BigInteger(n))
    )
    .mod(new BigInteger(n))
  params['y13'] = grnym.modPow(
    new BigInteger(priv['r4']),
    new BigInteger(rynmParams.gamma)
  )

  // Calculate x sets
  params['x'] = hash(
    new BigInteger(g)
      .multiply(new BigInteger(h))
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
    params['z' + i.toString()] = new BigInteger(
      priv['r' + i.toString()].toString()
    ).add(
      new BigInteger(params['x'].toString()).multiply(
        new BigInteger(j.toString())
      )
    )
  })

  // Calculate rnym
  params['rnym'] = grnym.modPow(
    new BigInteger(uk),
    new BigInteger(rynmParams.gamma)
  )

  for (let key in params) {
    credentials[key] = params[key].toString()
  }
  // console.log('[WORKER]', credentials)
  return credentials
}
