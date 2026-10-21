// Astronomical star catalog and constellation lines dataset
// Coordinates: Right Ascension (RA in hours 0-24) and Declination (Dec in degrees -90 to +90)
// Magnitudes: Apparent visual magnitude (lower/negative = brighter)

const STAR_CATALOG = [
  { id: 'sirius', name: 'Sirius (Dog Star)', ra: 6.75, dec: -16.72, mag: -1.46, spectral: 'A1V', dist: 8.6, con: 'Canis Major', desc: 'The brightest star in the night sky. A binary system with a white dwarf companion.' },
  { id: 'canopus', name: 'Canopus', ra: 6.40, dec: -52.70, mag: -0.74, spectral: 'A9II', dist: 310, con: 'Carina', desc: 'The second-brightest star, historically used for spacecraft attitude navigation.' },
  { id: 'rigil_kent', name: 'Rigil Kentaurus (Alpha Centauri A)', ra: 14.66, dec: -60.83, mag: -0.27, spectral: 'G2V', dist: 4.37, con: 'Centaurus', desc: 'The closest star system to the Solar System, very similar in class to our Sun.' },
  { id: 'arcturus', name: 'Arcturus', ra: 14.26, dec: 19.18, mag: -0.05, spectral: 'K1.5III', dist: 36.7, con: 'Boötes', desc: 'An orange giant star, the brightest in the northern celestial hemisphere.' },
  { id: 'vega', name: 'Vega', ra: 18.62, dec: 38.78, mag: 0.03, spectral: 'A0Va', dist: 25.0, con: 'Lyra', desc: 'Anchor of the Summer Triangle, historically served as the northern pole star around 12,000 BCE.' },
  { id: 'capella', name: 'Capella', ra: 5.28, dec: 46.00, mag: 0.08, spectral: 'G3III', dist: 42.9, con: 'Auriga', desc: 'A quadruple star system consisting of two pairs of binary stars.' },
  { id: 'rigel', name: 'Rigel', ra: 5.24, dec: -8.20, mag: 0.13, spectral: 'B8Ia', dist: 860, con: 'Orion', desc: 'Blue-white supergiant marking the left foot of Orion. Extremely luminous.' },
  { id: 'procyon', name: 'Procyon', ra: 7.65, dec: 5.22, mag: 0.38, spectral: 'F5IV-V', dist: 11.46, con: 'Canis Minor', desc: 'Brightest star in Canis Minor, forms the Winter Triangle with Sirius and Betelgeuse.' },
  { id: 'achernar', name: 'Achernar', ra: 1.63, dec: -57.24, mag: 0.46, spectral: 'B6Vep', dist: 139, con: 'Eridanus', desc: 'The least spherical star known in the Milky Way due to its rapid rotational velocity.' },
  { id: 'betelgeuse', name: 'Betelgeuse', ra: 5.92, dec: 7.41, mag: 0.50, spectral: 'M1-M2Ia', dist: 642, con: 'Orion', desc: 'Red supergiant nearing the end of its life, expected to explode as a supernova.' },
  { id: 'hadar', name: 'Hadar (Beta Centauri)', ra: 14.06, dec: -60.37, mag: 0.61, spectral: 'B1III', dist: 390, con: 'Centaurus', desc: 'A blue-white giant star that acts as one of the southern celestial pointers to Crux.' },
  { id: 'altair', name: 'Altair', ra: 19.85, dec: 8.87, mag: 0.77, spectral: 'A7V', dist: 16.7, con: 'Aquila', desc: 'Flattest star in the Summer Triangle, rotating in just 9 hours at its equator.' },
  { id: 'acrux', name: 'Acrux (Alpha Crucis)', ra: 12.44, dec: -63.10, mag: 0.77, spectral: 'B0.5IV', dist: 320, con: 'Crux', desc: 'The brightest star in the Southern Cross, iconic in southern hemisphere culture.' },
  { id: 'aldebaran', name: 'Aldebaran', ra: 4.60, dec: 16.51, mag: 0.85, spectral: 'K5III', dist: 65.3, con: 'Taurus', desc: 'The "Eye of the Bull" in Taurus, an orange giant star.' },
  { id: 'antares', name: 'Antares', ra: 16.49, dec: -26.43, mag: 0.96, spectral: 'M1.5Iab', dist: 550, con: 'Scorpius', desc: 'Red supergiant representing the heart of the scorpion, rival of Mars in Greek mythology.' },
  { id: 'spica', name: 'Spica', ra: 13.42, dec: -11.16, mag: 0.98, spectral: 'B1III-IV', dist: 250, con: 'Virgo', desc: 'Bright binary system in Virgo representing an ear of wheat held by the goddess.' },
  { id: 'pollux', name: 'Pollux', ra: 7.76, dec: 28.03, mag: 1.14, spectral: 'K0III', dist: 33.78, con: 'Gemini', desc: 'Orange giant star and the brighter of the Gemini twins (Castor and Pollux).' },
  { id: 'fomalhaut', name: 'Fomalhaut', ra: 22.96, dec: -29.62, mag: 1.16, spectral: 'A3V', dist: 25.13, con: 'Piscis Austrinus', desc: 'Known as the "Lonely Star of Autumn", surrounded by an extensive debris disk.' },
  { id: 'deneb', name: 'Deneb', ra: 20.69, dec: 45.28, mag: 1.25, spectral: 'A2Ia', dist: 2615, con: 'Cygnus', desc: 'Extremely luminous white supergiant marking the tail of Cygnus the Swan.' },
  { id: 'mimosa', name: 'Mimosa (Beta Crucis)', ra: 12.79, dec: -59.69, mag: 1.25, spectral: 'B0.5III', dist: 280, con: 'Crux', desc: 'Second-brightest star of the Southern Cross.' },
  { id: 'regulus', name: 'Regulus', ra: 10.14, dec: 11.97, mag: 1.36, spectral: 'B8IVn', dist: 79.3, con: 'Leo', desc: 'The "Little King" star at the base of the sickle of Leo.' },
  { id: 'castor', name: 'Castor', ra: 7.58, dec: 31.89, mag: 1.58, spectral: 'A1V', dist: 51.6, con: 'Gemini', desc: 'Fascinating sextuple star system appearing as a single white point of light.' },
  { id: 'bellatrix', name: 'Bellatrix', ra: 5.42, dec: 6.35, mag: 1.64, spectral: 'B2III', dist: 250, con: 'Orion', desc: 'Known as the "Amazon Star", marks the left shoulder of Orion.' },
  { id: 'alnath', name: 'Elnath', ra: 5.44, dec: 28.61, mag: 1.65, spectral: 'B7III', dist: 134, con: 'Taurus', desc: 'Marks the northern horn tip of Taurus the Bull.' },
  { id: 'alnilam', name: 'Alnilam', ra: 5.60, dec: -1.20, mag: 1.69, spectral: 'B0Ia', dist: 2000, con: 'Orion', desc: 'The central star of Orion\'s Belt, a blue supergiant.' },
  { id: 'alnitak', name: 'Alnitak', ra: 5.68, dec: -1.94, mag: 1.77, spectral: 'O9.5Iab', dist: 1260, con: 'Orion', desc: 'Eastern star of Orion\'s Belt, situated next to the iconic Horsehead Nebula.' },
  { id: 'mintaka', name: 'Mintaka', ra: 5.53, dec: -0.30, mag: 2.23, spectral: 'O9.5II', dist: 1200, con: 'Orion', desc: 'Western star of Orion\'s Belt, located practically right on the celestial equator.' },
  { id: 'saiph', name: 'Saiph', ra: 5.79, dec: -9.67, mag: 2.07, spectral: 'B0.5Ia', dist: 650, con: 'Orion', desc: 'Supergiant star marking the right foot of Orion.' },
  { id: 'polaris', name: 'Polaris (North Star)', ra: 2.53, dec: 89.26, mag: 1.98, spectral: 'F7Ib', dist: 433, con: 'Ursa Minor', desc: 'The current Northern Pole Star, situated less than 1 degree from the true north celestial pole.' },
  { id: 'dubhe', name: 'Dubhe', ra: 11.06, dec: 61.75, mag: 1.79, spectral: 'K0III', dist: 123, con: 'Ursa Major', desc: 'One of the two "Pointer Stars" in the Big Dipper pointing towards Polaris.' },
  { id: 'merak', name: 'Merak', ra: 11.03, dec: 56.38, mag: 2.37, spectral: 'A1V', dist: 79.7, con: 'Ursa Major', desc: 'The lower pointer star of the Big Dipper bowl.' },
  { id: 'phecda', name: 'Phecda', ra: 11.90, dec: 53.69, mag: 2.44, spectral: 'A0Ve', dist: 83.2, con: 'Ursa Major', desc: 'Star at the base of the Big Dipper bowl nearest the handle.' },
  { id: 'megrez', name: 'Megrez', ra: 12.25, dec: 57.03, mag: 3.31, spectral: 'A3V', dist: 80.5, con: 'Ursa Major', desc: 'The faintest of the seven primary Big Dipper stars.' },
  { id: 'alioth', name: 'Alioth', ra: 12.90, dec: 55.96, mag: 1.77, spectral: 'A1III-IVp', dist: 82.6, con: 'Ursa Major', desc: 'Brightest star in Ursa Major, located in the handle of the Big Dipper.' },
  { id: 'mizar', name: 'Mizar', ra: 13.40, dec: 54.92, mag: 2.23, spectral: 'A2V', dist: 82.9, con: 'Ursa Major', desc: 'Famous naked-eye visual double with companion star Alcor.' },
  { id: 'alkaid', name: 'Alkaid', ra: 13.79, dec: 49.31, mag: 1.86, spectral: 'B3V', dist: 103.9, con: 'Ursa Major', desc: 'Tip of the Big Dipper handle, guiding observers to "arc to Arcturus".' },
  { id: 'gamma_crucis', name: 'Gacrux (Gamma Crucis)', ra: 12.52, dec: -57.11, mag: 1.63, spectral: 'M3.5III', dist: 88.6, con: 'Crux', desc: 'Red giant star at the top of the Southern Cross.' },
  { id: 'delta_crucis', name: 'Imai (Delta Crucis)', ra: 12.25, dec: -58.75, mag: 2.78, spectral: 'B2IV', dist: 345, con: 'Crux', desc: 'Western arm star of the Southern Cross constellation.' },
  { id: 'schedar', name: 'Schedar', ra: 0.68, dec: 56.54, mag: 2.24, spectral: 'K0IIIa', dist: 228, con: 'Cassiopeia', desc: 'Brightest star in the distinctive W-shaped constellation Cassiopeia.' },
  { id: 'caph', name: 'Caph', ra: 0.15, dec: 59.15, mag: 2.28, spectral: 'F2III', dist: 54.7, con: 'Cassiopeia', desc: 'Westernmost star of the Cassiopeia W asterism.' },
  { id: 'gamma_cas', name: 'Navi (Gamma Cas)', ra: 0.94, dec: 60.72, mag: 2.15, spectral: 'B0.5IVe', dist: 550, con: 'Cassiopeia', desc: 'Central star in Cassiopeia, variable Be star with intense stellar winds.' },
  { id: 'ruchbah', name: 'Ruchbah', ra: 1.43, dec: 60.23, mag: 2.68, spectral: 'A5III', dist: 99.4, con: 'Cassiopeia', desc: 'Eclipsing binary star in Cassiopeia.' },
  { id: 'segin', name: 'Segin', ra: 1.90, dec: 63.67, mag: 3.37, spectral: 'B3V', dist: 460, con: 'Cassiopeia', desc: 'Easternmost star of the Cassiopeia W.' },
  { id: 'shaula', name: 'Shaula', ra: 17.56, dec: -37.10, mag: 1.62, spectral: 'B2IV', dist: 570, con: 'Scorpius', desc: 'The sting of the Scorpion, marks the tip of the curved tail.' },
  { id: 'sargas', name: 'Sargas', ra: 17.62, dec: -43.00, mag: 1.87, spectral: 'F0II', dist: 300, con: 'Scorpius', desc: 'Bright yellow-white giant in the tail of Scorpius.' },
  { id: 'dshubba', name: 'Dschubba', ra: 16.01, dec: -22.62, mag: 2.32, spectral: 'B0.3IV', dist: 490, con: 'Scorpius', desc: 'Marks the forehead of the Scorpion.' }
];

