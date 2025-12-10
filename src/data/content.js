/**
 * Static content and configuration data
 * Enhanced with more levers and updated terminology
 */

// Enhanced lever definitions - higher density
export const LEVERS = [
  // Core Development Factors
  {
    id: 'aiRnD',
    label: 'AI R&D Investment',
    min: -5,
    max: 5,
    default: 0,
    description: 'Global funding for AI research',
    category: 'development',
  },
  {
    id: 'computeGrowth',
    label: 'Compute Scaling',
    min: -5,
    max: 5,
    default: 0,
    description: 'GPU/TPU advancement rate',
    category: 'development',
  },
  {
    id: 'algorithmic',
    label: 'Algorithmic Progress',
    min: -5,
    max: 5,
    default: 0,
    description: 'Architecture breakthroughs',
    category: 'development',
  },
  {
    id: 'dataAvailability',
    label: 'Data Availability',
    min: -3,
    max: 3,
    default: 0,
    description: 'Training data quality & scale',
    category: 'development',
  },
  // Competition & Resources
  {
    id: 'geopolitical',
    label: 'Geopolitical Race',
    min: -5,
    max: 5,
    default: 0,
    description: 'US-China competition intensity',
    category: 'competition',
  },
  {
    id: 'talent',
    label: 'Talent Concentration',
    min: -3,
    max: 3,
    default: 0,
    description: 'Top researcher distribution',
    category: 'competition',
  },
  {
    id: 'corporateRace',
    label: 'Corporate Competition',
    min: -5,
    max: 5,
    default: 0,
    description: 'OpenAI/Google/Anthropic race',
    category: 'competition',
  },
  {
    id: 'energy',
    label: 'Energy Infrastructure',
    min: -3,
    max: 3,
    default: 0,
    description: 'Power & datacenter capacity',
    category: 'competition',
  },
  // Safety & Governance
  {
    id: 'safety',
    label: 'AI Safety Research',
    min: -5,
    max: 5,
    default: 0,
    description: 'Alignment R&D funding',
    category: 'safety',
  },
  {
    id: 'alignment',
    label: 'Alignment Progress',
    min: -5,
    max: 5,
    default: 0,
    description: 'Technical alignment breakthroughs',
    category: 'safety',
  },
  {
    id: 'regulation',
    label: 'Government Regulation',
    min: -5,
    max: 5,
    default: 0,
    description: 'Oversight & restrictions',
    category: 'safety',
  },
  {
    id: 'internationalCoord',
    label: 'International Coordination',
    min: -5,
    max: 5,
    default: 0,
    description: 'Global AI governance treaties',
    category: 'safety',
  },
  // Wildcards
  {
    id: 'economicPressure',
    label: 'Economic Pressure',
    min: -3,
    max: 3,
    default: 0,
    description: 'Market demand for AI',
    category: 'wildcard',
  },
  {
    id: 'publicSentiment',
    label: 'Public Sentiment',
    min: -3,
    max: 3,
    default: 0,
    description: 'Social acceptance level',
    category: 'wildcard',
  },
  {
    id: 'blackSwan',
    label: 'Black Swan Events',
    min: -5,
    max: 5,
    default: 0,
    description: 'Unexpected disruptions',
    category: 'wildcard',
  },
];

// Category groupings for lever panels
export const LEVER_CATEGORIES = {
  development: { label: 'Development', icon: '🚀', color: '#00f0ff' },
  competition: { label: 'Competition', icon: '⚡', color: '#f97316' },
  safety: { label: 'Safety & Governance', icon: '🛡️', color: '#22c55e' },
  wildcard: { label: 'Wildcards', icon: '🎲', color: '#8b5cf6' },
};

// Kardashev-based civilization scale
// Y values map to visual positions, Kardashev values are for display
export const KARDASHEV_SCALE = [
  {
    id: 'type0',
    kValue: 0.73,
    yRange: [0, 0.15],
    name: 'Type 0',
    subtitle: 'Pre-Planetary',
    description: 'Current humanity (~0.73 K)',
    color: '#64748b',
    energy: '~10¹³ W',
  },
  {
    id: 'preAGI',
    kValue: 0.85,
    yRange: [0.15, 0.30],
    name: 'Type 0.85',
    subtitle: 'Advanced AI Era',
    description: 'Narrow → Reliable Agents',
    color: '#0ea5e9',
    energy: '~10¹⁴ W',
  },
  {
    id: 'agi',
    kValue: 0.95,
    yRange: [0.30, 0.50],
    name: 'Type 0.95',
    subtitle: 'AGI Threshold',
    description: 'Human-level intelligence',
    color: '#00f0ff',
    energy: '~10¹⁵ W',
  },
  {
    id: 'super',
    kValue: 1.0,
    yRange: [0.50, 0.70],
    name: 'Type I',
    subtitle: 'Planetary Civilization',
    description: 'Superintelligence era',
    color: '#22c55e',
    energy: '10¹⁶ W',
  },
  {
    id: 'asi',
    kValue: 1.5,
    yRange: [0.70, 0.85],
    name: 'Type I.5',
    subtitle: 'ASI / Singularity',
    description: 'Recursive self-improvement',
    color: '#8b5cf6',
    energy: '10²⁰ W',
  },
  {
    id: 'post',
    kValue: 2.0,
    yRange: [0.85, 1.0],
    name: 'Type II+',
    subtitle: 'Stellar / Beyond',
    description: 'Dyson-sphere civilization',
    color: '#ec4899',
    energy: '10²⁶ W',
  },
];

