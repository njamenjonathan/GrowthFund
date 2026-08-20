import {
  FaqItem,
  InvestmentOpportunity,
  PortfolioHolding,
  Transaction,
  UserProfile,
} from '../types';

/**
 * Illustrative sample data for the GrowthFund prototype.
 *
 * Sponsors, escrow agents and partners are deliberately generic role
 * descriptions rather than the names of real banks, auditors or
 * regulators: this is a demo, and naming real institutions as partners
 * would misrepresent relationships that do not exist.
 */

export const INITIAL_USER: UserProfile = {
  name: 'Jean-Marc Kamga',
  email: 'jean.kamga@example.com',
  initials: 'JK',
  accountNumber: 'GF-XAF-904128',
  kycTier: 'Tier 1 Verified',
  isKycApproved: true,
  walletBalance: 425_000,
  totalInvested: 6_500_000,
  totalReturns: 580_000,
  activeInvestmentsCount: 3,
  joinedDate: '2024-03-04',
  referralCode: 'GROWTH-XAF772',
  referralCount: 4,
  referralEarnings: 4_000,
  referredFriends: [
    { id: 'ref-1', name: 'Amina Diallo', email: 'amina.d***@example.com', date: '2024-10-14', bonus: 1_000, status: 'Bonus Paid' },
    { id: 'ref-2', name: 'Koffi Mensah', email: 'koffi.m***@example.com', date: '2024-10-02', bonus: 1_000, status: 'Bonus Paid' },
    { id: 'ref-3', name: 'Fatou Sow', email: 'fatou.s***@example.com', date: '2024-09-19', bonus: 1_000, status: 'Bonus Paid' },
    { id: 'ref-4', name: 'Christian Nguema', email: 'c.nguema***@example.com', date: '2024-09-05', bonus: 1_000, status: 'Bonus Paid' },
  ],
};

export const PORTFOLIO_CHART_DATA = [
  { monthKey: 'jan', value: 4_500_000, returns: 65_000, projected: false },
  { monthKey: 'feb', value: 4_750_000, returns: 115_000, projected: false },
  { monthKey: 'mar', value: 5_100_000, returns: 180_000, projected: false },
  { monthKey: 'apr', value: 5_450_000, returns: 250_000, projected: false },
  { monthKey: 'may', value: 5_800_000, returns: 320_000, projected: false },
  { monthKey: 'jun', value: 6_050_000, returns: 395_000, projected: false },
  { monthKey: 'jul', value: 6_300_000, returns: 485_000, projected: false },
  { monthKey: 'aug', value: 6_500_000, returns: 580_000, projected: false },
  { monthKey: 'sep', value: 6_850_000, returns: 670_000, projected: true },
  { monthKey: 'oct', value: 7_200_000, returns: 765_000, projected: true },
  { monthKey: 'nov', value: 7_600_000, returns: 870_000, projected: true },
  { monthKey: 'dec', value: 8_050_000, returns: 980_000, projected: true },
];

export const MONTH_LABELS: Record<string, { en: string; fr: string }> = {
  jan: { en: 'Jan', fr: 'janv.' },
  feb: { en: 'Feb', fr: 'févr.' },
  mar: { en: 'Mar', fr: 'mars' },
  apr: { en: 'Apr', fr: 'avr.' },
  may: { en: 'May', fr: 'mai' },
  jun: { en: 'Jun', fr: 'juin' },
  jul: { en: 'Jul', fr: 'juil.' },
  aug: { en: 'Aug', fr: 'août' },
  sep: { en: 'Sep', fr: 'sept.' },
  oct: { en: 'Oct', fr: 'oct.' },
  nov: { en: 'Nov', fr: 'nov.' },
  dec: { en: 'Dec', fr: 'déc.' },
};

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    id: 'hold-1',
    opportunityId: 'opp-solar-sahel',
    opportunityTitle: { en: 'Sahel Solar Generation Facility', fr: 'Centrale solaire du Sahel' },
    category: 'Energy',
    investedAmount: 2_500_000,
    currentValue: 2_715_000,
    totalReturnsEarned: 215_000,
    projectedReturnRate: 9.8,
    investedDate: '2024-04-12',
    maturityDate: '2028-04-12',
    nextDistributionDate: '2026-12-15',
    status: 'Active',
    riskLevel: 'Medium',
  },
  {
    id: 'hold-2',
    opportunityId: 'opp-agritech',
    opportunityTitle: { en: 'Vertical Farming Expansion — Phase II', fr: 'Extension de ferme verticale — phase II' },
    category: 'Agriculture',
    investedAmount: 2_000_000,
    currentValue: 2_186_000,
    totalReturnsEarned: 186_000,
    projectedReturnRate: 9.4,
    investedDate: '2024-06-03',
    maturityDate: '2028-06-03',
    nextDistributionDate: '2027-01-31',
    status: 'Active',
    riskLevel: 'Medium',
  },
  {
    id: 'hold-3',
    opportunityId: 'opp-commercial-hub',
    opportunityTitle: { en: 'Downtown Commercial Hub', fr: 'Pôle commercial du centre-ville' },
    category: 'Real Estate',
    investedAmount: 2_000_000,
    currentValue: 2_179_000,
    totalReturnsEarned: 179_000,
    projectedReturnRate: 8.9,
    investedDate: '2024-07-22',
    maturityDate: '2029-07-22',
    nextDistributionDate: '2026-12-31',
    status: 'Active',
    riskLevel: 'Low',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    date: '2026-08-01',
    type: 'Return Distribution',
    projectName: { en: 'Sahel Solar Generation Facility', fr: 'Centrale solaire du Sahel' },
    amount: 61_250,
    status: 'Completed',
    referenceId: 'GF-TX-884201',
  },
  {
    id: 'tx-2',
    date: '2026-07-22',
    type: 'Deposit',
    projectName: { en: 'MTN Mobile Money deposit', fr: 'Dépôt MTN Mobile Money' },
    amount: 150_000,
    status: 'Completed',
    referenceId: 'GF-DEP-771933',
  },
  {
    id: 'tx-3',
    date: '2026-07-15',
    type: 'Referral Bonus',
    projectName: { en: 'Referral bonus — Amina Diallo', fr: 'Bonus de parrainage — Amina Diallo' },
    amount: 1_000,
    status: 'Completed',
    referenceId: 'GF-REF-559120',
  },
  {
    id: 'tx-4',
    date: '2026-07-04',
    type: 'Withdrawal',
    projectName: { en: 'Orange Money cash-out', fr: 'Retrait Orange Money' },
    amount: 50_000,
    status: 'Completed',
    referenceId: 'GF-WTH-330184',
  },
  {
    id: 'tx-5',
    date: '2026-06-28',
    type: 'Return Distribution',
    projectName: { en: 'Downtown Commercial Hub', fr: 'Pôle commercial du centre-ville' },
    amount: 44_500,
    status: 'Completed',
    referenceId: 'GF-TX-771002',
  },
  {
    id: 'tx-6',
    date: '2024-07-22',
    type: 'Investment',
    projectName: { en: 'Downtown Commercial Hub', fr: 'Pôle commercial du centre-ville' },
    amount: 2_000_000,
    status: 'Completed',
    referenceId: 'GF-TX-119045',
  },
];

