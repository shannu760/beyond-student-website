export interface VideoCurriculumItem {
  id: string;
  exam: "JEE" | "NEET" | "SAT" | "GRE";
  subject: string;
  unitName: string;
  chapterName: string;
  level: "Basic Foundation" | "Intermediate Problem Solving" | "Advanced Elite Mastery";
  language: "English" | "Hindi" | "Telugu";
  title: string;
  instructor: string;
  channelName: string;
  duration: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  resourceType: "Full Chapter Lecture" | "One-Shot Revision" | "Advanced Illustration" | "Open Courseware";
  description: string;
  keyTopicsCovered: string[];
}

export const VIDEO_CURRICULUM: VideoCurriculumItem[] = [
  // ==========================================
  // JEE MAINS & ADVANCED - PHYSICS
  // ==========================================
  {
    id: "jee-phy-mech-01",
    exam: "JEE",
    subject: "Physics",
    unitName: "Mechanics",
    chapterName: "Newton's Laws of Motion & Friction",
    level: "Basic Foundation",
    language: "Hindi",
    title: "NLM & Friction: Complete Fundamentals & Free Body Diagrams",
    instructor: "ABJ Sir",
    channelName: "Mohit Tyagi (Competishun)",
    duration: "2h 40m",
    youtubeUrl: "https://www.youtube.com/results?search_query=abj+sir+newton+laws+of+motion+competishun",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Deep, concept-first foundation for Newton's laws, constraint relations (pulley, wedge), pseudo forces, and static/kinetic friction boundaries.",
    keyTopicsCovered: ["Free Body Diagrams", "Pulley-Block Constraints", "Wedge Constraints", "Frictional Angle & Repose"]
  },
  {
    id: "jee-phy-mech-02",
    exam: "JEE",
    subject: "Physics",
    unitName: "Mechanics",
    chapterName: "Work, Energy & Power",
    level: "Intermediate Problem Solving",
    language: "Hindi",
    title: "Work-Energy Theorem & Conservative Forces One-Shot",
    instructor: "Alakh Pandey Sir",
    channelName: "Physics Wallah (Manzil Series)",
    duration: "3h 10m",
    youtubeUrl: "https://www.youtube.com/results?search_query=physics+wallah+work+energy+power+manzil",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    resourceType: "One-Shot Revision",
    description: "High-yield revision for JEE Mains: work done by variable forces, spring potential energy, vertical circular motion, and power.",
    keyTopicsCovered: ["Work-Energy Theorem", "Potential Energy Curves", "Vertical Circle Critical Velocity", "Power & Efficiency"]
  },
  {
    id: "jee-phy-mech-03",
    exam: "JEE",
    subject: "Physics",
    unitName: "Mechanics",
    chapterName: "Rotational Dynamics",
    level: "Advanced Elite Mastery",
    language: "Hindi",
    title: "Rotational Motion Advanced Concept Illustrations",
    instructor: "Ashish Arora Sir",
    channelName: "Physics Galaxy",
    duration: "1h 50m",
    youtubeUrl: "https://www.youtube.com/results?search_query=physics+galaxy+rotational+motion+advanced+illustrations",
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    resourceType: "Advanced Illustration",
    description: "Challenging multi-concept problems on instantaneous axis of rotation (IAOR), toppling vs sliding, angular momentum conservation, and pure rolling on moving surfaces.",
    keyTopicsCovered: ["Instantaneous Axis of Rotation", "Toppling Conditions", "Angular Momentum About Any Point", "Rough Incline Rolling"]
  },
  {
    id: "jee-phy-em-01",
    exam: "JEE",
    subject: "Physics",
    unitName: "Electrodynamics",
    chapterName: "Electrostatics & Gauss's Law",
    level: "Basic Foundation",
    language: "English",
    title: "Electric Fields, Flux & Gauss's Law Complete MIT Lecture",
    instructor: "Prof. Walter Lewin",
    channelName: "MIT OpenCourseWare",
    duration: "52m",
    youtubeUrl: "https://www.youtube.com/results?search_query=walter+lewin+gauss+law+mit+8.02",
    thumbnailUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
    resourceType: "Open Courseware",
    description: "Visual, experiment-based demonstration of electric dipole fields, electrostatic shielding, and applying Gauss's law over symmetric manifolds.",
    keyTopicsCovered: ["Coulomb's Vector Form", "Electric Flux Integrals", "Spherical & Cylindrical Symmetry", "Conductor Cavities"]
  },
  {
    id: "jee-phy-em-02",
    exam: "JEE",
    subject: "Physics",
    unitName: "Electrodynamics",
    chapterName: "Current Electricity & Circuits",
    level: "Intermediate Problem Solving",
    language: "Telugu",
    title: "Current Electricity & Kirchhoff's Laws Full Review in Telugu",
    instructor: "Ram Sir",
    channelName: "Vedantu Telugu JEE",
    duration: "2h 15m",
    youtubeUrl: "https://www.youtube.com/results?search_query=vedantu+telugu+current+electricity+jee",
    thumbnailUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Clear concept lecture in Telugu covering drift velocity derivations, temperature coefficient of resistance, Kirchhoff nodal analysis, and potentiometer.",
    keyTopicsCovered: ["Drift Velocity & Mobility", "Kirchhoff's Nodal Analysis", "Meter Bridge & Potentiometer", "Symmetrical Circuit Reduction"]
  },

  // ==========================================
  // JEE MAINS & ADVANCED - MATHEMATICS
  // ==========================================
  {
    id: "jee-math-calc-01",
    exam: "JEE",
    subject: "Mathematics",
    unitName: "Calculus",
    chapterName: "Limits, Continuity & Differentiability",
    level: "Basic Foundation",
    language: "Hindi",
    title: "Limits & Standard Expansions: Zero to Hero Lecture",
    instructor: "Mohit Tyagi Sir",
    channelName: "Mohit Tyagi (Competishun)",
    duration: "2h 05m",
    youtubeUrl: "https://www.youtube.com/results?search_query=mohit+tyagi+limits+continuity+differentiability",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Flawless mathematical rigor: McLaurin expansions for sin, cos, ln(1+x), e^x, 1^∞ indeterminate form shortcuts, and differentiability from graphs.",
    keyTopicsCovered: ["L'Hôpital's Edge Cases", "1^∞ Form Shortcut", "Series Expansion Method", "Functional Equations"]
  },
  {
    id: "jee-math-calc-02",
    exam: "JEE",
    subject: "Mathematics",
    unitName: "Calculus",
    chapterName: "Definite Integrals & Area Under Curves",
    level: "Intermediate Problem Solving",
    language: "English",
    title: "Definite Integration & King's Rule Comprehensive One-Shot",
    instructor: "Arvind Kalia Sir",
    channelName: "Vedantu JEE (English)",
    duration: "2h 55m",
    youtubeUrl: "https://www.youtube.com/results?search_query=arvind+kalia+definite+integration+one+shot",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    resourceType: "One-Shot Revision",
    description: "Complete coverage of standard properties, periodic function integrals, Leibniz integral rule, and calculating area bounded between parabolas and lines.",
    keyTopicsCovered: ["King's & Queen's Properties", "Leibniz Integral Rule", "Periodic Function Integrals", "Definite Integral as Limit of Sum"]
  },
  {
    id: "jee-math-alg-01",
    exam: "JEE",
    subject: "Mathematics",
    unitName: "Algebra",
    chapterName: "Complex Numbers & Coordinate Transformations",
    level: "Advanced Elite Mastery",
    language: "English",
    title: "Essence of Complex Numbers & Euler's Formula Geometry",
    instructor: "Grant Sanderson",
    channelName: "3Blue1Brown",
    duration: "45m",
    youtubeUrl: "https://www.youtube.com/results?search_query=3blue1brown+complex+numbers+essence",
    thumbnailUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80",
    resourceType: "Open Courseware",
    description: "Intuitive geometric visualization of complex rotations, e^(iθ), roots of unity polygon symmetry, and De Moivre's theorem.",
    keyTopicsCovered: ["Euler's Formula Geometry", "n-th Roots of Unity", "Conformal Rotation Mapping", "Locus in Argand Plane"]
  },

  // ==========================================
  // JEE MAINS & ADVANCED - CHEMISTRY
  // ==========================================
  {
    id: "jee-chem-org-01",
    exam: "JEE",
    subject: "Chemistry",
    unitName: "Organic Chemistry",
    chapterName: "Reaction Mechanisms (GOC & Hydrocarbons)",
    level: "Basic Foundation",
    language: "Hindi",
    title: "General Organic Chemistry (GOC): Inductive, Resonance, Hyperconjugation",
    instructor: "Neeraj Saini (NS Sir)",
    channelName: "Mohit Tyagi (Competishun)",
    duration: "2h 30m",
    youtubeUrl: "https://www.youtube.com/results?search_query=ns+sir+goc+competishun",
    thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Unmatched depth in electronic displacement effects, aromaticity Huckel rules, carbocation stability rearrangements, and acid-base strength orders.",
    keyTopicsCovered: ["Resonance & Mesomeric Effect", "Hyperconjugation & Heat of Hydrogenation", "Aromaticity & Anti-Aromaticity", "Carbocation Rearrangements"]
  },
  {
    id: "jee-chem-phys-01",
    exam: "JEE",
    subject: "Chemistry",
    unitName: "Physical Chemistry",
    chapterName: "Chemical Thermodynamics & Thermochemistry",
    level: "Intermediate Problem Solving",
    language: "Hindi",
    title: "Thermodynamics & Hess Law Complete One-Shot",
    instructor: "Sakshi Vora Ma'am",
    channelName: "Vora Classes",
    duration: "2h 10m",
    youtubeUrl: "https://www.youtube.com/results?search_query=sakshi+vora+thermodynamics+one+shot",
    thumbnailUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=600&auto=format&fit=crop&q=80",
    resourceType: "One-Shot Revision",
    description: "Formulas, sign conventions for work and heat in reversible vs irreversible pathways, entropy changes, and Gibbs free energy spontaneity.",
    keyTopicsCovered: ["First Law Sign Conventions", "Reversible vs Irreversible Work", "Entropy of Universe (ΔS_total)", "Gibbs Helmholtz Equation"]
  },

  // ==========================================
  // NEET UG - BIOLOGY & CHEMISTRY
  // ==========================================
  {
    id: "neet-bio-gen-01",
    exam: "NEET",
    subject: "Biology",
    unitName: "Genetics & Evolution",
    chapterName: "Principles of Inheritance and Variation",
    level: "Basic Foundation",
    language: "English",
    title: "Mendelian Genetics, Linkage & Chromosomal Disorders Line-by-Line",
    instructor: "Dr. Anand Mani",
    channelName: "Unacademy NEET",
    duration: "1h 55m",
    youtubeUrl: "https://www.youtube.com/results?search_query=anand+mani+principles+of+inheritance+neet",
    thumbnailUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Complete NCERT line-by-line decoding of monohybrid and dihybrid crosses, Morgan's Drosophila linkage experiments, and pedigree analysis.",
    keyTopicsCovered: ["Mendelian Dihybrid Ratio", "Morgan Linkage & Recombination", "Sex Determination Mechanisms", "Mendelian & Chromosomal Disorders"]
  },
  {
    id: "neet-bio-gen-02",
    exam: "NEET",
    subject: "Biology",
    unitName: "Genetics & Evolution",
    chapterName: "Molecular Basis of Inheritance",
    level: "Intermediate Problem Solving",
    language: "Telugu",
    title: "DNA Replication, Transcription & Translation in Telugu",
    instructor: "Dr. Murali Sir",
    channelName: "Vedantu Telugu NEET",
    duration: "2h 00m",
    youtubeUrl: "https://www.youtube.com/results?search_query=vedantu+telugu+neet+molecular+basis+of+inheritance",
    thumbnailUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
    resourceType: "Full Chapter Lecture",
    description: "Detailed Telugu explanation of Hershey-Chase experiment, Meselson-Stahl semi-conservative replication proof, genetic code, and Lac Operon.",
    keyTopicsCovered: ["DNA Structure & Packaging", "Meselson-Stahl Proof", "Transcription Machinery", "Lac Operon Regulation"]
  },

  // ==========================================
  // DIGITAL SAT - MATH & READING
  // ==========================================
  {
    id: "sat-math-adv-01",
    exam: "SAT",
    subject: "SAT Math",
    unitName: "Advanced Math",
    chapterName: "Nonlinear Equations & Parabolas",
    level: "Intermediate Problem Solving",
    language: "English",
    title: "Digital SAT Math: Master Quadratics, Exponents & Vertex Form",
    instructor: "The Organic Chemistry Tutor",
    channelName: "The Organic Chemistry Tutor",
    duration: "1h 45m",
    youtubeUrl: "https://www.youtube.com/results?search_query=organic+chemistry+tutor+sat+math+quadratics",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80",
    resourceType: "One-Shot Revision",
    description: "Essential Desmos strategies for finding minimum/maximum vertex, discriminants, and factoring high-degree polynomials quickly.",
    keyTopicsCovered: ["Vertex Form & Completing the Square", "Desmos Graphing Hacks", "Discriminant Rule (b² - 4ac)", "Rational Exponent Simplification"]
  },
  {
    id: "sat-rw-conv-01",
    exam: "SAT",
    subject: "SAT Reading & Writing",
    unitName: "Standard English Conventions",
    chapterName: "Boundaries & Punctuation Rules",
    level: "Basic Foundation",
    language: "English",
    title: "Digital SAT Grammar: Semicolons, Colons, Dashes & Comma Splices",
    instructor: "Sal Khan",
    channelName: "Khan Academy SAT",
    duration: "42m",
    youtubeUrl: "https://www.youtube.com/results?search_query=khan+academy+digital+sat+grammar+conventions",
    thumbnailUrl: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80",
    resourceType: "Open Courseware",
    description: "Master clause boundaries: connecting independent clauses with semicolons, dashes, and FANBOYS coordinators, eliminating run-on sentences.",
    keyTopicsCovered: ["Independent vs Dependent Clauses", "Semicolon vs Colon Rules", "Non-Essential Clauses & Dashes", "Subject-Verb Agreement"]
  },

  // ==========================================
  // GRE - QUANTITATIVE & VERBAL
  // ==========================================
  {
    id: "gre-quant-prob-01",
    exam: "GRE",
    subject: "GRE Quantitative",
    unitName: "Data Analysis",
    chapterName: "Permutations, Combinations & Probability",
    level: "Intermediate Problem Solving",
    language: "English",
    title: "GRE Quant: Combinatorics, Probability & Venn Diagrams Mastery",
    instructor: "GregMat",
    channelName: "GregMat Official",
    duration: "1h 20m",
    youtubeUrl: "https://www.youtube.com/results?search_query=gregmat+gre+quant+permutations+combinations",
    thumbnailUrl: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?w=600&auto=format&fit=crop&q=80",
    resourceType: "One-Shot Revision",
    description: "GregMat's proven method for complementary counting, choosing with/without replacement, overlapping set formulas, and conditional probability.",
    keyTopicsCovered: ["Permutation vs Combination", "Complementary Counting (1 - P)", "3-Set Overlapping Venn Diagrams", "Binomial Distribution Logic"]
  },
  {
    id: "gre-verb-tc-01",
    exam: "GRE",
    subject: "GRE Verbal",
    unitName: "Verbal Reasoning",
    chapterName: "Text Completion & Sentence Equivalence",
    level: "Advanced Elite Mastery",
    language: "English",
    title: "GRE Text Completion: Math Strategy & Concession Elimination",
    instructor: "GregMat",
    channelName: "GregMat Official",
    duration: "55m",
    youtubeUrl: "https://www.youtube.com/results?search_query=gregmat+text+completion+math+strategy",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    resourceType: "Advanced Illustration",
    description: "The famous 'Math Strategy' for GRE Verbal: breaking complex sentences into mathematical plus/minus relations to identify exact contrast words.",
    keyTopicsCovered: ["Math Strategy (+ and -)", "Concession Transition Words", "Pair Matching in Sentence Equivalence", "High-Frequency Root Words"]
  }
];

export function getCurriculumVideosByExam(exam: "ALL" | "JEE" | "NEET" | "SAT" | "GRE"): VideoCurriculumItem[] {
  if (exam === "ALL") return VIDEO_CURRICULUM;
  return VIDEO_CURRICULUM.filter((v) => v.exam === exam);
}