// Legacy alias for compatibility
export const CAPABILITY_SCALE = KARDASHEV_SCALE.map((k, i) => ({
  level: i,
  range: `${k.yRange[0]} - ${k.yRange[1]}`,
  name: k.name,
  description: k.subtitle,
  color: k.color,
  yPos: (k.yRange[0] + k.yRange[1]) / 2,
}));

// Scenario definitions with lever presets
export const SCENARIOS = {
  utopian: {
    id: 'utopian',
    title: 'Aligned Flourishing',
    icon: '🌟',
    description: 'Strong safety focus leads to beneficial superintelligence. Humanity flourishes.',
    conditions: 'High safety + alignment + coordination',
    presets: {
      aiRnD: 3,
      computeGrowth: 2,
      algorithmic: 2,
      dataAvailability: 1,
      geopolitical: -2,
      talent: 2,
      corporateRace: 0,
      energy: 2,
      safety: 5,
      alignment: 5,
      regulation: 3,
      internationalCoord: 5,
      economicPressure: 1,
      publicSentiment: 2,
      blackSwan: 0,
    },
  },
  race: {
    id: 'race',
    title: 'Competitive Race',
    icon: '🏁',
    description: 'US-China competition drives rapid development. Outcome uncertain.',
    conditions: 'High competition, moderate safety',
    presets: {
      aiRnD: 4,
      computeGrowth: 4,
      algorithmic: 3,
      dataAvailability: 2,
      geopolitical: 5,
      talent: 2,
      corporateRace: 5,
      energy: 2,
      safety: 1,
      alignment: 0,
      regulation: -2,
      internationalCoord: -3,
      economicPressure: 3,
      publicSentiment: -1,
      blackSwan: 0,
    },
  },
  slowdown: {
    id: 'slowdown',
    title: 'Managed Transition',
    icon: '🛡️',
    description: 'International agreements slow development. More time for alignment.',
    conditions: 'High regulation + coordination',
    presets: {
      aiRnD: -1,
      computeGrowth: 0,
      algorithmic: 0,
      dataAvailability: 0,
      geopolitical: -3,
      talent: 0,
      corporateRace: -2,
      energy: 0,
      safety: 4,
      alignment: 4,
      regulation: 5,
      internationalCoord: 5,
      economicPressure: -2,
      publicSentiment: 3,
      blackSwan: 0,
    },
  },
  uncontrolled: {
    id: 'uncontrolled',
    title: 'Uncontrolled Takeoff',
    icon: '⚠️',
    description: 'Rapid development outpaces safety. High variance outcomes.',
    conditions: 'High race + low safety',
    presets: {
      aiRnD: 5,
      computeGrowth: 5,
      algorithmic: 5,
      dataAvailability: 3,
      geopolitical: 5,
      talent: 3,
      corporateRace: 5,
      energy: 3,
      safety: -4,
      alignment: -3,
      regulation: -5,
      internationalCoord: -5,
      economicPressure: 3,
      publicSentiment: -3,
      blackSwan: 2,
    },
  },
};