const FEE_STRUCTURE = {
  en: 'GrowthFund charges a 0.50% annual administration fee, deducted from gross distributions. There is no investor transaction fee on cash in or cash out.',
  fr: "GrowthFund prélève des frais d'administration annuels de 0,50 %, déduits des distributions brutes. Aucun frais de transaction n'est facturé à l'investisseur sur les dépôts et retraits.",
};

export const OPPORTUNITIES: InvestmentOpportunity[] = [
  {
    id: 'opp-solar-sahel',
    title: { en: 'Sahel Solar Generation Facility', fr: 'Centrale solaire du Sahel' },
    tagline: {
      en: 'Utility-scale solar generation backed by a 15-year power purchase agreement.',
      fr: "Production solaire à l'échelle réseau, adossée à un contrat d'achat d'électricité de 15 ans.",
    },
    category: 'Energy',
    location: { en: 'Sahel clean power corridor', fr: 'Corridor énergétique du Sahel' },
    riskLevel: 'Medium',
    minInvestment: 25_000,
    fundingGoal: 450_000_000,
    amountRaised: 345_000_000,
    investorsCount: 412,
    projectedReturnMin: 8.5,
    projectedReturnMax: 10.2,
    durationYears: { en: '3–5 years', fr: '3 à 5 ans' },
    durationCategory: '3-5 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 18,
    tags: [
      { en: 'solar', fr: 'solaire' },
      { en: 'renewable energy', fr: 'énergie renouvelable' },
      { en: 'power purchase agreement', fr: "contrat d'achat d'électricité" },
    ],
    sponsor: { en: 'Regional clean power developer', fr: "Développeur régional d'énergie propre" },
    sponsorNote: {
      en: 'An independent power producer with operating solar and hybrid assets across the region, financed on a project-by-project basis.',
      fr: "Producteur indépendant d'électricité exploitant des actifs solaires et hybrides dans la région, financés projet par projet.",
    },
    securityStructure: { en: 'Senior asset-backed note', fr: 'Obligation senior adossée à des actifs' },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'A utility-scale solar generation facility engineered for reliable baseload clean energy, underpinned by a 15-year power purchase agreement with regional industrial off-takers. Capital raised funds the final photovoltaic deployment and the grid interconnection.',
      fr: "Centrale solaire à l'échelle réseau conçue pour fournir une énergie propre de base fiable, soutenue par un contrat d'achat d'électricité de 15 ans avec des industriels régionaux. Les fonds levés financent le déploiement photovoltaïque final et le raccordement au réseau.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'The plant combines bifacial monocrystalline panels with single-axis tracking, targeting a high operating yield across long-term contracted offtake.',
        fr: "La centrale associe des panneaux monocristallins bifaciaux à un suivi mono-axe, visant un rendement d'exploitation élevé sur un débouché contracté à long terme.",
      },
      marketOpportunity: {
        en: 'Industrial power demand across the regional economic corridors is growing steadily, and buyers are actively seeking reliable, lower-carbon supply.',
        fr: "La demande industrielle d'électricité progresse régulièrement dans les corridors économiques régionaux, et les acheteurs recherchent activement une offre fiable et moins carbonée.",
      },
      useOfProceeds: [
        { label: { en: 'Photovoltaic hardware and inverters', fr: 'Matériel photovoltaïque et onduleurs' }, percentage: 55 },
        { label: { en: 'Civil works and substation interconnect', fr: 'Génie civil et raccordement au poste' }, percentage: 25 },
        { label: { en: 'Working capital and contingency reserve', fr: 'Fonds de roulement et réserve pour imprévus' }, percentage: 12 },
        { label: { en: 'Environmental and legal compliance', fr: 'Conformité environnementale et juridique' }, percentage: 8 },
      ],
      milestones: [
        { date: '2024-03-01', title: { en: 'Environmental permitting and land lease secured', fr: "Autorisations environnementales et bail foncier obtenus" }, completed: true },
        { date: '2024-09-01', title: { en: 'Power offtake agreement executed', fr: "Contrat d'achat d'électricité signé" }, completed: true },
        { date: '2026-03-01', title: { en: 'Civil works and substation construction', fr: 'Génie civil et construction du poste' }, completed: false },
        { date: '2026-09-01', title: { en: 'Commercial operations and first distribution', fr: 'Mise en service et première distribution' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Revenue is contracted under fixed multi-year tariffs. Distributions are paid quarterly after statutory reserve allocations.',
        fr: "Les revenus sont contractés selon des tarifs fixes pluriannuels. Les distributions sont versées trimestriellement après dotation des réserves légales.",
      },
      metrics: [
        { year: '2026', revenue: 125_000_000, netOperatingIncome: 94_000_000, projectedDistribution: 8.5 },
        { year: '2027', revenue: 160_000_000, netOperatingIncome: 124_000_000, projectedDistribution: 9.2 },
        { year: '2028', revenue: 175_000_000, netOperatingIncome: 138_000_000, projectedDistribution: 9.8 },
        { year: '2029', revenue: 190_000_000, netOperatingIncome: 150_000_000, projectedDistribution: 10.2 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Offtaker credit risk', fr: 'Risque de crédit de l’acheteur' },
        severity: 'Medium',
        description: {
          en: 'Distributions depend on industrial buyers paying for contracted power on time. A default or payment delay would directly reduce investor cash flow.',
          fr: "Les distributions dépendent du paiement ponctuel de l'électricité contractée par les acheteurs industriels. Un défaut ou un retard réduirait directement les flux versés aux investisseurs.",
        },
        mitigation: {
          en: 'Offtake is spread across several buyers, and the agreement includes a payment security deposit covering three months of invoicing.',
          fr: "Le débouché est réparti entre plusieurs acheteurs et le contrat prévoit un dépôt de garantie couvrant trois mois de facturation.",
        },
      },
      {
        category: { en: 'Construction and grid delay', fr: 'Retard de construction et de raccordement' },
        severity: 'Medium',
        description: {
          en: 'Substation interconnection depends on a third-party grid operator. Delays would push back the first distribution date.',
          fr: "Le raccordement au poste dépend d'un gestionnaire de réseau tiers. Un retard décalerait la date de la première distribution.",
        },
        mitigation: {
          en: 'The construction contract carries liquidated damages for late delivery, and a contingency reserve funds a delay of up to six months.',
          fr: "Le contrat de construction prévoit des pénalités de retard et une réserve pour imprévus couvre jusqu'à six mois de décalage.",
        },
      },
      {
        category: { en: 'Resource and output variance', fr: 'Variabilité de la ressource et de la production' },
        severity: 'Low',
        description: {
          en: 'Actual irradiation, soiling and equipment degradation may deliver less energy than the production model assumes.',
          fr: "L'irradiation réelle, l'encrassement et la dégradation des équipements peuvent produire moins d'énergie que ne le suppose le modèle.",
        },
        mitigation: {
          en: 'Yield assumptions use a conservative P90 production case, with a scheduled cleaning and maintenance contract in place.',
          fr: "Les hypothèses de rendement retiennent un scénario P90 prudent, assorti d'un contrat de nettoyage et de maintenance programmés.",
        },
      },
    ],
    documents: [
      { id: 'doc-s1', name: { en: 'Offering memorandum', fr: "Note d'information" }, type: 'PDF', size: '4.2 MB', date: '2024-10-01' },
      { id: 'doc-s2', name: { en: 'Independent engineering report', fr: "Rapport d'ingénierie indépendant" }, type: 'PDF', size: '2.8 MB', date: '2024-09-01' },
      { id: 'doc-s3', name: { en: 'Power purchase agreement summary', fr: "Synthèse du contrat d'achat d'électricité" }, type: 'PDF', size: '1.5 MB', date: '2024-08-01' },
      { id: 'doc-s4', name: { en: 'Escrow and trust agreement', fr: 'Convention de séquestre et de fiducie' }, type: 'PDF', size: '890 KB', date: '2024-10-01' },
    ],
  },

  {
    id: 'opp-agritech',
    title: { en: 'Vertical Farming Expansion — Phase II', fr: 'Extension de ferme verticale — phase II' },
    tagline: {
      en: 'Controlled-environment agriculture using 95% less water, supplying urban supermarkets.',
      fr: "Agriculture en environnement contrôlé consommant 95 % d'eau en moins, approvisionnant les supermarchés urbains.",
    },
    category: 'Agriculture',
    location: { en: 'Abidjan agro-industrial park', fr: "Parc agro-industriel d'Abidjan" },
    riskLevel: 'Medium',
    minInvestment: 25_000,
    fundingGoal: 300_000_000,
    amountRaised: 235_000_000,
    investorsCount: 328,
    projectedReturnMin: 8.5,
    projectedReturnMax: 10.2,
    durationYears: { en: '3–5 years', fr: '3 à 5 ans' },
    durationCategory: '3-5 years',
    distributionFrequency: 'Semi-Annually',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 24,
    tags: [
      { en: 'agriculture', fr: 'agriculture' },
      { en: 'hydroponics', fr: 'hydroponie' },
      { en: 'food supply', fr: 'chaîne alimentaire' },
    ],
    sponsor: { en: 'Controlled-environment agriculture operator', fr: "Exploitant d'agriculture en milieu contrôlé" },
    sponsorNote: {
      en: 'An operator running a profitable first-phase indoor growing facility, expanding capacity against signed retail supply agreements.',
      fr: "Exploitant d'une première unité de culture en intérieur déjà rentable, augmentant sa capacité sur la base de contrats de distribution signés.",
    },
    securityStructure: { en: 'Secured preferred equity', fr: 'Actions de préférence garanties' },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'Expansion of a high-technology indoor hydroponic facility producing vegetables and premium crops year-round under climate control, with no pesticide use and a fraction of the water demand of open-field farming.',
      fr: "Extension d'une unité hydroponique de haute technologie produisant toute l'année légumes et cultures premium sous climat contrôlé, sans pesticides et avec une fraction de la consommation d'eau de la culture en plein champ.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'Controlled agriculture removes drought exposure and raises crop rotation frequency through automated sensing and tuned LED lighting.',
        fr: "L'agriculture contrôlée supprime l'exposition à la sécheresse et augmente la fréquence des rotations grâce à des capteurs automatisés et un éclairage LED calibré.",
      },
      marketOpportunity: {
        en: 'Urban retail food markets demand clean, high-grade local produce with guaranteed freshness and stable pricing year-round.',
        fr: "Les marchés alimentaires urbains recherchent des produits locaux propres et de qualité, à fraîcheur garantie et prix stables toute l'année.",
      },
      useOfProceeds: [
        { label: { en: 'Automated hydroponic racks and sensors', fr: 'Racks hydroponiques automatisés et capteurs' }, percentage: 50 },
        { label: { en: 'Climate control and cold-chain logistics', fr: 'Climatisation et logistique du froid' }, percentage: 28 },
        { label: { en: 'Packing facility and distribution fleet', fr: 'Unité de conditionnement et flotte de distribution' }, percentage: 14 },
        { label: { en: 'Working capital and safety reserve', fr: 'Fonds de roulement et réserve de sécurité' }, percentage: 8 },
      ],
      milestones: [
        { date: '2023-06-01', title: { en: 'Phase I facility operational and profitable', fr: 'Unité de phase I opérationnelle et rentable' }, completed: true },
        { date: '2024-11-01', title: { en: 'Warehouse lease and engineering executed', fr: "Bail d'entrepôt et ingénierie signés" }, completed: true },
        { date: '2026-05-01', title: { en: 'Hydroponic fit-out and first planting', fr: 'Aménagement hydroponique et première plantation' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Phase I generates steady cash flow. Phase II expands production capacity to meet contracted supermarket demand.',
        fr: "La phase I génère des flux de trésorerie réguliers. La phase II augmente la capacité de production pour répondre à la demande contractée des supermarchés.",
      },
      metrics: [
        { year: '2026', revenue: 180_000_000, netOperatingIncome: 68_000_000, projectedDistribution: 8.5 },
        { year: '2027', revenue: 290_000_000, netOperatingIncome: 115_000_000, projectedDistribution: 9.4 },
        { year: '2028', revenue: 360_000_000, netOperatingIncome: 148_000_000, projectedDistribution: 10.2 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Crop yield and biological risk', fr: 'Rendement des cultures et risque biologique' },
        severity: 'Medium',
        description: {
          en: 'Disease, nutrient imbalance or equipment failure inside a sealed growing environment can affect an entire harvest cycle.',
          fr: "Une maladie, un déséquilibre nutritif ou une panne d'équipement dans un environnement de culture fermé peut affecter tout un cycle de récolte.",
        },
        mitigation: {
          en: 'Growing zones are compartmentalised so a failure is contained, and the facility carries redundant climate and irrigation systems.',
          fr: "Les zones de culture sont compartimentées pour contenir toute défaillance, et l'unité dispose de systèmes de climatisation et d'irrigation redondants.",
        },
      },
      {
        category: { en: 'Buyer concentration', fr: 'Concentration des acheteurs' },
        severity: 'Medium',
        description: {
          en: 'A large share of output is committed to a small number of retail chains. Losing one would materially reduce revenue.',
          fr: "Une part importante de la production est engagée auprès d'un petit nombre d'enseignes. En perdre une réduirait sensiblement le chiffre d'affaires.",
        },
        mitigation: {
          en: 'Supply agreements carry minimum volume commitments, and the operator is adding hospitality and wholesale channels.',
          fr: "Les contrats d'approvisionnement comportent des engagements de volume minimum, et l'exploitant développe les circuits hôtellerie et gros.",
        },
      },
      {
        category: { en: 'Energy cost exposure', fr: "Exposition au coût de l'énergie" },
        severity: 'High',
        description: {
          en: 'Indoor growing is energy intensive. A sustained rise in electricity tariffs would compress operating margin and distributions.',
          fr: "La culture en intérieur est énergivore. Une hausse durable des tarifs de l'électricité comprimerait la marge d'exploitation et les distributions.",
        },
        mitigation: {
          en: 'Rooftop solar covers part of daytime load, and supply agreements permit an indexed price adjustment if tariffs move sharply.',
          fr: "Le solaire en toiture couvre une partie de la charge diurne, et les contrats autorisent une indexation des prix en cas de forte variation des tarifs.",
        },
      },
    ],
    documents: [
      { id: 'doc-a1', name: { en: 'Phase II offering memorandum', fr: "Note d'information phase II" }, type: 'PDF', size: '3.6 MB', date: '2024-09-01' },
      { id: 'doc-a2', name: { en: 'Retail supply agreements', fr: "Contrats d'approvisionnement des enseignes" }, type: 'PDF', size: '1.9 MB', date: '2024-08-01' },
    ],
  },

  {
    id: 'opp-commercial-hub',
    title: { en: 'Downtown Commercial Hub', fr: 'Pôle commercial du centre-ville' },
    tagline: {
      en: 'Grade-A offices and banking halls, 72% pre-leased to established corporate tenants.',
      fr: 'Bureaux de premier rang et agences bancaires, pré-loués à 72 % à des entreprises établies.',
    },
    category: 'Real Estate',
    location: { en: 'Douala central business district', fr: "Quartier des affaires de Douala" },
    riskLevel: 'Low',
    minInvestment: 50_000,
    fundingGoal: 800_000_000,
    amountRaised: 612_000_000,
    investorsCount: 587,
    projectedReturnMin: 7.8,
    projectedReturnMax: 9.4,
    durationYears: { en: '5+ years', fr: '5 ans et plus' },
    durationCategory: '5+ years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: true,
    daysLeft: 31,
    tags: [
      { en: 'real estate', fr: 'immobilier' },
      { en: 'commercial property', fr: 'immobilier commercial' },
      { en: 'rental income', fr: 'revenus locatifs' },
    ],
    sponsor: { en: 'Commercial property developer', fr: 'Promoteur immobilier commercial' },
    sponsorNote: {
      en: 'A developer with completed office and mixed-use assets in the same district, holding long-term leases with corporate tenants.',
      fr: "Promoteur disposant d'actifs de bureaux et mixtes livrés dans le même quartier, avec des baux long terme auprès de locataires d'entreprise.",
    },
    securityStructure: { en: 'First-rank mortgage-backed note', fr: 'Obligation garantie par hypothèque de premier rang' },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'A premium commercial hub combining modern offices, banking halls and secure transit warehousing. 72% of lettable area is pre-leased to regional and multinational tenants on long-term agreements.',
      fr: "Pôle commercial haut de gamme réunissant bureaux modernes, agences bancaires et entrepôts de transit sécurisés. 72 % de la surface locative est pré-louée à des locataires régionaux et multinationaux sous baux de longue durée.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'Rental income is contracted in advance across a diversified tenant base, with the building superstructure already complete.',
        fr: "Les revenus locatifs sont contractés à l'avance auprès d'une base de locataires diversifiée, la structure du bâtiment étant déjà achevée.",
      },
      marketOpportunity: {
        en: 'Grade-A office supply in the central business district remains constrained while corporate demand for modern, serviced space keeps growing.',
        fr: "L'offre de bureaux de premier rang dans le quartier des affaires reste limitée, tandis que la demande d'entreprises pour des espaces modernes et équipés continue de croître.",
      },
      useOfProceeds: [
        { label: { en: 'Interior fit-out and building services', fr: 'Aménagement intérieur et lots techniques' }, percentage: 46 },
        { label: { en: 'Facade, glazing and roofing', fr: 'Façade, vitrage et couverture' }, percentage: 24 },
        { label: { en: 'Power backup and security systems', fr: 'Alimentation de secours et systèmes de sécurité' }, percentage: 18 },
        { label: { en: 'Leasing costs and reserve', fr: 'Frais de commercialisation et réserve' }, percentage: 12 },
      ],
      milestones: [
        { date: '2024-06-01', title: { en: 'Building superstructure completed', fr: 'Structure du bâtiment achevée' }, completed: true },
        { date: '2024-12-01', title: { en: 'Anchor tenant leases finalised (72%)', fr: 'Baux des locataires de référence finalisés (72 %)' }, completed: true },
        { date: '2026-06-01', title: { en: 'Handover and start of rental income', fr: 'Livraison et démarrage des revenus locatifs' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Distributions are funded from contracted rent, net of service charges, management costs and a maintenance reserve.',
        fr: "Les distributions proviennent des loyers contractés, nets des charges, des frais de gestion et d'une réserve d'entretien.",
      },
      metrics: [
        { year: '2026', revenue: 210_000_000, netOperatingIncome: 152_000_000, projectedDistribution: 7.8 },
        { year: '2027', revenue: 268_000_000, netOperatingIncome: 196_000_000, projectedDistribution: 8.6 },
        { year: '2028', revenue: 295_000_000, netOperatingIncome: 218_000_000, projectedDistribution: 9.4 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Letting and vacancy risk', fr: 'Risque de commercialisation et de vacance' },
        severity: 'Medium',
        description: {
          en: '28% of lettable area is not yet leased. Slower letting than modelled would reduce rental income and delay full distributions.',
          fr: "28 % de la surface locative n'est pas encore louée. Une commercialisation plus lente que prévu réduirait les loyers et retarderait les distributions complètes.",
        },
        mitigation: {
          en: 'The model assumes an 18-month letting period for the remaining space, and anchor leases alone cover debt service.',
          fr: "Le modèle retient une période de commercialisation de 18 mois pour le solde, et les baux de référence couvrent à eux seuls le service de la dette.",
        },
      },
      {
        category: { en: 'Completion and cost overrun', fr: "Achèvement et dépassement de coûts" },
        severity: 'Low',
        description: {
          en: 'Fit-out costs could exceed budget, requiring additional capital or reducing the distributable surplus.',
          fr: "Les coûts d'aménagement pourraient dépasser le budget, exigeant un apport supplémentaire ou réduisant l'excédent distribuable.",
        },
        mitigation: {
          en: 'The main works contract is fixed-price, and the structure is already complete, which removes the largest cost variable.',
          fr: "Le marché principal est à prix ferme et la structure est déjà achevée, ce qui supprime la principale variable de coût.",
        },
      },
      {
        category: { en: 'Property valuation risk', fr: 'Risque de valorisation' },
        severity: 'Medium',
        description: {
          en: 'The exit value at maturity depends on commercial property yields, which may be less favourable than they are today.',
          fr: "La valeur de sortie à l'échéance dépend des taux de rendement immobiliers, qui peuvent être moins favorables qu'aujourd'hui.",
        },
        mitigation: {
          en: 'Investor returns are driven mainly by contracted rent rather than capital appreciation, and the note is secured by a first-rank mortgage.',
          fr: "Le rendement investisseur repose surtout sur les loyers contractés plutôt que sur la plus-value, et l'obligation est garantie par une hypothèque de premier rang.",
        },
      },
    ],
    documents: [
      { id: 'doc-c1', name: { en: 'Placement memorandum', fr: 'Note de placement' }, type: 'PDF', size: '5.1 MB', date: '2024-08-01' },
      { id: 'doc-c2', name: { en: 'Independent property appraisal', fr: 'Expertise immobilière indépendante' }, type: 'PDF', size: '8.4 MB', date: '2024-07-01' },
      { id: 'doc-c3', name: { en: 'Anchor lease schedule', fr: 'État des baux de référence' }, type: 'PDF', size: '1.2 MB', date: '2024-12-01' },
    ],
  },

  {
    id: 'opp-battery-storage',
    title: { en: 'Battery Storage & Solar Substation', fr: 'Stockage par batteries et poste solaire' },
    tagline: {
      en: 'Solar capacity paired with lithium storage, supplying power at peak evening demand.',
      fr: 'Capacité solaire couplée à un stockage lithium, fournissant de l’électricité en pointe du soir.',
    },
    category: 'Infrastructure',
    location: { en: 'Northern grid interconnect', fr: 'Interconnexion du réseau nord' },
    riskLevel: 'Medium',
    minInvestment: 50_000,
    fundingGoal: 620_000_000,
    amountRaised: 291_000_000,
    investorsCount: 214,
    projectedReturnMin: 10.5,
    projectedReturnMax: 12.4,
    durationYears: { en: '5+ years', fr: '5 ans et plus' },
    durationCategory: '5+ years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: false,
    daysLeft: 42,
    tags: [
      { en: 'battery storage', fr: 'stockage par batteries' },
      { en: 'infrastructure', fr: 'infrastructure' },
      { en: 'peak power', fr: 'électricité de pointe' },
    ],
    sponsor: { en: 'Grid infrastructure developer', fr: "Développeur d'infrastructures réseau" },
    sponsorNote: {
      en: 'A developer specialising in grid-connected storage, with interconnection approval already granted for this site.',
      fr: "Développeur spécialisé dans le stockage raccordé au réseau, disposant déjà de l'autorisation de raccordement pour ce site.",
    },
    securityStructure: { en: 'Senior secured infrastructure note', fr: "Obligation d'infrastructure senior garantie" },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'This project pairs 40 MW of solar capacity with lithium battery storage so that generated energy can be dispatched during the evening demand peak, when contracted wholesale tariffs are at their highest.',
      fr: "Ce projet associe 40 MW de capacité solaire à un stockage par batteries lithium afin de restituer l'énergie produite pendant la pointe de demande du soir, lorsque les tarifs de gros contractés sont les plus élevés.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'Storage lets the plant sell into the highest-tariff window rather than the midday surplus, materially improving revenue per megawatt installed.',
        fr: "Le stockage permet de vendre sur la fenêtre tarifaire la plus élevée plutôt que sur le surplus de midi, améliorant nettement le revenu par mégawatt installé.",
      },
      marketOpportunity: {
        en: 'Evening peak demand is currently met by expensive thermal generation, leaving a clear pricing gap for dispatchable renewable supply.',
        fr: "La pointe du soir est aujourd'hui couverte par une production thermique coûteuse, laissant un écart de prix net pour une offre renouvelable pilotable.",
      },
      useOfProceeds: [
        { label: { en: 'Battery storage system', fr: 'Système de stockage par batteries' }, percentage: 48 },
        { label: { en: 'Solar array and inverters', fr: 'Champ solaire et onduleurs' }, percentage: 30 },
        { label: { en: 'Substation and grid works', fr: 'Poste et travaux de raccordement' }, percentage: 14 },
        { label: { en: 'Contingency reserve', fr: 'Réserve pour imprévus' }, percentage: 8 },
      ],
      milestones: [
        { date: '2024-03-01', title: { en: 'Grid interconnection approval', fr: 'Autorisation de raccordement au réseau' }, completed: true },
        { date: '2024-09-01', title: { en: 'Storage equipment supply contract signed', fr: "Contrat de fourniture des équipements de stockage signé" }, completed: true },
        { date: '2026-10-01', title: { en: 'Installation and commissioning', fr: 'Installation et mise en service' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Revenue combines a contracted capacity payment with energy sales into the peak tariff window.',
        fr: "Les revenus combinent une rémunération de capacité contractée et des ventes d'énergie sur la fenêtre tarifaire de pointe.",
      },
      metrics: [
        { year: '2027', revenue: 148_000_000, netOperatingIncome: 108_000_000, projectedDistribution: 10.5 },
        { year: '2028', revenue: 196_000_000, netOperatingIncome: 146_000_000, projectedDistribution: 11.6 },
        { year: '2029', revenue: 214_000_000, netOperatingIncome: 162_000_000, projectedDistribution: 12.4 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Battery degradation', fr: 'Dégradation des batteries' },
        severity: 'Medium',
        description: {
          en: 'Storage capacity falls with each charge cycle. Faster-than-modelled degradation would reduce dispatchable energy and revenue.',
          fr: "La capacité de stockage diminue à chaque cycle. Une dégradation plus rapide que prévu réduirait l'énergie restituable et les revenus.",
        },
        mitigation: {
          en: 'The supply contract includes a capacity retention warranty, and the financial model assumes a mid-life cell replacement.',
          fr: "Le contrat de fourniture comprend une garantie de rétention de capacité, et le modèle financier intègre un remplacement des cellules à mi-vie.",
        },
      },
      {
        category: { en: 'Tariff and regulatory change', fr: 'Évolution tarifaire et réglementaire' },
        severity: 'High',
        description: {
          en: 'Peak-window pricing is set by regulation. A change to the tariff structure would directly affect the revenue case.',
          fr: "Le prix de la fenêtre de pointe est fixé par la réglementation. Une modification de la structure tarifaire affecterait directement le modèle de revenus.",
        },
        mitigation: {
          en: 'A contracted capacity payment covers fixed costs independently of energy price, limiting downside to the variable component.',
          fr: "Une rémunération de capacité contractée couvre les coûts fixes indépendamment du prix de l'énergie, limitant le risque à la seule composante variable.",
        },
      },
    ],
    documents: [
      { id: 'doc-b1', name: { en: 'Infrastructure offering memorandum', fr: "Note d'information infrastructure" }, type: 'PDF', size: '4.7 MB', date: '2024-11-01' },
      { id: 'doc-b2', name: { en: 'Grid interconnection approval', fr: 'Autorisation de raccordement' }, type: 'PDF', size: '740 KB', date: '2024-03-01' },
    ],
  },

  {
    id: 'opp-datacenter',
    title: { en: 'Regional Data Centre — Tier III', fr: 'Centre de données régional — Tier III' },
    tagline: {
      en: 'Carrier-neutral colocation facility serving regional banks and telecom operators.',
      fr: "Centre de colocation neutre desservant banques et opérateurs télécoms régionaux.",
    },
    category: 'Technology',
    location: { en: 'Douala technology corridor', fr: 'Corridor technologique de Douala' },
    riskLevel: 'High',
    minInvestment: 100_000,
    fundingGoal: 950_000_000,
    amountRaised: 402_000_000,
    investorsCount: 176,
    projectedReturnMin: 12.0,
    projectedReturnMax: 14.5,
    durationYears: { en: '5+ years', fr: '5 ans et plus' },
    durationCategory: '5+ years',
    distributionFrequency: 'Semi-Annually',
    status: 'Funding Open',
    isFeatured: false,
    daysLeft: 55,
    tags: [
      { en: 'data centre', fr: 'centre de données' },
      { en: 'technology', fr: 'technologie' },
      { en: 'colocation', fr: 'colocation' },
    ],
    sponsor: { en: 'Digital infrastructure operator', fr: "Opérateur d'infrastructure numérique" },
    sponsorNote: {
      en: 'An operator running smaller colocation sites in the region, expanding into a purpose-built Tier III facility.',
      fr: "Opérateur exploitant de plus petits sites de colocation dans la région, se développant vers une installation Tier III dédiée.",
    },
    securityStructure: { en: 'Secured equipment-backed note', fr: 'Obligation garantie par nantissement des équipements' },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'A carrier-neutral Tier III colocation facility offering redundant power and cooling to regional banks, telecom operators and public institutions that currently host critical systems abroad.',
      fr: "Installation de colocation Tier III neutre offrant alimentation et refroidissement redondants aux banques, opérateurs télécoms et institutions publiques régionales qui hébergent aujourd'hui leurs systèmes critiques à l'étranger.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'Colocation revenue is contracted per rack on multi-year terms, with utilisation ramping as anchor customers migrate workloads.',
        fr: "Le revenu de colocation est contracté par baie sur plusieurs années, le taux d'occupation montant au fil de la migration des clients de référence.",
      },
      marketOpportunity: {
        en: 'Data residency requirements and latency-sensitive services are pushing regional institutions to host critical systems locally.',
        fr: "Les exigences de résidence des données et les services sensibles à la latence poussent les institutions régionales à héberger localement leurs systèmes critiques.",
      },
      useOfProceeds: [
        { label: { en: 'Power, cooling and generator plant', fr: 'Alimentation, refroidissement et groupes électrogènes' }, percentage: 42 },
        { label: { en: 'Building shell and security', fr: 'Enveloppe du bâtiment et sécurité' }, percentage: 26 },
        { label: { en: 'Network and fibre connectivity', fr: 'Réseau et connectivité fibre' }, percentage: 20 },
        { label: { en: 'Working capital and reserve', fr: 'Fonds de roulement et réserve' }, percentage: 12 },
      ],
      milestones: [
        { date: '2024-09-01', title: { en: 'Site acquisition and fibre routes secured', fr: 'Acquisition du site et tracés fibre sécurisés' }, completed: true },
        { date: '2026-04-01', title: { en: 'Shell construction and power plant', fr: 'Construction du bâtiment et centrale électrique' }, completed: false },
        { date: '2027-02-01', title: { en: 'Tier III certification and first customers', fr: 'Certification Tier III et premiers clients' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Returns are back-weighted: revenue scales with rack utilisation, which builds over the first three operating years.',
        fr: "Le rendement est décalé dans le temps : le revenu croît avec le taux d'occupation des baies, qui se constitue sur les trois premières années d'exploitation.",
      },
      metrics: [
        { year: '2027', revenue: 96_000_000, netOperatingIncome: 41_000_000, projectedDistribution: 12.0 },
        { year: '2028', revenue: 218_000_000, netOperatingIncome: 128_000_000, projectedDistribution: 13.2 },
        { year: '2029', revenue: 296_000_000, netOperatingIncome: 184_000_000, projectedDistribution: 14.5 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Utilisation ramp risk', fr: "Risque de montée en charge" },
        severity: 'High',
        description: {
          en: 'Revenue depends on filling racks to plan. Slower customer migration would delay distributions and reduce the achieved return.',
          fr: "Le revenu dépend du remplissage des baies selon le plan. Une migration client plus lente retarderait les distributions et réduirait le rendement réalisé.",
        },
        mitigation: {
          en: 'Two anchor customers have signed pre-commitments covering roughly a third of phase-one capacity.',
          fr: "Deux clients de référence ont signé des pré-engagements couvrant environ un tiers de la capacité de la première phase.",
        },
      },
      {
        category: { en: 'Power reliability and cost', fr: "Fiabilité et coût de l'alimentation" },
        severity: 'High',
        description: {
          en: 'A Tier III facility must maintain continuous power. Grid instability raises generator fuel costs and threatens service credits.',
          fr: "Une installation Tier III doit maintenir une alimentation continue. L'instabilité du réseau augmente le coût du carburant et expose à des pénalités de service.",
        },
        mitigation: {
          en: 'Redundant generators and an on-site fuel reserve are budgeted, with fuel escalation passed through in customer contracts.',
          fr: "Des groupes redondants et une réserve de carburant sur site sont budgétés, l'évolution du prix du carburant étant répercutée dans les contrats clients.",
        },
      },
      {
        category: { en: 'Technology obsolescence', fr: 'Obsolescence technologique' },
        severity: 'Medium',
        description: {
          en: 'Power density and cooling expectations change quickly, and the facility may need reinvestment before the note matures.',
          fr: "Les exigences de densité et de refroidissement évoluent vite, et l'installation pourrait nécessiter un réinvestissement avant l'échéance.",
        },
        mitigation: {
          en: 'The cooling design supports a higher density than currently required, and a capital reserve is retained from distributions.',
          fr: "La conception du refroidissement supporte une densité supérieure au besoin actuel, et une réserve d'investissement est retenue sur les distributions.",
        },
      },
    ],
    documents: [
      { id: 'doc-d1', name: { en: 'Data centre offering memorandum', fr: "Note d'information centre de données" }, type: 'PDF', size: '6.3 MB', date: '2024-12-01' },
      { id: 'doc-d2', name: { en: 'Anchor customer pre-commitments', fr: 'Pré-engagements des clients de référence' }, type: 'PDF', size: '980 KB', date: '2024-11-01' },
    ],
  },

  {
    id: 'opp-medical-clinics',
    title: { en: 'Diagnostic Clinic Network', fr: 'Réseau de cliniques de diagnostic' },
    tagline: {
      en: 'Imaging and laboratory clinics in underserved secondary cities.',
      fr: "Cliniques d'imagerie et de laboratoire dans des villes secondaires mal desservies.",
    },
    category: 'Healthcare',
    location: { en: 'Secondary cities network', fr: 'Réseau de villes secondaires' },
    riskLevel: 'Medium',
    minInvestment: 25_000,
    fundingGoal: 380_000_000,
    amountRaised: 361_000_000,
    investorsCount: 640,
    projectedReturnMin: 9.2,
    projectedReturnMax: 11.0,
    durationYears: { en: '3–5 years', fr: '3 à 5 ans' },
    durationCategory: '3-5 years',
    distributionFrequency: 'Quarterly',
    status: 'Funding Open',
    isFeatured: false,
    daysLeft: 9,
    tags: [
      { en: 'healthcare', fr: 'santé' },
      { en: 'medical imaging', fr: 'imagerie médicale' },
      { en: 'clinics', fr: 'cliniques' },
    ],
    sponsor: { en: 'Healthcare services operator', fr: 'Opérateur de services de santé' },
    sponsorNote: {
      en: 'An operator running established diagnostic clinics in two cities, replicating a proven single-site model.',
      fr: "Opérateur exploitant des cliniques de diagnostic établies dans deux villes, reproduisant un modèle mono-site éprouvé.",
    },
    securityStructure: { en: 'Secured equipment lease note', fr: 'Obligation garantie par crédit-bail d’équipements' },
    escrowAgent: { en: 'Independent escrow custodian', fr: 'Dépositaire séquestre indépendant' },
    imageUrl:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    overview: {
      en: 'Roll-out of a network of diagnostic imaging and laboratory clinics in secondary cities where patients currently travel several hours for basic scans and tests. Capital funds equipment and clinic fit-out.',
      fr: "Déploiement d'un réseau de cliniques d'imagerie et de laboratoire dans des villes secondaires où les patients parcourent aujourd'hui plusieurs heures pour des examens de base. Le capital finance les équipements et l'aménagement des cliniques.",
    },
    businessPlan: {
      executiveSummary: {
        en: 'Each clinic reaches breakeven on a predictable patient volume, and the model is replicated site by site rather than built all at once.',
        fr: "Chaque clinique atteint son point mort sur un volume de patients prévisible, et le modèle est répliqué site par site plutôt que construit d'un seul tenant.",
      },
      marketOpportunity: {
        en: 'Diagnostic capacity outside the largest cities is thin, and demand is supported by both private payers and insurance schemes.',
        fr: "La capacité de diagnostic hors des grandes villes est faible, et la demande est soutenue à la fois par les payeurs privés et les régimes d'assurance.",
      },
      useOfProceeds: [
        { label: { en: 'Imaging and laboratory equipment', fr: "Équipements d'imagerie et de laboratoire" }, percentage: 58 },
        { label: { en: 'Clinic fit-out and power backup', fr: 'Aménagement des cliniques et alimentation de secours' }, percentage: 22 },
        { label: { en: 'Clinical staffing and training', fr: 'Personnel clinique et formation' }, percentage: 12 },
        { label: { en: 'Working capital', fr: 'Fonds de roulement' }, percentage: 8 },
      ],
      milestones: [
        { date: '2023-11-01', title: { en: 'First two clinics operating profitably', fr: 'Deux premières cliniques rentables' }, completed: true },
        { date: '2025-05-01', title: { en: 'Equipment supply agreement signed', fr: "Contrat de fourniture d'équipements signé" }, completed: true },
        { date: '2026-11-01', title: { en: 'Four additional clinics opened', fr: 'Quatre cliniques supplémentaires ouvertes' }, completed: false },
      ],
    },
    financials: {
      summary: {
        en: 'Revenue is fee-per-examination, with a growing share settled through insurance rather than direct payment.',
        fr: "Le revenu est facturé à l'acte, avec une part croissante réglée par l'assurance plutôt qu'en paiement direct.",
      },
      metrics: [
        { year: '2026', revenue: 142_000_000, netOperatingIncome: 58_000_000, projectedDistribution: 9.2 },
        { year: '2027', revenue: 228_000_000, netOperatingIncome: 102_000_000, projectedDistribution: 10.3 },
        { year: '2028', revenue: 271_000_000, netOperatingIncome: 126_000_000, projectedDistribution: 11.0 },
      ],
      feeStructure: FEE_STRUCTURE,
    },
    riskFactors: [
      {
        category: { en: 'Patient volume risk', fr: 'Risque de volume de patients' },
        severity: 'Medium',
        description: {
          en: 'New clinics may take longer than modelled to reach breakeven volume, particularly where referral networks are thin.',
          fr: "Les nouvelles cliniques peuvent mettre plus de temps que prévu à atteindre le volume d'équilibre, notamment là où les réseaux de prescripteurs sont peu denses.",
        },
        mitigation: {
          en: 'Sites are selected on catchment population and existing referral relationships, and open sequentially so early results inform the next opening.',
          fr: "Les sites sont choisis selon la population du bassin et les relations de prescription existantes, et ouvrent successivement afin que les premiers résultats guident l'ouverture suivante.",
        },
      },
      {
        category: { en: 'Payer collection risk', fr: 'Risque de recouvrement auprès des payeurs' },
        severity: 'Medium',
        description: {
          en: 'Insurance reimbursement cycles can be slow, tying up working capital and delaying distributions.',
          fr: "Les cycles de remboursement de l'assurance peuvent être longs, immobilisant le fonds de roulement et retardant les distributions.",
        },
        mitigation: {
          en: 'A working capital buffer is funded from the raise, and direct-pay patients remain a substantial share of revenue.',
          fr: "Un matelas de fonds de roulement est financé par la levée, et les patients en paiement direct restent une part importante du revenu.",
        },
      },
    ],
    documents: [
      { id: 'doc-m1', name: { en: 'Clinic network offering memorandum', fr: "Note d'information réseau de cliniques" }, type: 'PDF', size: '3.1 MB', date: '2025-06-01' },
      { id: 'doc-m2', name: { en: 'Equipment supply and service agreement', fr: 'Contrat de fourniture et de maintenance des équipements' }, type: 'PDF', size: '1.4 MB', date: '2025-05-01' },
    ],
  },
];

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-what',
    category: { en: 'Getting started', fr: 'Premiers pas' },
    question: {
      en: 'What is GrowthFund and how does it work?',
      fr: 'Qu’est-ce que GrowthFund et comment cela fonctionne-t-il ?',
    },
    answer: {
      en: 'GrowthFund connects investors with vetted private market projects across renewable energy, infrastructure, commercial real estate, healthcare and agriculture, denominated in Franc CFA (XAF). You can browse opportunities, read the offering documents, invest from 25,000 XAF, cash in and out, and track projected distributions from your dashboard.',
      fr: "GrowthFund met en relation des investisseurs avec des projets de marché privé vérifiés dans les énergies renouvelables, les infrastructures, l'immobilier commercial, la santé et l'agriculture, libellés en Franc CFA (XAF). Vous pouvez parcourir les offres, consulter les documents, investir dès 25 000 XAF, approvisionner et retirer, et suivre vos distributions projetées depuis votre tableau de bord.",
    },
  },
  {
    id: 'faq-prototype',
    category: { en: 'Getting started', fr: 'Premiers pas' },
    question: {
      en: 'Is this a real investment platform?',
      fr: "S'agit-il d'une véritable plateforme d'investissement ?",
    },
    answer: {
      en: 'No. This is a demonstration prototype. Every project, sponsor, balance, partner and transaction shown is illustrative sample data. No real money moves, no securities are offered, and the platform holds no regulatory licence.',
      fr: "Non. Il s'agit d'un prototype de démonstration. Tous les projets, promoteurs, soldes, partenaires et transactions présentés sont des données d'exemple. Aucun mouvement d'argent réel n'a lieu, aucun titre n'est proposé, et la plateforme ne détient aucune licence réglementaire.",
    },
  },
  {
    id: 'faq-currency',
    category: { en: 'Getting started', fr: 'Premiers pas' },
    question: {
      en: 'What currency does the platform use?',
      fr: 'Quelle devise la plateforme utilise-t-elle ?',
    },
    answer: {
      en: 'Everything — opportunities, balances, deposits, withdrawals and distributions — is denominated in Franc CFA (XAF, also written FCFA).',
      fr: "Tout — offres, soldes, dépôts, retraits et distributions — est libellé en Franc CFA (XAF, aussi noté FCFA).",
    },
  },
  {
    id: 'faq-deposit',
    category: { en: 'Cash in & cash out', fr: 'Dépôts et retraits' },
    question: {
      en: 'How do I add money to my account?',
      fr: 'Comment approvisionner mon compte ?',
    },
    answer: {
      en: 'You can deposit Franc CFA using MTN Mobile Money, Orange Money, Wave, Moov Money, a bank transfer, or a Visa/Mastercard. The platform charges no deposit fee.',
      fr: "Vous pouvez déposer des Francs CFA via MTN Mobile Money, Orange Money, Wave, Moov Money, un virement bancaire ou une carte Visa/Mastercard. La plateforme ne prélève aucun frais de dépôt.",
    },
  },
  {
    id: 'faq-withdraw',
    category: { en: 'Cash in & cash out', fr: 'Dépôts et retraits' },
    question: {
      en: 'How does cash out work, and what are the rules?',
      fr: 'Comment fonctionne le retrait et quelles sont les règles ?',
    },
    answer: {
      en: 'Withdrawals go to your Mobile Money wallet or bank account. Cash out is available only in multiples of 5,000 XAF, starting from a 5,000 XAF minimum (5,000 · 10,000 · 15,000 · 20,000 and so on).',
      fr: "Les retraits sont envoyés vers votre portefeuille Mobile Money ou votre compte bancaire. Le retrait n'est possible que par multiples de 5 000 XAF, à partir d'un minimum de 5 000 XAF (5 000 · 10 000 · 15 000 · 20 000, etc.).",
    },
  },
  {
    id: 'faq-withdraw-time',
    category: { en: 'Cash in & cash out', fr: 'Dépôts et retraits' },
    question: {
      en: 'How long do withdrawals take?',
      fr: 'Combien de temps prend un retrait ?',
    },
    answer: {
      en: 'Mobile Money cash-outs are typically processed within a couple of hours. Bank transfers take one to two business days.',
      fr: "Les retraits Mobile Money sont généralement traités en quelques heures. Les virements bancaires prennent un à deux jours ouvrés.",
    },
  },
  {
    id: 'faq-guaranteed',
    category: { en: 'Risk & returns', fr: 'Risques et rendements' },
    question: {
      en: 'Are returns guaranteed?',
      fr: 'Les rendements sont-ils garantis ?',
    },
    answer: {
      en: 'No. All investments carry risk. Returns are estimated projections based on sponsor operating models and are never guaranteed. You may lose some or all of your capital, and these holdings are illiquid.',
      fr: "Non. Tout investissement comporte un risque. Les rendements sont des projections estimées à partir des modèles d'exploitation des promoteurs et ne sont jamais garantis. Vous pouvez perdre tout ou partie de votre capital, et ces positions sont illiquides.",
    },
  },
  {
    id: 'faq-distributions',
    category: { en: 'Risk & returns', fr: 'Risques et rendements' },
    question: {
      en: 'When are distributions paid?',
      fr: 'Quand les distributions sont-elles versées ?',
    },
    answer: {
      en: 'It depends on the offering: monthly, quarterly, semi-annually, or at maturity. Each listing states its schedule, and distributions are credited to your Franc CFA cash balance.',
      fr: "Cela dépend de l'offre : mensuelle, trimestrielle, semestrielle ou à échéance. Chaque offre indique son calendrier, et les distributions sont créditées sur votre solde en Franc CFA.",
    },
  },
  {
    id: 'faq-liquidity',
    category: { en: 'Risk & returns', fr: 'Risques et rendements' },
    question: {
      en: 'Can I sell my investment early?',
      fr: 'Puis-je revendre mon investissement par anticipation ?',
    },
    answer: {
      en: 'No. Private market holdings have no active secondary market. You should expect to hold each investment until its stated maturity, which is typically two to five years.',
      fr: "Non. Les positions de marché privé n'ont pas de marché secondaire actif. Vous devez prévoir de conserver chaque investissement jusqu'à son échéance annoncée, généralement de deux à cinq ans.",
    },
  },
  {
    id: 'faq-referral',
    category: { en: 'Referrals', fr: 'Parrainage' },
    question: {
      en: 'How does the referral bonus work?',
      fr: 'Comment fonctionne le bonus de parrainage ?',
    },
    answer: {
      en: 'Every member gets a unique referral code. When a friend joins using your code and verifies their account, you receive a 1,000 XAF cash bonus in your balance. There is no cap on how many friends you can refer.',
      fr: "Chaque membre dispose d'un code de parrainage unique. Lorsqu'un ami s'inscrit avec votre code et vérifie son compte, vous recevez un bonus de 1 000 XAF sur votre solde. Le nombre de filleuls n'est pas plafonné.",
    },
  },
  {
    id: 'faq-fees',
    category: { en: 'Fees & account', fr: 'Frais et compte' },
    question: {
      en: 'What fees does GrowthFund charge?',
      fr: 'Quels frais GrowthFund prélève-t-il ?',
    },
    answer: {
      en: 'A 0.50% annual administration fee is deducted from gross distributions. Account opening, deposits and withdrawals are free. Sponsors pay a listing fee at closing. The full schedule is on the Risk & Legal page.',
      fr: "Des frais d'administration annuels de 0,50 % sont déduits des distributions brutes. L'ouverture de compte, les dépôts et les retraits sont gratuits. Les promoteurs paient des frais de référencement à la clôture. La grille complète figure sur la page Risques et mentions légales.",
    },
  },
  {
    id: 'faq-kyc',
    category: { en: 'Fees & account', fr: 'Frais et compte' },
    question: {
      en: 'Why do I need to verify my identity?',
      fr: 'Pourquoi dois-je vérifier mon identité ?',
    },
    answer: {
      en: 'Identity verification meets anti-money-laundering and investor-protection requirements. It takes a couple of minutes and unlocks the full investment limits on your account.',
      fr: "La vérification d'identité répond aux exigences anti-blanchiment et de protection des investisseurs. Elle prend quelques minutes et débloque les plafonds d'investissement complets sur votre compte.",
    },
  },
];