const CONSTELLATIONS = [
  {
    id: 'orion',
    name: 'Orion (The Hunter)',
    season: 'Summer (South) / Winter (North)',
    lines: [
      ['betelgeuse', 'bellatrix'],
      ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['alnitak', 'saiph'],
      ['saiph', 'rigel'],
      ['rigel', 'mintaka'],
      ['betelgeuse', 'alnitak']
    ],
    desc: 'Prominent constellation visible globally. Features the iconic Belt of three stars.'
  },
  {
    id: 'crux',
    name: 'Crux (The Southern Cross)',
    season: 'Year-round in South Hemisphere',
    lines: [
      ['gamma_crucis', 'acrux'],
      ['delta_crucis', 'mimosa']
    ],
    desc: 'The smallest constellation, vital for celestial navigation in the Southern Hemisphere.'
  },
  {
    id: 'ursa_major',
    name: 'Ursa Major (Big Dipper)',
    season: 'Spring / Summer (North)',
    lines: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid']
    ],
    desc: 'Famous northern asterism used since antiquity to find the North Star.'
  },
  {
    id: 'cassiopeia',
    name: 'Cassiopeia (The Queen)',
    season: 'Autumn / Winter (North)',
    lines: [
      ['caph', 'schedar'],
      ['schedar', 'gamma_cas'],
      ['gamma_cas', 'ruchbah'],
      ['ruchbah', 'segin']
    ],
    desc: 'Recognizable W-shaped asterism in the northern sky opposite the Big Dipper.'
  },
  {
    id: 'scorpius',
    name: 'Scorpius (The Scorpion)',
    season: 'Winter (South) / Summer (North)',
    lines: [
      ['dshubba', 'antares'],
      ['antares', 'sargas'],
      ['sargas', 'shaula']
    ],
    desc: 'Striking J-shaped constellation crowned by the brilliant red heart Antares.'
  },
  {
    id: 'gemini',
    name: 'Gemini (The Twins)',
    season: 'Summer (South) / Winter (North)',
    lines: [
      ['castor', 'pollux']
    ],
    desc: 'Zodiac constellation famous for twin stars Castor and Pollux.'
  }
];