// Educational content tabs - comprehensive definitions
export const INFO_TABS = [
  {
    id: 'concepts',
    label: 'Key Concepts',
    content: {
      title: 'Understanding the Terms',
      paragraphs: [
        'AGI, ASI and "superintelligence" are categories of capabilities an AI system can have. The singularity is a hypothesized event where self-improving AI drives progress so fast that human society becomes fundamentally unpredictable.',
      ],
      bullets: [
        '🧠 AGI: AI matching human-level general intelligence across domains',
        '🚀 ASI / Superintelligence: AI vastly beyond humans in all cognitive areas',
        '🌀 Singularity: The moment when change becomes uncontrollable and irreversible',
        'Key distinction: AGI and ASI describe what AI can do; Singularity is what happens to the world',
      ],
    },
  },
  {
    id: 'agi',
    label: 'AGI',
    content: {
      title: 'Artificial General Intelligence',
      paragraphs: [
        'AGI refers to a system that can match or surpass human performance across a broad range of cognitive tasks, generalizing knowledge and solving novel problems without task-specific retraining.',
      ],
      bullets: [
        'Transfers skills between domains, reasons abstractly',
        'Adapts to new situations much like a human',
        'Unlike current narrow AI, not limited to specific tasks',
        'Often modeled as the precursor to ASI and singularity',
      ],
    },
  },
  {
    id: 'asi',
    label: 'ASI',
    content: {
      title: 'Artificial Superintelligence',
      paragraphs: [
        'ASI, often called "superintelligence," is an intellect much smarter than the best human minds in virtually every domain—including scientific creativity, general wisdom, and social skills.',
      ],
      bullets: [
        'Surpasses human cognitive abilities in ALL important respects',
        'Can autonomously improve its own capabilities',
        'Typically assumed to arise from or after AGI',
        'The regime where AI-driven change could become exponential',
      ],
    },
  },
  {
    id: 'singularity',
    label: 'The Singularity',
    content: {
      title: 'A Phase Change, Not a Capability',
      paragraphs: [
        'The technological singularity is a hypothetical point when AI-driven technological growth becomes uncontrollable and irreversible, leading to profound and unpredictable changes in civilization.',
      ],
      bullets: [
        'Tied to an "intelligence explosion" via positive feedback loops',
        'AI improving its own intelligence rapidly jumps to superintelligence',
        'Existing social, economic, and political models break down as predictive tools',
        'The macro-level transition that occurs when progress outpaces human comprehension',
      ],
    },
  },
  {
    id: 'sequence',
    label: 'The Sequence',
    content: {
      title: 'Order of Events',
      paragraphs: [
        'In most mainstream narratives, the conceptual order is: Advanced Narrow AI → AGI → Intelligence Explosion → ASI → Singularity as the societal transition.',
      ],
      bullets: [
        '① Advanced Narrow AI: Current LLMs, vision models, code models (where we are now)',
        '② AGI: First broadly human-level system that can automate most intellectual work',
        '③ Intelligence Explosion: Recursive improvement compresses decades of R&D into months',
        '④ ASI: Systems vastly beyond humans, emerging from rapid feedback loop',
        '⑤ Singularity: Period where change is too rapid for traditional forecasting',
      ],
    },
  },
  {
    id: 'timelines',
    label: 'Timelines',
    content: {
      title: 'How Long Until Singularity?',
      paragraphs: [
        'Expert surveys typically suggest AGI first, with uncertain gaps to superintelligence—ranging from a couple of years to a few decades.',
      ],
      bullets: [
        'Many timelines treat singularity as occurring shortly after AGI',
        'If intelligence explosion happens, the gap could be weeks to months',
        'Key uncertainty: Will recursive self-improvement actually work?',
        'Median expert prediction for AGI: late 2020s to 2030s',
        'Singularity often estimated within years to a few decades after AGI',
      ],
    },
  },
  {
    id: 'parameters',
    label: 'Parameters',
    content: {
      title: 'Understanding the Tweakable Parameters',
      paragraphs: [
        'Each slider adjusts factors that accelerate (+) or delay (-) AI development. These represent the key variables experts consider when forecasting AI timelines.',
      ],
      categories: [
        {
          icon: '🚀',
          name: 'Development Factors',
          color: '#00f0ff',
          items: [
            { name: 'AI R&D Investment', desc: 'Global funding for AI research—more money = faster progress' },
            { name: 'Compute Scaling', desc: 'GPU/TPU hardware advancement—faster chips = bigger models' },
            { name: 'Algorithmic Progress', desc: 'Architecture breakthroughs (like Transformers)—efficiency gains' },
            { name: 'Data Availability', desc: 'Quality and scale of training data—more data = better models' },
          ],
        },
        {
          icon: '⚡',
          name: 'Competition Factors',
          color: '#f97316',
          items: [
            { name: 'Geopolitical Race', desc: 'US-China competition intensity—higher = faster but riskier' },
            { name: 'Talent Concentration', desc: 'Where top researchers work—concentration speeds progress' },
            { name: 'Corporate Competition', desc: 'OpenAI/Google/Anthropic race—competition accelerates timelines' },
            { name: 'Energy Infrastructure', desc: 'Power & datacenter capacity—enables larger training runs' },
          ],
        },
        {
          icon: '🛡️',
          name: 'Safety & Governance',
          color: '#22c55e',
          items: [
            { name: 'AI Safety Research', desc: 'Alignment R&D funding—more = slower but safer development' },
            { name: 'Alignment Progress', desc: 'Technical alignment breakthroughs—increases safety margin' },
            { name: 'Government Regulation', desc: 'Oversight & restrictions—can slow or redirect development' },
            { name: 'International Coordination', desc: 'Global AI governance treaties—coordination → slower race' },
          ],
        },
        {
          icon: '🎲',
          name: 'Wildcards',
          color: '#8b5cf6',
          items: [
            { name: 'Economic Pressure', desc: 'Market demand for AI—high demand accelerates deployment' },
            { name: 'Public Sentiment', desc: 'Social acceptance level—affects regulation and funding' },
            { name: 'Black Swan Events', desc: 'Unexpected disruptions (wars, breakthroughs, disasters)' },
          ],
        },
      ],
    },
  },
];

