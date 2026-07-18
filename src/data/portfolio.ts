import { Project, Experience, Education, SkillGroup } from '../types';

export const PERSONAL_INFO = {
  name: 'Rahul Goyal',
  title: 'Lawyer',
  bio: `I'm Rahul Goyal, a lawyer who reads fine print so you don't have to.

I work in corporate law, IP, and tech policy, turning tangled regulation into clear, confident moves. Contracts that hold up. Advice that's straight, not stuffy. Legal ground that's safe to build on.`,
  shortBio: 'Making the complex, comprehensible.',
  location: 'New Delhi, India',
  email: 'rahulgyl48@gmail.com',
  phone: '+91 8690247028',
  avatar: 'https://res.cloudinary.com/ywmg6avw/image/upload/v1784332586/Gemini_Generated_Image_6fnqg66fnqg66fnq_1_iqvlqk.png',
  github: 'https://github.com/rahulgoyal',
  linkedin: 'https://www.linkedin.com/in/rahulgoyal48/',
  twitter: 'https://twitter.com/rahulgoyal',
  resumeUrl: '#resume',
  isAvatarLocked: true,
};

export const PROJECTS: Project[] = [
  {
    id: 'ai-governance',
    title: 'Contribution of AI to Environmental Sustainability Governance: A Comparative Study',
    category: 'Research Papers',
    description: 'A comparative cross-border legal study analyzing the regulatory frameworks, governance systems, and AI applications in mitigating environmental challenges in India and Peru.',
    longDescription: 'This peer-reviewed comparative research paper explores how artificial intelligence can be integrated into environmental sustainability governance. It contrasts India’s legislative mechanisms and digital initiatives with Peru’s environmental policy frameworks, evaluating the role of judicial bodies, constitutional guidelines, and regulatory authorities in enforcing AI-driven environmental mandates.',
    tags: ['Artificial Intelligence', 'Environmental Law', 'Comparative Governance', 'Policy Reform'],
    image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://revistas.pj.gob.pe/revista/index.php/ropj/article/view/1138', // Revista Oficial del Poder Judicial
    highlights: [
      'Published in the REVISTA OFICIAL DEL PODER JUDICIAL (Official Journal of the Judicial Branch of Peru).',
      'Conducted extensive comparative analysis between Indian and Peruvian eco-governance structures and regulatory hurdles.',
      'Proposed legislative frameworks for utilizing machine learning audits in environmental impact assessments.',
      'Evaluated constitutional rights to a healthy environment in the context of automated resource-management systems.'
    ],
    stats: [
      { label: 'Journal', value: 'REVISTA' },
      { label: 'Scope', value: 'Bilateral' },
      { label: 'Focus', value: 'AI & Eco' }
    ]
  },
  {
    id: 'unconventional-trademarks',
    title: 'How Do Unconventional Trademarks Impact Branding and Marketing Strategies?',
    category: 'IP Press Blogs',
    description: 'An in-depth analysis of color, sound, smell, and motion trademarks, discussing how progressive IP law impacts modern corporate branding and consumer perception.',
    longDescription: 'Unconventional trademarks represent the active frontier of intellectual property. This research analysis explores registration hurdles, distinctiveness requirements, and commercial implications of non-visual and sensory marks under Indian and international trademark regimes, charting how they integrate with corporate branding.',
    tags: ['Trademark Law', 'Intellectual Property', 'Branding Strategy', 'Anti-Dissection Rule'],
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://www.theippress.com/2024/12/01/how-do-unconventional-trademarks-impact-branding-and-marketing-strategies/',
    highlights: [
      'Deconstructed the "Anti-Dissection" and "Dominant Feature" principles in the context of complex multi-sensory brand assets.',
      'Analyzed standards for establishing secondary meaning for unconventional sound, color, and motion marks.',
      'Formulated strategic legal guidelines for brand protection managers navigating registrations in the Indian Trade Marks Registry.'
    ],
    stats: [
      { label: 'Publisher', value: 'IP Press' },
      { label: 'Domain', value: 'Trademarks' },
      { label: 'Analysis', value: 'Sensory Marks' }
    ]
  },
  {
    id: 'patent-claim-modification',
    title: 'Trailblazing Decisions Transform Indian Patent Law: Claim Modification Adaptability',
    category: 'IP Press Blogs',
    description: 'A critical review of recent judicial trends in Indian patent law, examining modern standards for amending and modifying patent claims during prosecution.',
    longDescription: 'Patent claims define the legal boundaries of technological protection. This study examines recent landmark orders from the Delhi High Court and the Indian Patent Office regarding patent amendments under Section 59 of the Indian Patents Act, clarifying the permissible scope of claim modifications to withstand prior art challenges.',
    tags: ['Patent Law', 'Claim Modification', 'Delhi High Court', 'Patent Prosecution'],
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://www.theippress.com/2024/10/01/trailblazing-decisions-transform-indian-patent-law-a-new-chapter-of-adaptability-in-claim-modification/',
    highlights: [
      'Investigated the legal boundaries of Section 59 of the Indian Patents Act, 1970.',
      'Reviewed Delhi High Court precedents governing claim narrowing and disclaimer practices.',
      'Provided draft-structuring recommendations for independent and dependent patent claims to prevent invalidation.'
    ],
    stats: [
      { label: 'Publisher', value: 'IP Press' },
      { label: 'Focus Area', value: 'Patent Law' },
      { label: 'Case Studies', value: 'Section 59' }
    ]
  },
  {
    id: 'writ-jurisdiction',
    title: 'Existence of Alternative Remedy as an Obstacle for Availing Writ Jurisdiction',
    category: 'Articles',
    description: 'A comprehensive constitutional study on the maintainability of writ petitions under Article 226 when alternative statutory remedies exist.',
    longDescription: 'Writ jurisdiction is a powerful constitutional remedy of High Courts. This article examines self-imposed judicial restrictions, exploring the circumstances under which alternative statutory remedies block writ jurisdiction, and cataloging exceptions established by the Supreme Court of India.',
    tags: ['Constitutional Law', 'Writ Jurisdiction', 'Article 226', 'Judicial Precedents'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://articles.manupatra.com/article-details/EXISTENCE-OF-ALTERNATIVE-REMEDY-AS-AN-OBSTACLE-FOR-AVAILING-WRIT-JURISDICTION',
    highlights: [
      'Published on the Manupatra research database, widely referenced by litigation practitioners.',
      'Systematized Supreme Court jurisprudence on the doctrine of exhaustion of alternative remedies.',
      'Identified critical exceptions where writ petitions remain maintainable (e.g., violations of natural justice or fundamental rights).'
    ],
    stats: [
      { label: 'Publisher', value: 'Manupatra' },
      { label: 'Subject', value: 'Consti Law' },
      { label: 'Type', value: 'Writ Study' }
    ]
  },
  {
    id: 'judicial-independence',
    title: 'Extensive Study on Independence of Judiciary',
    category: 'Research Papers',
    description: 'A deep academic inquiry into the structural, financial, and functional independence of the Indian judiciary, exploring constitutional safeguards and contemporary challenges.',
    longDescription: 'Judicial independence is a cornerstone of the basic structure of the Indian Constitution. This paper investigates appointment mechanisms (Collegium system vs. NJAC), security of tenure, financial autonomy, and functional separation of powers, evaluating modern pressures and reforms.',
    tags: ['Constitutional Law', 'Judiciary', 'Basic Structure', 'Appointment Reform'],
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://www.ijllr.com/post/extensive-study-on-independence-of-judiciary', // Indian Journal of Law and Legal Research
    highlights: [
      'Published in the Indian Journal of Law and Legal Research (IJLLR) with ISSN: 2582-8878.',
      'Conducted a comparative analysis with global judicial models, including the US Supreme Court and UK Judicial Appointments Commission.',
      'Proposed structural transparency measures to enhance public trust and systemic checks and balances.'
    ],
    stats: [
      { label: 'Journal', value: 'IJLLR' },
      { label: 'ISSN', value: '2582-8878' },
      { label: 'Volume', value: 'IV, Issue V' }
    ]
  },
  {
    id: 'private-law-colleges',
    title: 'Private Law Colleges: Five-Star Promises, One-Star Delivery',
    category: 'Articles',
    description: 'An investigative policy piece examining regulatory gaps, curriculum deficiencies, and quality discrepancies in private legal education in India.',
    longDescription: 'This widely read investigative commentary provides a critical analysis of the legal education sector in India. It examines the commercialization of private law schools, highlighting the mismatch between infrastructure marketing and the quality of clinical pedagogy and placement outcomes.',
    tags: ['Legal Education', 'Regulatory Oversight', 'Bar Council of India', 'Policy Reform'],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    demoUrl: 'https://www.barandbench.com/columns/private-law-colleges-five-star-promises-one-star-delivery',
    highlights: [
      'Published on Bar & Bench, sparking widespread discourse among legal educators and students.',
      'Argued for stricter Bar Council of India (BCI) inspections and modern clinical law mandates.',
      'Suggested benchmark metrics for grading law school internship placements and moot court support.'
    ],
    stats: [
      { label: 'Publisher', value: 'Bar & Bench' },
      { label: 'Genre', value: 'Op-Ed' },
      { label: 'Impact', value: 'Community Lead' }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'primus-partners',
    role: 'Corporate Law Intern',
    company: 'Primus Partners, New Delhi',
    period: 'Jan 2026 - June 2026',
    location: 'New Delhi, India',
    description: 'Supported the corporate advisory practice on a range of regulatory compliance, contract drafting, and technical policy reviews.',
    bullets: [
      'Analyzed implications of the Digital Personal Data Protection Act (DPDPA) and DPDP Rules for public sector organizations, providing strategic compliance recommendations.',
      'Drafted consultancy agreements defining scope of work, deliverables, payment terms, and liability provisions.',
      'Prepared joint venture agreements establishing governance structures, profit-sharing mechanisms, and exit provisions.',
      'Examined the role of forensic investigators in tracing digital assets, including cryptocurrency tracking methodologies and blockchain analysis techniques.',
      'Researched intellectual property (IPR) protection frameworks for digital and artistic artifacts in India.',
      'Analyzed implications of new Labour Codes (2019-2020) on contractual employees’ rights and social security benefits.'
    ],
    tags: ['Corporate Law', 'Data Protection', 'Contract Drafting', 'Digital Assets', 'IPR']
  },
  {
    id: 'koan-advisory',
    role: 'Tech Policy Intern',
    company: 'Koan Advisory Group, New Delhi',
    period: 'Nov 2025',
    location: 'New Delhi, India',
    description: 'Focused on tech policy and sector research involving AI governance, cybersecurity, telecommunications, and gig-work regulations.',
    bullets: [
      'Authored comprehensive monthly regulatory reports covering civil aviation, defense, and payments sectors including policy developments and product launches.',
      'Conducted comparative international research on AI harm mitigation strategies, particularly deepfake regulation across multiple jurisdictions.',
      'Compiled detailed regulatory requirements for TEC certification, including AIR appointment processes, timelines, and DoT documentation protocols.',
      'Analyzed regulatory frameworks for OTT platforms, television, and film industries with focus on anti-piracy mechanisms.',
      'Performed comparative analysis of gig work regulation across EU, US, China, and Southeast Asian markets.',
      'Prepared data-driven tech sector analyses covering internet penetration metrics and digital payment transaction trends.'
    ],
    tags: ['Tech Policy', 'AI Governance', 'Gig Economy', 'OTT Regulations', 'Research']
  },
  {
    id: 'tempus-law',
    role: 'Corporate Intern',
    company: 'Tempus Law Associates, Hyderabad',
    period: 'Oct 2025',
    location: 'Hyderabad, India',
    description: 'Researched statutory thresholds under employment laws and mapped corporate operational compliance standards.',
    bullets: [
      'Researched recent case law on "moral turpitude" as statutory ground for withholding gratuity under the Payment of Gratuity Act.',
      'Conducted comprehensive regulatory mapping of healthcare consulting business requirements and licensing regulations in India.',
      'Analyzed employment law implications of background verification disclosures and their impact on employment status.'
    ],
    tags: ['Corporate Law', 'Employment Law', 'Compliance Mapping']
  },
  {
    id: 'peritum-partners',
    role: 'Corporate, M&A & Real Estate Intern',
    company: 'Peritum Partners, Chennai',
    period: 'Aug 2025',
    location: 'Chennai, India',
    description: 'Engaged in comprehensive legal research for corporate transactions, estate laws, commercial real estate compliance, and trademark administration.',
    bullets: [
      'Conducted in-depth legal research on Tamil Nadu stamp duty provisions for share certificate issuance under pre-2017 regulatory frameworks.',
      'Analyzed sweat equity compliance requirements under Companies Act 2013, including Section 54 restrictions and maximum 15% discount limitations.',
      'Drafted promoter employment agreements and indemnity bonds for high-value corporate transactions.',
      'Prepared compliance checklists for multimodal transportation of goods under relevant commercial laws.',
      'Examined building compliance requirements for commercial establishments in Odisha, focusing on healthcare facility operations and occupancy certificate protocols.',
      'Researched liability frameworks in building insurance claims involving non-compliance scenarios, unauthorized construction, and missing statutory certificates.',
      'Conducted comprehensive analysis of National Building Code classifications (Group E, Sub-division E3) for commercial office spaces and fire NOC requirements.',
      'Analyzed asset distribution mechanisms under Wills without probate, examining executor responsibilities across diverse asset portfolios.',
      'Researched legal implications of Letters of Administration with annexed Wills, including court permission requirements, limitation periods, and jurisdictional issues.',
      'Prepared RTI applications for factory establishment compliance in backward blocks.',
      'Managed trademark portfolio administration, updating 200+ trademark status reports and conducting 10+ year litigation searches.'
    ],
    tags: ['Companies Act', 'M&A Advisory', 'Real Estate Law', 'Trademark Admin', 'Succession Law']
  },
  {
    id: 'ks-digiprotect',
    role: 'Data Protection & Data Privacy Intern',
    company: 'K&S Digiprotect Services, Gurugram',
    period: 'June 2025',
    location: 'Gurugram, India',
    description: 'Specialized in drafting cybersecurity, DPDPA compliance guidelines, and tracking policy implications of automated AI systems.',
    bullets: [
      'Drafted comprehensive data governance policies including third-party data sharing agreements, cross-border transfer protocols, information security frameworks, and employee training programs ensuring DPDPA compliance.',
      'Conducted extensive research on cybersecurity incidents and data breach notification requirements under India\'s Digital Personal Data Protection Act.',
      'Compiled detailed case law analysis on "Right to be Forgotten" and "Right to Erasure" principles, examining landmark judgments including K.S. Puttaswamy v. Union of India.',
      'Developed targeted client acquisition strategies for the healthcare sector by analyzing regulatory frameworks and data protection compliance requirements.',
      'Created comprehensive inventory of AI-related laws, regulations, and guidelines issued by Indian authorities, including ICMR ethical guidelines for AI in healthcare.'
    ],
    tags: ['Data Protection', 'DPDPA', 'Cybersecurity Law', 'AI Ethics', 'Case Law Analysis']
  },
  {
    id: 'karanjawala',
    role: 'White Collar & Commercial Litigation Intern',
    company: 'Karanjawala & Co., New Delhi',
    period: 'Mar 2025',
    location: 'New Delhi, India',
    description: 'Assisted senior litigation associates in researching company director liabilities and local taxation calculations.',
    bullets: [
      'Researched legal precedents on vicarious liability of companies for director actions, analyzing implications of director death on ongoing company proceedings.',
      'Conducted comprehensive analysis of property tax calculation methodology under NDMC regulations, examining unit area value systems, use factors, and occupancy factors.'
    ],
    tags: ['White Collar', 'Commercial Litigation', 'NDMC Regulations', 'Liability Precedents']
  },
  {
    id: 'ks-partners',
    role: 'IP Intern',
    company: 'K&S Partners, Gurugram',
    period: 'Jan 2025',
    location: 'Gurugram, India',
    description: 'Worked in the IP practice, analyzing trademark distinctiveness and drafting prosecution briefs.',
    bullets: [
      'Conducted extensive legal research on trademark law fundamentals including marks versus trademarks under Section 2(1)(zb), Anti-Dissection Rule, and Dominant Feature principles.',
      'Drafted substantive responses to trademark examination reports addressing Section 11(1) objections and handled provisional refusals for international registrations under Madrid Protocol.',
      'Managed large-scale administrative project updating statuses for 290 trademark applications.',
      'Performed legal research on emerging issues including color trademarks, res judicata in opposition proceedings, and unconventional marks.'
    ],
    tags: ['Trademark Law', 'IP Prosecution', 'Madrid Protocol', 'Anti-Dissection']
  },
  {
    id: 'ip-quad',
    role: 'IP & Patent Intern (Hybrid)',
    company: 'IP Quad Partners, New Delhi',
    period: 'June 2024 - Dec 2024',
    location: 'New Delhi, India',
    description: 'Gained specialized experience drafting comprehensive patent specifications across multi-disciplinary engineering domains.',
    bullets: [
      'Drafted 500+ patent applications across diverse technical domains including mechanical, electrical, software, and biotechnology innovations.',
      'Translated complex technical inventions into precise legal language with strategically selected claim terminology.',
      'Developed hierarchical claim structures (independent and dependent claims) to anticipate prior art challenges and ensure robust IP protection.',
      'Demonstrated expertise in claim drafting techniques to define inventive elements without unnecessary limitations.'
    ],
    tags: ['Patent Drafting', 'Claims Construction', 'Prior Art', 'IP Law']
  },
  {
    id: 'areness',
    role: 'Corporate Intern',
    company: 'Areness Associates LLP',
    period: 'Feb 2024 - Mar 2024',
    location: 'New Delhi, India',
    description: 'Provided regulatory and transactional backing to startups and evaluated MedTech legal boundaries.',
    bullets: [
      'Conducted comprehensive legal research on startup enterprise policies, government schemes, and financial incentives for emerging businesses.',
      'Researched regulatory requirements for AI medical devices including approval processes, testing standards, liability frameworks, and data privacy obligations.',
      'Provided corporate legal support through commercial agreement drafting, due diligence, board documentation, and regulatory compliance strategies.'
    ],
    tags: ['Corporate Law', 'Startup Advising', 'MedTech Regulation', 'Compliance']
  },
  {
    id: 'asia-law',
    role: 'Corporate Intern',
    company: 'Asia Law Offices, New Delhi',
    period: 'Jan 2024',
    location: 'New Delhi, India',
    description: 'Conducted legal research on fraud, jurisdictions, child labor monitoring, and commercial disputes.',
    bullets: [
      'Drafted criminal law complaints under IPC Sections 415, 417, 420 (Cheating), and 120B (Criminal Conspiracy).',
      'Analyzed diverse legal issues including fraud jurisdiction, trademark suits, child labor monitoring, medical device distributor liability, e-apostilles, and arbitrator powers.'
    ],
    tags: ['Corporate Law', 'Criminal Law', 'Commercial Dispute', 'Jurisdiction']
  },
  {
    id: 'corpus-juris',
    role: 'Litigation Intern (LOR Received)',
    company: 'Corpus Juris India, New Delhi',
    period: 'July 2024 - Aug 2024',
    location: 'New Delhi, India',
    description: 'Drafted petitions, represented interests, and issued statutory notices.',
    bullets: [
      'Prepared contempt proceedings petitions documenting court order violations with persuasive legal arguments.',
      'Applied Street Vendors Act provisions to protect vendors\' rights in vending zone disputes.',
      'Drafted statutory notices under Negotiable Instruments Act for dishonored cheques, establishing legal grounds for recovery.'
    ],
    tags: ['Litigation', 'Contempt Petitions', 'Statutory Notices', 'Civil Rights']
  },
  {
    id: 'virendra-agrawal',
    role: 'Litigation Intern',
    company: 'Virendra Agrawal & Co., Jaipur',
    period: 'Dec 2022 - Jan 2024',
    location: 'Jaipur, India',
    description: 'Assisted in litigation representation and parsed MACT liability boundaries.',
    bullets: [
      'Conducted research on Supreme Court rulings related to Motor Accidents Claims Tribunal matters including negligence and liability determination.',
      'Analyzed vehicle transfer impacts on insurance claims and drafted consumer forum complaint replies.',
      'Participated in legal proceedings across High Court, State Commission, NI Act Court, and Appellate Tribunal.'
    ],
    tags: ['Litigation', 'MACT Claims', 'Consumer Forum', 'Appellate Court']
  },
  {
    id: 'ig-associates',
    role: 'Corporate Intern',
    company: 'I.G. & Associates, New Delhi',
    period: 'May 2022',
    location: 'New Delhi, India',
    description: 'Analyzed banking instruments and drafted cheque bounce complaint documentation.',
    bullets: [
      'Analyzed Section 138 of Negotiable Instruments Act to draft complaints for dishonored cheque cases.',
      'Researched procedural timelines for police witness summoning under Criminal Procedure Code.',
      'Examined legal remedies for liquor license holders affected by retail vend bans.'
    ],
    tags: ['Corporate Law', 'Negotiable Instruments', 'Criminal Procedure']
  }
];

export const EDUCATION: Education[] = [
  {
    degree: 'LL.M. in Corporate & Commercial Law',
    school: 'Bennett University, Greater Noida',
    period: '2026 - 2027',
    details: 'Advanced specialization in mergers, corporate finance, anti-trust laws, and commercial dispute resolution.'
  },
  {
    degree: 'B.A. LL.B. (Hons.)',
    school: 'KIIT School of Law, Bhubaneswar',
    period: '2021 - 2026',
    details: 'Five-year integrated honors program with a robust focus on corporate law, commercial transactions, and intellectual property.'
  },
  {
    degree: 'Company Secretary (CS) - Executive Program',
    school: 'Institute of Company Secretaries of India (ICSI)',
    period: '2026 - Pursuing',
    details: 'Professional program focused on corporate governance, secretarial audit, compliance management, and tax law.'
  },
  {
    degree: 'Senior Secondary (Class XII) | 75%',
    school: 'BDIS, Raj',
    period: '2020',
    details: 'CBSE Curriculum.'
  },
  {
    degree: 'Secondary (Class X) | 86.6% (3rd Rank Merit)',
    school: 'G.R Global Academy, Kenchiyan',
    period: '2018',
    details: 'Graduated with academic merit award.'
  }
];

export const CERTIFICATIONS = [
  'Open-Source Intelligence (OSINT) — Basel Institute on Governance',
  'International Cooperation and Mutual Legal Assistance in Criminal Matters — Basel Institute on Governance',
  'Collective Action Against Corruption — Basel Institute on Governance',
  'ISO/IEC 27001:2022 Lead Auditor (Mastermind)',
  'PrivacyOps Certification — Securiti',
  'Legal Tech & Startups — IE Business School',
  'FinTech Law and Policy — Duke University',
  'Web3 and Blockchain Fundamentals — Insead',
  'Master Course in Corporate Laws — Enhelion',
  'Diploma in Cyber Law — Asian School of Cyber Laws',
  'Completed Indian Constitution Course with Appreciation — NALSAR'
];

export const ACHIEVEMENTS = [
  'Shortlisted, India\'s 1st Virtual Legal Marathon on ESG - 5th Edition (Dhir & Dhir Associates)',
  'Consolation Prize (Recognised by Chetan Bhagat), Creative Writing Olympiad - 2024 (Mono Mousumi)',
  'Praiseworthy, International Creative Writing Contest December 2024 (Mono Mousumi)',
  'Special Mention, International Creative Writing Contest October 2024 (Mono Mousumi)',
  'Runner-Up with ₹1,500 Cash Prize, National Patent Drafting Competition 2024 (IPU-IPR CELL & KAnalysis Firm)',
  'Best Performer, Trademarks Law Workshop 2024 (IP Trademark Clinic)',
  'Winner, Illustrated Law Carousels Competition (Canonsphere)',
  'Participated in the 16th KIIT Intra Moot Court Competition, 2024',
  'Participated in 1st MNLUA Contract Drafting Competition',
  'Volunteered as Witness, 6th KIIT National Mock Trial Competition',
  'Volunteered at the 1st KIIT Polemic Intra University Debate Competition'
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'Practice Areas',
    skills: [
      'Corporate Law',
      'Intellectual Property (IP)',
      'Contract Drafting & Review',
      'Patent Claim Drafting',
      'M&A Compliance',
      'Labor & Employment Law',
      'Case Law Analysis'
    ]
  },
  {
    category: 'Tech Policy & Cyber',
    skills: [
      'Data Protection & Privacy',
      'DPDPA',
      'AI Regulation & Ethics',
      'FinTech Law & Policy',
      'Web3 & Blockchain fundamentals',
      'Cyber Law',
      'OSINT'
    ]
  },
  {
    category: 'Compliance & Audits',
    skills: [
      'ISO/IEC 27001 Lead Auditor',
      'PrivacyOps (Securiti)',
      'Corporate Governance',
      'Secretarial Compliance',
      'Anti-Corruption Frameworks'
    ]
  },
  {
    category: 'Research & Tools',
    skills: [
      'Legal Research & Writing',
      'Manupatra',
      'SCC Online',
      'Westlaw',
      'Comparative Law Research',
      'Client Communication'
    ]
  }
];
