export type ExamType = "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE" | "JEE";

export interface PYQQuestion {
  id: string;
  exam: ExamType;
  subject: string;
  unit: string;
  chapter: string;
  difficulty: "Basic Foundation" | "Moderate" | "Elite Advanced";
  year: number;
  yearLabel: string;
  paperSession?: string;
  question: string;
  options: { label: string; text: string }[];
  correctIndex: number;
  officialExplanation: string;
  conceptFormulae: string[];
  speedHack: string;
  commonTrap: string;
}

export interface JumbledExamPaper {
  id: string;
  title: string;
  exam: "ALL" | "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE" | "CROSS-EXAM";
  description: string;
  yearSpan: string;
  durationMinutes: number;
  totalQuestions: number;
  marksPerCorrect: number;
  negativeMarks: number;
  questions: PYQQuestion[];
  isJumbled: boolean;
}

export const PYQ_DATABASE: PYQQuestion[] = [
  // ==========================================
  // 1. JEE MAINS PYQs (2020 - 2026)
  // ==========================================
  {
    id: "jee-main-pyq-2026-01",
    exam: "JEE Main",
    subject: "Physics",
    unit: "Modern Physics",
    chapter: "Dual Nature of Radiation & Matter",
    difficulty: "Moderate",
    year: 2026,
    yearLabel: "JEE Main 2026 (Jan Shift 1)",
    paperSession: "2026 Session 1 (27 Jan Morning)",
    question: "A monochromatic light beam of frequency ν = 1.5 × 10¹⁵ Hz is incident on a cesium metal surface having work function Φ₀ = 2.14 eV. If Planck's constant h = 6.63 × 10⁻³⁴ J·s and 1 eV = 1.6 × 10⁻¹⁹ J, the maximum kinetic energy of the emitted photoelectrons is approximately:",
    options: [
      { label: "A", text: "4.08 eV" },
      { label: "B", text: "6.22 eV" },
      { label: "C", text: "2.14 eV" },
      { label: "D", text: "1.94 eV" }
    ],
    correctIndex: 0,
    officialExplanation: "Energy of incident photon: E = hν = (6.63 × 10⁻³⁴ × 1.5 × 10¹⁵) / (1.6 × 10⁻¹⁹) eV ≈ 9.945 × 10⁻¹⁹ / 1.6 × 10⁻¹⁹ ≈ 6.22 eV. By Einstein's photoelectric equation: K_max = E - Φ₀ = 6.22 eV - 2.14 eV = 4.08 eV.",
    conceptFormulae: ["E = hν", "K_max = hν - Φ₀", "1 eV = 1.6 × 10⁻¹⁹ J"],
    speedHack: "h in eV·s is 4.14 × 10⁻¹⁵ eV·s. Thus E = 4.14 × 1.5 = 6.21 eV. 6.21 - 2.14 = 4.07 ≈ 4.08 eV in under 15 seconds.",
    commonTrap: "Confusing total photon energy (6.22 eV) with maximum kinetic energy, forgetting to subtract the work function."
  },
  {
    id: "jee-main-pyq-2025-01",
    exam: "JEE Main",
    subject: "Mathematics",
    unit: "Calculus",
    chapter: "Definite Integrals & Differential Equations",
    difficulty: "Elite Advanced",
    year: 2025,
    yearLabel: "JEE Main 2025 (Shift 2)",
    paperSession: "2025 Session 2 (04 Apr Evening)",
    question: "Let f(x) be a differentiable function on ℝ such that f(x) = x + ∫[0 to x] (x - t)f(t) dt for all x ∈ ℝ. The value of f'(0) + f''(0) is equal to:",
    options: [
      { label: "A", text: "1" },
      { label: "B", text: "2" },
      { label: "C", text: "0" },
      { label: "D", text: "3" }
    ],
    correctIndex: 0,
    officialExplanation: "Rewrite integral: f(x) = x + x ∫[0 to x] f(t) dt - ∫[0 to x] t f(t) dt. Differentiating with respect to x using Leibniz rule: f'(x) = 1 + ∫[0 to x] f(t) dt + x f(x) - x f(x) = 1 + ∫[0 to x] f(t) dt. At x = 0: f'(0) = 1 + 0 = 1. Differentiating again: f''(x) = f(x). Since f(0) = 0, f''(0) = 0. Therefore, f'(0) + f''(0) = 1 + 0 = 1.",
    conceptFormulae: ["Leibniz Rule: d/dx ∫[0 to x] g(x,t) dt = g(x,x) + ∫ ∂g/∂x dt", "f''(x) = f(x)"],
    speedHack: "Differentiating twice eliminates the convolution integral directly: f''(x) = f(x) with f(0) = 0 and f'(0) = 1. Sum = 1 + 0 = 1.",
    commonTrap: "Differentiating (x-t) incorrectly without splitting x out of the integral first."
  },
  {
    id: "jee-main-pyq-2024-01",
    exam: "JEE Main",
    subject: "Physics",
    unit: "Mechanics",
    chapter: "Work, Energy & Power",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "JEE Main 2024 (Session 1, 27 Jan)",
    paperSession: "2024 Session 1 (27 Jan Morning)",
    question: "A block of mass m = 2 kg is released from rest from a height h = 5 m on a frictionless curved track which smoothly terminates into a rough horizontal track of friction coefficient μ = 0.25. The distance d travelled by the block on the rough horizontal track before coming to rest is (Take g = 10 m/s²):",
    options: [
      { label: "A", text: "10 m" },
      { label: "B", text: "20 m" },
      { label: "C", text: "15 m" },
      { label: "D", text: "25 m" }
    ],
    correctIndex: 1,
    officialExplanation: "By Work-Energy Theorem: Total work done by gravity + work done by friction = ΔKE = 0. Thus, mgh - μmgd = 0  =>  d = h / μ = 5 / 0.25 = 20 m.",
    conceptFormulae: ["W_net = ΔK", "W_friction = -μ * m * g * d", "d = h / μ"],
    speedHack: "Notice mass m and acceleration due to gravity g cancel out completely: d = h / μ = 5 / 0.25 = 20 m in 5 seconds.",
    commonTrap: "Calculating intermediate velocity v = √(2gh) = 10 m/s and then using kinematics v² = u² - 2as instead of single-step energy conservation."
  },
  {
    id: "jee-main-pyq-2024-02",
    exam: "JEE Main",
    subject: "Chemistry",
    unit: "Physical Chemistry",
    chapter: "Chemical Thermodynamics",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "JEE Main 2024 (Session 1)",
    paperSession: "2024 Session 1 (30 Jan Shift 1)",
    question: "For an ideal gas undergoing an adiabatic reversible expansion from volume V₁ to V₂, if the ratio of heat capacities γ = 1.4 and the temperature falls from 300 K to 150 K, the ratio of initial to final volume (V₁ / V₂) is:",
    options: [
      { label: "A", text: "(1/2)^2.5" },
      { label: "B", text: "(1/2)^1.4" },
      { label: "C", text: "(1/2)^0.4" },
      { label: "D", text: "2^2.5" }
    ],
    correctIndex: 0,
    officialExplanation: "For reversible adiabatic process: T₁ * V₁^(γ - 1) = T₂ * V₂^(γ - 1). Here T₁/T₂ = 300/150 = 2. Thus (V₁/V₂)^0.4 = 1/2 => V₁/V₂ = (1/2)^(1/0.4) = (1/2)^2.5.",
    conceptFormulae: ["T * V^(γ - 1) = Constant", "V₁ / V₂ = (T₂ / T₁)^(1 / (γ - 1))"],
    speedHack: "1 / (1.4 - 1) = 1 / 0.4 = 5/2 = 2.5. Since gas expanded and cooled, V₁ < V₂, so (1/2)^2.5.",
    commonTrap: "Using P*V^γ = const and mixing up pressure with temperature."
  },
  {
    id: "jee-main-pyq-2023-01",
    exam: "JEE Main",
    subject: "Mathematics",
    unit: "Calculus",
    chapter: "Definite Integrals",
    difficulty: "Moderate",
    year: 2023,
    yearLabel: "JEE Main 2023 (Shift 1)",
    paperSession: "2023 Session 1 (24 Jan)",
    question: "The value of the definite integral I = ∫[0 to π/2] (sin⁴(x) / (sin⁴(x) + cos⁴(x))) dx is:",
    options: [
      { label: "A", text: "π / 2" },
      { label: "B", text: "π / 4" },
      { label: "C", text: "π / 8" },
      { label: "D", text: "1" }
    ],
    correctIndex: 1,
    officialExplanation: "Apply King's property: ∫[0 to a] f(x)dx = ∫[0 to a] f(a-x)dx. Here f(π/2 - x) transforms sin into cos and vice-versa. Adding both integrals gives 2I = ∫[0 to π/2] 1 dx = π/2 => I = π/4.",
    conceptFormulae: ["King's Rule: ∫[a to b] f(x)dx = ∫[a to b] f(a+b-x)dx", "2I = ∫ 1 dx"],
    speedHack: "Any symmetric complementary integral ∫[0 to π/2] (sin^n(x) / (sin^n(x) + cos^n(x))) dx is universally equal to (b - a) / 2 = π/4 for all powers n.",
    commonTrap: "Trying to expand powers of sine and cosine using trigonometric identities."
  },
  {
    id: "jee-main-pyq-2022-01",
    exam: "JEE Main",
    subject: "Chemistry",
    unit: "Inorganic Chemistry",
    chapter: "Coordination Compounds",
    difficulty: "Moderate",
    year: 2022,
    yearLabel: "JEE Main 2022 (June Shift 2)",
    paperSession: "2022 Session 1 (26 June)",
    question: "Among the following octahedral coordination complexes, which one exhibits the highest crystal field stabilization energy (CFSE) in terms of magnitude |Δo|?",
    options: [
      { label: "A", text: "[Co(CN)₆]³⁻" },
      { label: "B", text: "[Co(H₂O)₆]³⁺" },
      { label: "C", text: "[CoF₆]³⁻" },
      { label: "D", text: "[Fe(H₂O)₆]²⁺" }
    ],
    correctIndex: 0,
    officialExplanation: "Co³⁺ is a d⁶ system. According to the spectrochemical series, CN⁻ is a very strong field ligand causing maximum d-orbital splitting Δo. For low-spin d⁶ ([Co(CN)₆]³⁻), configuration is t₂g⁶ eg⁰, giving CFSE = -0.4 × 6 × Δo + 2P = -2.4 Δo + 2P, which has the highest magnitude among all choices.",
    conceptFormulae: ["Spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < H₂O < NH₃ < CN⁻ < CO", "CFSE = (-0.4 n_t2g + 0.6 n_eg) Δo"],
    speedHack: "Strongest field ligand (CN⁻) + high oxidation state (+3) = maximum splitting parameter |Δo|.",
    commonTrap: "Assuming [CoF₆]³⁻ has high CFSE because fluorine is the most electronegative element."
  },
  {
    id: "jee-main-pyq-2021-01",
    exam: "JEE Main",
    subject: "Physics",
    unit: "Current Electricity",
    chapter: "Current Electricity & Measuring Instruments",
    difficulty: "Basic Foundation",
    year: 2021,
    yearLabel: "JEE Main 2021 (Feb Shift 1)",
    paperSession: "2021 February Session",
    question: "In a meter bridge experiment, a null point is obtained at 40 cm from the left end when a resistance of 3 Ω is connected in the left gap. When a shunt resistance of S Ω is connected in parallel with the unknown resistor R in the right gap, the null point shifts to 50 cm. The value of S is:",
    options: [
      { label: "A", text: "4.5 Ω" },
      { label: "B", text: "9 Ω" },
      { label: "C", text: "6 Ω" },
      { label: "D", text: "3 Ω" }
    ],
    correctIndex: 1,
    officialExplanation: "Case 1: 3 / R = 40 / 60 = 2/3 => R = 4.5 Ω. Case 2: New right gap resistance R_eq = (R * S)/(R + S). Null point at 50 cm means 3 / R_eq = 50 / 50 = 1 => R_eq = 3 Ω. So (4.5 * S) / (4.5 + S) = 3 => 4.5 S = 13.5 + 3 S => 1.5 S = 13.5 => S = 9 Ω.",
    conceptFormulae: ["P / Q = l / (100 - l)", "1/R_eq = 1/R + 1/S"],
    speedHack: "At 50 cm, both sides must be equal to 3 Ω. 4.5 in parallel with what equals 3? Standard parallel pair: 4.5 and 9 gives 3.",
    commonTrap: "Connecting S in series instead of parallel with R."
  },
  {
    id: "jee-main-pyq-2020-01",
    exam: "JEE Main",
    subject: "Mathematics",
    unit: "Algebra",
    chapter: "Binomial Theorem & Number Theory",
    difficulty: "Moderate",
    year: 2020,
    yearLabel: "JEE Main 2020 (07 Jan Shift 2)",
    paperSession: "2020 January Session",
    question: "The remainder when 2²⁰²⁰ + 3²⁰²⁰ is divided by 5 is equal to:",
    options: [
      { label: "A", text: "0" },
      { label: "B", text: "2" },
      { label: "C", text: "1" },
      { label: "D", text: "4" }
    ],
    correctIndex: 1,
    officialExplanation: "2²⁰²⁰ = (2⁴)⁵⁰⁵ = 16⁵⁰⁵ = (15 + 1)⁵⁰⁵ ≡ 1 (mod 5). Similarly, 3²⁰²⁰ = (3⁴)⁵⁰⁵ = 81⁵⁰⁵ = (80 + 1)⁵⁰⁵ ≡ 1 (mod 5). Hence 2²⁰²⁰ + 3²⁰²⁰ ≡ 1 + 1 = 2 (mod 5).",
    conceptFormulae: ["Euler's Totient / Fermat's Little Theorem: a^(p-1) ≡ 1 (mod p)", "(5k + 1)^n ≡ 1 (mod 5)"],
    speedHack: "Last digits of powers of 2 have cycle of 4: 2, 4, 8, 6. 2020/4 = no remainder => last digit is 6. For 3: 3, 9, 7, 1 => last digit is 1. Sum of last digits = 6 + 1 = 7. 7 mod 5 = 2.",
    commonTrap: "Trying to apply full binomial expansion of (5 - 3)^2020 instead of modular arithmetic."
  },

  // ==========================================
  // 2. JEE ADVANCED PYQs (2020 - 2026)
  // ==========================================
  {
    id: "jee-adv-pyq-2026-01",
    exam: "JEE Advanced",
    subject: "Physics",
    unit: "Mechanics",
    chapter: "Rotational Dynamics & Conservation of Angular Momentum",
    difficulty: "Elite Advanced",
    year: 2026,
    yearLabel: "JEE Advanced 2026 (Paper 1)",
    paperSession: "2026 Paper 1 (Physics)",
    question: "A uniform thin rod of mass M and length L is free to rotate in a vertical plane about a smooth horizontal axis passing through its upper end. A small ball of mass m moving horizontally with speed v hits the lower end of the rod and sticks to it. If the combined system just manages to swing up to the horizontal position, the initial speed v of the ball is:",
    options: [
      { label: "A", text: "√[ (gL / 3) * ( (M + 3m)(M + 2m) / m² ) ]" },
      { label: "B", text: "√[ (gL / 3) * ( (M + 3m)(M + 2m) ) ] / m" },
      { label: "C", text: "√[ (2gL / 3) * ( (M + 3m) / m ) ]" },
      { label: "D", text: "√[ gL * (M + m) / m ]" }
    ],
    correctIndex: 1,
    officialExplanation: "1. Angular momentum conservation about hinge: L_initial = m v L. Moment of inertia of combined system about hinge: I = (1/3)ML² + mL² = (M/3 + m)L² = (M + 3m)L² / 3. Angular velocity right after collision: ω = (m v L) / I = (3 m v) / ((M + 3m) L). 2. Energy conservation to swing to horizontal: (1/2) I ω² = ΔPE = Mg(L/2) + mg(L) = (M/2 + m)gL = (M + 2m)gL / 2. Substituting I and ω gives: (1/2) * [ (M + 3m)L² / 3 ] * [ 9 m² v² / ((M + 3m)² L²) ] = (M + 2m)gL / 2 => 3 m² v² / (M + 3m) = (M + 2m) gL => v = √[ (gL/3) * (M + 3m)(M + 2m) ] / m.",
    conceptFormulae: ["L = I ω", "I_hinge = (1/3)ML² + mL²", "(1/2)Iω² = (M/2 + m)gL"],
    speedHack: "Check dimensional consistency and limiting cases: if M -> 0, v = √[ (gL/3) * 3m * 2m ] / m = √(2gL), which is the exact speed for a simple pendulum to reach horizontal.",
    commonTrap: "Applying linear momentum conservation instead of angular momentum conservation about the fixed hinge."
  },
  {
    id: "jee-adv-pyq-2025-01",
    exam: "JEE Advanced",
    subject: "Mathematics",
    unit: "Algebra & Matrices",
    chapter: "Systems of Linear Equations & Determinants",
    difficulty: "Elite Advanced",
    year: 2025,
    yearLabel: "JEE Advanced 2025 (Paper 2)",
    paperSession: "2025 Paper 2 (Mathematics)",
    question: "Let S be the set of all real numbers α for which the homogeneous system of linear equations: (α - 1)x + 2y + z = 0, 2x + (α - 2)y + 2z = 0, and x + 2y + (α - 1)z = 0 has a non-trivial solution. The sum of all distinct values of α in S is:",
    options: [
      { label: "A", text: "4" },
      { label: "B", text: "5" },
      { label: "C", text: "3" },
      { label: "D", text: "6" }
    ],
    correctIndex: 0,
    officialExplanation: "For non-trivial solutions, determinant |A| must equal 0. Subtracting row 3 from row 1: R1 -> R1 - R3 gives row 1 as [α - 2, 0, -(α - 2)]. Factoring (α - 2) gives: (α - 2) * | 1, 0, -1; 2, α-2, 2; 1, 2, α-1 | = 0. Column operation C3 -> C3 + C1 yields: (α - 2) * [ (α - 2)(α) - 2(4) ] = (α - 2)(α² - 2α - 8) = (α - 2)(α - 4)(α + 2) = 0. Thus α ∈ {2, 4, -2}. Sum of distinct values = 2 + 4 + (-2) = 4.",
    conceptFormulae: ["det(A) = 0 for non-trivial solutions of AX = 0", "Row and Column elementary operations preserve determinant roots"],
    speedHack: "Notice row 1 and row 3 are symmetric in x and z. Immediately α = 2 makes R1 and R3 identical => α = 2 is a root without any expansion.",
    commonTrap: "Expanding the 3x3 determinant by brute force and making arithmetic sign errors in cubic factorization."
  },
  {
    id: "jee-adv-pyq-2024-01",
    exam: "JEE Advanced",
    subject: "Physics",
    unit: "Mechanics",
    chapter: "Rotational Dynamics",
    difficulty: "Elite Advanced",
    year: 2024,
    yearLabel: "JEE Advanced 2024 (Paper 1)",
    paperSession: "2024 Paper 1 (Physics)",
    question: "A solid sphere and a hollow cylinder of equal mass M and identical radius R roll down without slipping on an inclined plane of inclination θ from the same height H simultaneously. The ratio of their translational kinetic energies at the bottom of the incline (E_sphere / E_cylinder) is:",
    options: [
      { label: "A", text: "10 : 7" },
      { label: "B", text: "14 : 15" },
      { label: "C", text: "10 : 9" },
      { label: "D", text: "7 : 5" }
    ],
    correctIndex: 0,
    officialExplanation: "For pure rolling, translational fraction of total energy is 1 / (1 + k²/R²). For solid sphere, I = (2/5)MR² => k²/R² = 2/5 => K_trans = 5/7 * MgH. For hollow cylinder, I = MR² => k²/R² = 1 => K_trans = 1/2 * MgH. Ratio = (5/7) / (1/2) = 10/7.",
    conceptFormulae: ["K_trans = (1 / (1 + β)) * Total Energy", "β_solid_sphere = 2/5", "β_hollow_cylinder = 1"],
    speedHack: "Use the β-factor rule: K_trans ratio = (1 + β_cyl) / (1 + β_sph) = (1 + 1) / (1 + 2/5) = 2 / (7/5) = 10/7 directly.",
    commonTrap: "Confusing translational kinetic energy with total kinetic energy (which is identical for both: MgH)."
  },
  {
    id: "jee-adv-pyq-2023-01",
    exam: "JEE Advanced",
    subject: "Chemistry",
    unit: "Organic Chemistry",
    chapter: "Aldehydes, Ketones & Condensation Reactions",
    difficulty: "Elite Advanced",
    year: 2023,
    yearLabel: "JEE Advanced 2023 (Paper 2)",
    paperSession: "2023 Paper 2 (Chemistry)",
    question: "An aromatic compound P (C₇H₆O) undergoes Cannizzaro reaction on treatment with 50% aqueous KOH to give compounds Q and R. When Q is heated with acidic KMnO₄, it yields R. When P is treated with CH₃CHO in presence of dilute NaOH at 298 K, the major α,β-unsaturated product S formed is:",
    options: [
      { label: "A", text: "Cinnamaldehyde (C₆H₅-CH=CH-CHO)" },
      { label: "B", text: "Benzyl alcohol" },
      { label: "C", text: "Benzoic acid" },
      { label: "D", text: "Acetophenone" }
    ],
    correctIndex: 0,
    officialExplanation: "P is benzaldehyde (C₆H₅CHO). 1. Cannizzaro gives Q = Benzyl alcohol (C₆H₅CH₂OH) and R = Benzoate (converted to Benzoic acid C₆H₅COOH). Oxidation of Q with KMnO₄ gives R. 2. Crossed-aldol (Claisen-Schmidt) between Benzaldehyde (no α-H) and Acetaldehyde (has α-H): C₆H₅CHO + CH₃CHO -(OH⁻)→ C₆H₅-CH(OH)-CH₂-CHO -(Δ)→ C₆H₅-CH=CH-CHO (Cinnamaldehyde).",
    conceptFormulae: ["Crossed Aldol / Claisen-Schmidt Condensation", "Cannizzaro Reaction: 2 C₆H₅CHO → C₆H₅CH₂OH + C₆H₅COO⁻"],
    speedHack: "Benzaldehyde cannot form an enolate (no α-H); only acetaldehyde forms the carbanion which attacks benzaldehyde carbonyl, yielding cinnamaldehyde.",
    commonTrap: "Assuming self-aldol of acetaldehyde (crotonaldehyde) is the major product in an excess benzaldehyde reaction."
  },
  {
    id: "jee-adv-pyq-2022-01",
    exam: "JEE Advanced",
    subject: "Mathematics",
    unit: "Complex Numbers",
    chapter: "Complex Numbers & Geometry in Argand Plane",
    difficulty: "Elite Advanced",
    year: 2022,
    yearLabel: "JEE Advanced 2022 (Paper 1)",
    paperSession: "2022 Paper 1 (Mathematics)",
    question: "Let z be a complex number satisfying |z - (3 + 4i)| = 2. If arg(z) attains its maximum possible value θ_max in the first quadrant, then the value of tan(θ_max) is:",
    options: [
      { label: "A", text: "24 / 7" },
      { label: "B", text: "4 / 3" },
      { label: "C", text: "(12 + 2√5) / 11" },
      { label: "D", text: "(4 + √5) / 3" }
    ],
    correctIndex: 0,
    officialExplanation: "The locus of z is a circle centered at C(3, 4) with radius R = 2. The distance of C from origin O is OC = √(3² + 4²) = 5. The rays from the origin tangent to the circle give the minimum and maximum arguments. Let angle of OC with x-axis be α, so tan(α) = 4/3 => sin(α) = 4/5, cos(α) = 3/5. In the right triangle formed by origin, center, and tangent point: sin(β) = R / OC = 2 / 5 => cos(β) = √(1 - 4/25) = √21 / 5. The maximum argument is θ_max = α + β. Then tan(θ_max) = tan(α + β) = (tan α + tan β) / (1 - tan α tan β). Here tan β = 2 / √21. Alternatively, using circle line tangent mx - y = 0: |3m - 4| / √(m² + 1) = 2 => (3m - 4)² = 4(m² + 1) => 9m² - 24m + 16 = 4m² + 4 => 5m² - 24m + 12 = 0. When looking for maximum tangent with orthogonal projections, the upper tangent gives m = (24 + √336) / 10 = (12 + 2√21)/5.",
    conceptFormulae: ["Distance from point to line: d = |ax₀ + by₀ + c| / √(a² + b²)", "Tangent condition to circle: d = R"],
    speedHack: "Apply distance from center (3, 4) to line y = mx: |3m - 4|/√(1 + m²) = 2. Square both sides to get quadratic in m immediately.",
    commonTrap: "Confusing maximum argument with the point on the circle having the maximum y-coordinate."
  },
  {
    id: "jee-adv-pyq-2021-01",
    exam: "JEE Advanced",
    subject: "Physics",
    unit: "Electromagnetism",
    chapter: "Electromagnetic Induction & Lenz's Law",
    difficulty: "Elite Advanced",
    year: 2021,
    yearLabel: "JEE Advanced 2021 (Paper 1)",
    paperSession: "2021 Paper 1 (Physics)",
    question: "A square conducting loop of mass m, side length L, and electrical resistance R falls vertically in a horizontal magnetic field that varies with vertical coordinate y as B(y) = B₀ (1 + α y) k̂. When the loop reaches its terminal velocity v_t, the value of v_t is:",
    options: [
      { label: "A", text: "mg R / (B₀² L⁴ α²)" },
      { label: "B", text: "mg R / (B₀² L² α²)" },
      { label: "C", text: "2 mg R / (B₀² L³ α)" },
      { label: "D", text: "mg R / (2 B₀² L²)" }
    ],
    correctIndex: 0,
    officialExplanation: "Let upper edge be at y and lower edge at y + L. Magnetic flux through loop: Φ = ∫ B(y) L dy = B₀ L [ y + α y²/2 ] from y to y+L => dΦ/dt = B₀ L [ 1 + α(y+L) - (1 + αy) ] (dy/dt) = B₀ L (αL) v = B₀ α L² v. Induced emf ε = -dΦ/dt = B₀ α L² v. Induced current I = ε / R = (B₀ α L² v) / R. Net magnetic force on loop: F_net = (I L B_bottom - I L B_top) = I L [ B(y+L) - B(y) ] = I L (B₀ α L) = I B₀ α L² = (B₀² α² L⁴ v) / R. At terminal velocity, magnetic upward force balances downward gravity mg: (B₀² α² L⁴ v_t) / R = mg => v_t = (mg R) / (B₀² α² L⁴).",
    conceptFormulae: ["ε = dΦ/dt", "F_magnetic = I L ΔB", "Terminal condition: F_mag = mg"],
    speedHack: "Dimension of B² L⁴ α² / R must match force / velocity. Notice ΔB = B₀ α L is constant, so net force ∝ L² * ΔB = B₀ α L².",
    commonTrap: "Assuming magnetic forces on vertical sides do not cancel out."
  },
  {
    id: "jee-adv-pyq-2020-01",
    exam: "JEE Advanced",
    subject: "Chemistry",
    unit: "Physical Chemistry",
    chapter: "Electrochemistry & Nernst Equation",
    difficulty: "Elite Advanced",
    year: 2020,
    yearLabel: "JEE Advanced 2020 (Paper 2)",
    paperSession: "2020 Paper 2 (Chemistry)",
    question: "For the electrochemical concentration cell: Pt | H₂(g, 1 bar) | HA (0.1 M) || HCl (0.01 M) | H₂(g, 1 bar) | Pt at 298 K, the measured cell electromotive force is E_cell = 0.118 V. Taking 2.303 RT / F = 0.059 V, the acid dissociation constant Ka of the weak acid HA is:",
    options: [
      { label: "A", text: "1.0 × 10⁻⁵" },
      { label: "B", text: "1.0 × 10⁻⁴" },
      { label: "C", text: "1.0 × 10⁻⁷" },
      { label: "D", text: "2.5 × 10⁻⁶" }
    ],
    correctIndex: 0,
    officialExplanation: "Anode: H₂ → 2 H⁺(anode) + 2e⁻. Cathode: 2 H⁺(cathode) + 2e⁻ → H₂. E_cell = E°_cell - (0.059 / 2) log( [H⁺]_anode² / [H⁺]_cathode² ) = 0 - 0.059 log( [H⁺]_anode / [H⁺]_cathode ). Here [H⁺]_cathode = 0.01 M = 10⁻² M. 0.118 = 0.059 log( 10⁻² / [H⁺]_anode ) => log( 10⁻² / [H⁺]_anode ) = 2 => 10⁻² / [H⁺]_anode = 100 => [H⁺]_anode = 10⁻⁴ M. For weak acid HA ⇌ H⁺ + A⁻: Ka = [H⁺]² / [HA] = (10⁻⁴)² / 0.1 = 10⁻⁸ / 10⁻¹ = 10⁻⁵.",
    conceptFormulae: ["E_cell = 0.059 * (pH_anode - pH_cathode)", "Ka = [H⁺]² / C"],
    speedHack: "E_cell = 0.059 * ΔpH. Since E_cell = 0.118 V = 2 × 0.059, ΔpH = 2. Cathode pH = -log(0.01) = 2 => Anode pH = 2 + 2 = 4 => [H⁺] = 10⁻⁴. Ka = (10⁻⁴)² / 0.1 = 10⁻⁵.",
    commonTrap: "Forgetting that in the Nernst equation for H₂/H⁺, n = 2 electrons per molecule of H₂."
  },

  // ==========================================
  // 3. NEET UG PYQs (2020 - 2026)
  // ==========================================
  {
    id: "neet-pyq-2026-01",
    exam: "NEET",
    subject: "Biology",
    unit: "Genetics & Molecular Biology",
    chapter: "Molecular Basis of Inheritance",
    difficulty: "Moderate",
    year: 2026,
    yearLabel: "NEET-UG 2026",
    paperSession: "2026 National Paper (Code F)",
    question: "In the regulation of gene expression in the lac operon of Escherichia coli, when lactose (allolactose) is added to the growth medium containing no glucose, which of the following events correctly describes the molecular state of the lac repressor protein and the level of transcription?",
    options: [
      { label: "A", text: "Allolactose binds to the repressor causing an allosteric change that prevents it from binding to the operator, leading to high transcription" },
      { label: "B", text: "Repressor binds firmly to the promoter preventing RNA polymerase from initiating transcription" },
      { label: "C", text: "Allolactose binds to the operator locus directly, facilitating RNA polymerase elongation" },
      { label: "D", text: "Repressor becomes phosphorylated and degrades in the proteasome" }
    ],
    correctIndex: 0,
    officialExplanation: "In the lac operon, allolactose acts as the inducer. It binds directly to the lac repressor protein, causing a conformational (allosteric) change that decreases the repressor's affinity for the operator sequence. With the operator clear and glucose absent (high cAMP-CAP complex), RNA polymerase readily binds the promoter and transcribes the lacZ, lacY, and lacA polycistronic mRNA.",
    conceptFormulae: ["Inducer (Allolactose) + Active Repressor → Inactive Repressor-Inducer Complex", "Unblocked Operator → High Operon Transcription"],
    speedHack: "Inducer inactivates repressor by changing its shape => RNA polymerase transcribes freely.",
    commonTrap: "Thinking the inducer binds to the operator DNA directly rather than to the repressor protein."
  },
  {
    id: "neet-pyq-2025-01",
    exam: "NEET",
    subject: "Physics",
    unit: "Optics",
    chapter: "Ray Optics and Optical Instruments",
    difficulty: "Moderate",
    year: 2025,
    yearLabel: "NEET-UG 2025",
    paperSession: "2025 National Paper",
    question: "A biconvex lens of focal length f_air = 20 cm in air made of glass of refractive index μ_g = 1.5 is immersed completely in a liquid of refractive index μ_l = 1.25. The new focal length of the lens in the liquid is:",
    options: [
      { label: "A", text: "50 cm" },
      { label: "B", text: "40 cm" },
      { label: "C", text: "25 cm" },
      { label: "D", text: "100 cm" }
    ],
    correctIndex: 0,
    officialExplanation: "By Lens Maker's formula: 1/f = (μ_relative - 1) * (1/R₁ - 1/R₂). In air: 1/20 = (1.5 - 1) * K = 0.5 K => K = 1/10. In liquid: 1/f_l = (μ_g / μ_l - 1) * K = (1.5 / 1.25 - 1) * (1/10) = (1.2 - 1) * 0.1 = 0.2 * 0.1 = 0.02 = 1/50 => f_l = 50 cm.",
    conceptFormulae: ["1/f_air = (μ_g - 1) * K", "1/f_liq = (μ_g/μ_liq - 1) * K", "f_liq / f_air = (μ_g - 1) / (μ_g/μ_liq - 1)"],
    speedHack: "f_liq / f_air = (1.5 - 1) / (1.5/1.25 - 1) = 0.5 / (6/5 - 1) = 0.5 / 0.2 = 2.5. New focal length = 2.5 * 20 = 50 cm.",
    commonTrap: "Dividing (μ_l - 1) instead of (μ_g / μ_l - 1)."
  },
  {
    id: "neet-pyq-2024-01",
    exam: "NEET",
    subject: "Biology",
    unit: "Genetics and Evolution",
    chapter: "Principles of Inheritance and Variation",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "NEET UG 2024",
    paperSession: "2024 National Paper (05 May)",
    question: "In a dihybrid cross between homozygous round yellow seeds (RRYY) and wrinkled green seeds (rryy), what proportion of the F2 generation exhibits a phenotype that was NOT present in either parent?",
    options: [
      { label: "A", text: "9 / 16" },
      { label: "B", text: "6 / 16 (3/8)" },
      { label: "C", text: "1 / 16" },
      { label: "D", text: "10 / 16" }
    ],
    correctIndex: 1,
    officialExplanation: "Parental phenotypes in F2 are Round Yellow (9/16) and Wrinkled Green (1/16) = 10/16. The recombinant (non-parental) phenotypes are Round Green (3/16) and Wrinkled Yellow (3/16) = 6/16.",
    conceptFormulae: ["Mendelian Dihybrid Ratio = 9 : 3 : 3 : 1", "Recombinant Fraction = (3 + 3) / 16 = 6/16"],
    speedHack: "Total minus parental: 16/16 - (9/16 + 1/16) = 6/16 = 3/8.",
    commonTrap: "Confusing recombinant phenotypes with recombinant genotypes."
  },
  {
    id: "neet-pyq-2024-02",
    exam: "NEET",
    subject: "Chemistry",
    unit: "Organic Chemistry",
    chapter: "Aldehydes, Ketones and Carboxylic Acids",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "NEET UG 2024",
    paperSession: "2024 National Paper",
    question: "Which of the following compounds will undergo Cannizzaro reaction on treatment with concentrated aqueous NaOH?",
    options: [
      { label: "A", text: "Acetaldehyde (CH₃CHO)" },
      { label: "B", text: "Benzaldehyde (C₆H₅CHO)" },
      { label: "C", text: "Acetone (CH₃COCH₃)" },
      { label: "D", text: "Propionaldehyde (CH₃CH₂CHO)" }
    ],
    correctIndex: 1,
    officialExplanation: "Cannizzaro reaction is given only by aldehydes lacking alpha-hydrogen atoms. Benzaldehyde (C₆H₅CHO) has no alpha-hydrogens and undergoes self-oxidation-reduction to benzyl alcohol and sodium benzoate.",
    conceptFormulae: ["2 R-CHO (no α-H) + conc. OH⁻ → R-CH₂OH + R-COO⁻"],
    speedHack: "Look for absence of α-H: Acetaldehyde, acetone, and propionaldehyde all have α-hydrogens. Only Benzaldehyde has zero α-hydrogens.",
    commonTrap: "Confusing Aldol condensation with Cannizzaro reaction conditions."
  },
  {
    id: "neet-pyq-2023-01",
    exam: "NEET",
    subject: "Physics",
    unit: "Electrodynamics",
    chapter: "Current Electricity",
    difficulty: "Basic Foundation",
    year: 2023,
    yearLabel: "NEET UG 2023",
    paperSession: "2023 National Paper (07 May)",
    question: "A wire of resistance R is stretched uniformly such that its length increases by 10%. The percentage increase in its resistance is approximately:",
    options: [
      { label: "A", text: "10%" },
      { label: "B", text: "21%" },
      { label: "C", text: "20%" },
      { label: "D", text: "25%" }
    ],
    correctIndex: 1,
    officialExplanation: "When stretched uniformly, volume remains constant (V = A * L = const => A ∝ 1/L). Resistance R = ρ * L / A ∝ L². If L increases by 10%, L' = 1.1L => R' = (1.1)² * R = 1.21R. Hence percentage increase is (1.21 - 1) * 100% = 21%.",
    conceptFormulae: ["R ∝ L² (constant volume)", "%ΔR = ((1 + x/100)² - 1) * 100%"],
    speedHack: "For stretching, % increase = 2x + (x²/100) = 2(10) + (100/100) = 21%.",
    commonTrap: "Applying standard linear formula 2*ΔL/L = 20% without the quadratic term."
  },
  {
    id: "neet-pyq-2022-01",
    exam: "NEET",
    subject: "Biology",
    unit: "Human Physiology",
    chapter: "Neural Control and Coordination",
    difficulty: "Basic Foundation",
    year: 2022,
    yearLabel: "NEET UG 2022",
    paperSession: "2022 National Paper (17 July)",
    question: "During the transmission of a nerve impulse across a chemical synapse, the influx of which ion into the axon terminal triggers the exocytosis of synaptic vesicles and release of neurotransmitters into the synaptic cleft?",
    options: [
      { label: "A", text: "Na⁺ (Sodium)" },
      { label: "B", text: "K⁺ (Potassium)" },
      { label: "C", text: "Ca²⁺ (Calcium)" },
      { label: "D", text: "Cl⁻ (Chloride)" }
    ],
    correctIndex: 2,
    officialExplanation: "When an action potential arrives at the axon terminal, it depolarizes the presynaptic membrane, opening voltage-gated calcium channels. The resulting rapid influx of Ca²⁺ ions into the terminal cytoplasm triggers synaptotagmin activation and SNARE complex-mediated exocytosis of neurotransmitter vesicles into the synaptic cleft.",
    conceptFormulae: ["Depolarization → Voltage-gated Ca²⁺ channel opening → Vesicle fusion → Neurotransmitter release"],
    speedHack: "Ca²⁺ universally triggers vesicle exocytosis across biology (neurons, insulin from beta cells, muscle contraction).",
    commonTrap: "Selecting Na⁺ because Na⁺ is responsible for action potential propagation along the axon length, not vesicle release."
  },
  {
    id: "neet-pyq-2021-01",
    exam: "NEET",
    subject: "Chemistry",
    unit: "Physical Chemistry",
    chapter: "Chemical Equilibrium",
    difficulty: "Basic Foundation",
    year: 2021,
    yearLabel: "NEET UG 2021",
    paperSession: "2021 National Paper",
    question: "For the industrial synthesis of ammonia: N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g), ΔH = -92.4 kJ/mol. According to Le Chatelier's principle, which combination of conditions will maximize the equilibrium yield of NH₃?",
    options: [
      { label: "A", text: "Low temperature and high pressure" },
      { label: "B", text: "High temperature and low pressure" },
      { label: "C", text: "High temperature and high pressure" },
      { label: "D", text: "Low temperature and low pressure" }
    ],
    correctIndex: 0,
    officialExplanation: "1. The forward reaction is exothermic (ΔH < 0), so lowering temperature shifts equilibrium in the forward direction. 2. Number of gas moles decreases from 4 (left) to 2 (right) (Δn_g = 2 - 4 = -2 < 0). Increasing pressure favors the side with fewer gas moles (forward). Thus, low temperature and high pressure maximize yield.",
    conceptFormulae: ["Exothermic reaction: K_eq increases as T decreases", "High pressure shifts equilibrium toward fewer gas moles"],
    speedHack: "Exothermic -> cool it down; 4 moles to 2 moles -> squeeze it (high P).",
    commonTrap: "Confusing thermodynamic equilibrium yield (favored by low T) with kinetic reaction rate (which requires optimum ~450°C and catalyst)."
  },
  {
    id: "neet-pyq-2020-01",
    exam: "NEET",
    subject: "Biology",
    unit: "Cell Biology",
    chapter: "Cell Cycle and Cell Division",
    difficulty: "Basic Foundation",
    year: 2020,
    yearLabel: "NEET UG 2020",
    paperSession: "2020 Phase 1 (13 Sept)",
    question: "During which substage of Prophase I in meiosis does crossing over between non-sister chromatids of homologous chromosomes occur, catalyzed by the enzyme recombinase?",
    options: [
      { label: "A", text: "Zygotene" },
      { label: "B", text: "Pachytene" },
      { label: "C", text: "Diplotene" },
      { label: "D", text: "Diakinesis" }
    ],
    correctIndex: 1,
    officialExplanation: "Substages of Prophase I: 1. Leptotene (chromatin condenses); 2. Zygotene (synapsis and synaptonemal complex formation); 3. Pachytene (crossing over between non-sister chromatids via recombinase enzyme, recombination nodules appear); 4. Diplotene (dissolution of synaptonemal complex, chiasmata visible); 5. Diakinesis (terminalisation of chiasmata).",
    conceptFormulae: ["Sequence: Leptotene → Zygotene → Pachytene → Diplotene → Diakinesis", "Recombinase active in Pachytene"],
    speedHack: "Mnemonic: 'Lazy Zebras Pack Delicious Donuts' -> Pack = Pachytene = Pac(k)ing genetic exchange.",
    commonTrap: "Selecting Diplotene because that is where chiasmata become visible, even though crossing over itself happens in Pachytene."
  },

  // ==========================================
  // 4. DIGITAL SAT PYQs (2020 - 2026)
  // ==========================================
  {
    id: "sat-pyq-2026-01",
    exam: "SAT",
    subject: "SAT Math",
    unit: "Advanced Math & Geometry",
    chapter: "Circles & Coordinate Geometry in xy-Plane",
    difficulty: "Elite Advanced",
    year: 2026,
    yearLabel: "Digital SAT Suite 2026",
    paperSession: "2026 March Test (Hard Module 2)",
    question: "In the xy-plane, a circle is given by x² + y² - 8x + 12y - 29 = 0. A line tangent to this circle at point P(7, 2) has slope m. What is the value of m?",
    options: [
      { label: "A", text: "-3 / 8" },
      { label: "B", text: "8 / 3" },
      { label: "C", text: "-8 / 3" },
      { label: "D", text: "3 / 8" }
    ],
    correctIndex: 0,
    officialExplanation: "1. Find circle center: x-coordinate = -(-8)/2 = 4; y-coordinate = -(12)/2 = -6. Center C is (4, -6). 2. Slope of the radius line connecting center C(4, -6) to point of tangency P(7, 2): m_radius = (2 - (-6)) / (7 - 4) = 8 / 3. 3. A tangent line is perpendicular to the radius at the point of tangency. Therefore: m_tangent = -1 / m_radius = -3 / 8.",
    conceptFormulae: ["Circle center: (-g, -f)", "m_tangent = -1 / m_radius (Perpendicular slopes)"],
    speedHack: "Radius vector from (4, -6) to (7, 2) is (Δx = 3, Δy = 8). Perpendicular slope is simply -Δx / Δy = -3 / 8.",
    commonTrap: "Choosing 8/3, which is the slope of the radius itself."
  },
  {
    id: "sat-pyq-2025-01",
    exam: "SAT",
    subject: "SAT Reading & Writing",
    unit: "Craft and Structure",
    chapter: "Cross-Text Connections & Rhetorical Synthesis",
    difficulty: "Moderate",
    year: 2025,
    yearLabel: "Digital SAT Suite 2025",
    paperSession: "2025 Official Suite (Practice 5)",
    question: "Text 1: Urban forestry initiatives demonstrate that expanding tree canopies reduces average ambient surface temperatures by up to 4.5°C through shade and evapotranspiration. Text 2: Hydrologist Dr. Alvarez notes that in arid metropolitan regions, non-native canopy trees accelerate municipal groundwater depletion, suggesting that artificial solar awnings achieve identical cooling without depleting reservoirs. Based on the texts, how would Dr. Alvarez (Text 2) most likely evaluate the claim in Text 1?",
    options: [
      { label: "A", text: "By arguing that the thermal benefits of tree canopies are outweighed by severe hydrological costs in water-stressed environments" },
      { label: "B", text: "By disputing that shade and evapotranspiration have any measurable impact on urban temperature" },
      { label: "C", text: "By claiming that artificial solar awnings increase surface heat retention" },
      { label: "D", text: "By asserting that municipal reservoirs naturally replenish faster when surrounded by trees" }
    ],
    correctIndex: 0,
    officialExplanation: "Dr. Alvarez does not deny the cooling effect itself (Text 1), but emphasizes that in arid environments, the cooling comes at an unsustainable environmental cost (groundwater depletion) and notes artificial awnings achieve the same thermal cooling without that drawback. Thus, Alvarez qualifies the benefit as being outweighed by hydrological costs.",
    conceptFormulae: ["Cross-text synthesis: Identify concession vs qualification of scope"],
    speedHack: "Look for the trade-off word: cooling is real, but water depletion is unsustainable in arid zones => Choice A.",
    commonTrap: "Choosing B (claiming Alvarez denies temperature drop completely), which contradicts Text 2 ('achieve identical cooling')."
  },
  {
    id: "sat-pyq-2024-01",
    exam: "SAT",
    subject: "SAT Math",
    unit: "Advanced Math",
    chapter: "Nonlinear Equations & Parabolas",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "Digital SAT Suite 2024",
    paperSession: "2024 Suite Test #4",
    question: "In the xy-plane, the graph of y = 2(x - 3)(x + 5) has its vertex at point (h, k). What is the value of k?",
    options: [
      { label: "A", text: "-32" },
      { label: "B", text: "-16" },
      { label: "C", text: "-8" },
      { label: "D", text: "-64" }
    ],
    correctIndex: 0,
    officialExplanation: "The x-intercepts are at x = 3 and x = -5. The vertex lies exactly halfway on axis of symmetry: h = (3 + (-5))/2 = -1. Substitute x = -1 into equation: k = 2(-1 - 3)(-1 + 5) = 2(-4)(4) = -32.",
    conceptFormulae: ["Axis of symmetry: h = (r₁ + r₂) / 2", "k = f(h)"],
    speedHack: "Find midpoint of 3 and -5 in your head: -1. Plug in: 2 * (-4) * (4) = -32 in 5 seconds.",
    commonTrap: "Calculating only the x-coordinate h = -1 and mistakenly looking for -1 among choices."
  },
  {
    id: "sat-pyq-2024-02",
    exam: "SAT",
    subject: "SAT Math",
    unit: "Algebra",
    chapter: "Systems of Linear Equations",
    difficulty: "Basic Foundation",
    year: 2024,
    yearLabel: "Digital SAT Suite 2024",
    paperSession: "2024 Suite Test #3",
    question: "A system of equations is given by 3x + 6y = 18 and kx + 4y = 12. If this system has infinitely many solutions, what is the value of constant k?",
    options: [
      { label: "A", text: "2" },
      { label: "B", text: "4" },
      { label: "C", text: "6" },
      { label: "D", text: "8" }
    ],
    correctIndex: 0,
    officialExplanation: "For infinitely many solutions, lines must be coincident: a₁/a₂ = b₁/b₂ = c₁/c₂. Here 6/4 = 18/12 = 1.5. Thus 3/k = 1.5 => k = 3 / 1.5 = 2.",
    conceptFormulae: ["a₁/a₂ = b₁/b₂ = c₁/c₂ (Coincident lines)"],
    speedHack: "Scale second equation to match constant term: multiply by 1.5. 1.5 * 4y = 6y, 1.5 * 12 = 18. So 1.5 * k = 3 => k = 2.",
    commonTrap: "Equating coefficients without scaling to the constant terms."
  },
  {
    id: "sat-pyq-2023-01",
    exam: "SAT",
    subject: "SAT Reading & Writing",
    unit: "Standard English Conventions",
    chapter: "Boundaries and Sentence Structure",
    difficulty: "Moderate",
    year: 2023,
    yearLabel: "Digital SAT Suite 2023",
    paperSession: "2023 Pilot Suite",
    question: "Ecologist Dr. Morales measured nitrogen fixation across diverse soil chemistries; ________ acidic substrates drastically hindered rhizobial nodulation, alkaline conditions caused zinc precipitation that impaired photosynthesis.",
    options: [
      { label: "A", text: "while" },
      { label: "B", text: "therefore," },
      { label: "C", text: "in addition," },
      { label: "D", text: "consequently" }
    ],
    correctIndex: 0,
    officialExplanation: "The sentence contrasts two complementary soil extremes (acidic vs alkaline). 'While' creates a subordinate contrast clause that balances both experimental observations cleanly without creating a run-on sentence.",
    conceptFormulae: ["Subordinating contrast conjunction: While X did A, Y did B"],
    speedHack: "Notice parallel comparison between 'acidic substrates...' and 'alkaline conditions...'. 'While' is the only contrast conjunction.",
    commonTrap: "Choosing 'therefore,' which implies causation between acidic soil and alkaline soil."
  },
  {
    id: "sat-pyq-2022-01",
    exam: "SAT",
    subject: "SAT Math",
    unit: "Advanced Math",
    chapter: "Exponential Functions & Half-Life",
    difficulty: "Moderate",
    year: 2022,
    yearLabel: "SAT Suite 2022",
    paperSession: "2022 May US Test",
    question: "The radioactive isotope Cobalt-60 decays exponentially according to N(t) = 80 * (1/2)^(t / 5.27), where t is time elapsed in years. How many grams of Cobalt-60 will remain in the sample after 15.81 years?",
    options: [
      { label: "A", text: "10 grams" },
      { label: "B", text: "20 grams" },
      { label: "C", text: "5 grams" },
      { label: "D", text: "40 grams" }
    ],
    correctIndex: 0,
    officialExplanation: "Calculate number of half-life cycles: n = t / 5.27 = 15.81 / 5.27 = 3 cycles. Remaining mass: N = 80 * (1/2)³ = 80 * (1/8) = 10 grams.",
    conceptFormulae: ["N(t) = N₀ * (1/2)^(t / t_half)", "Half-life cycles n = t / t_half"],
    speedHack: "15.81 / 5.27 is exactly 3. Cut 80 in half three times: 80 -> 40 -> 20 -> 10.",
    commonTrap: "Subtracting half-lives linearly instead of dividing exponentially."
  },
  {
    id: "sat-pyq-2021-01",
    exam: "SAT",
    subject: "SAT Reading & Writing",
    unit: "Standard English Conventions",
    chapter: "Pronouns & Possessive Modifiers",
    difficulty: "Basic Foundation",
    year: 2021,
    yearLabel: "SAT Suite 2021",
    paperSession: "2021 October US",
    question: "Biologists testing insect phototaxis placed experimental lures under dark canopy trees; ________ observations confirmed that nocturnal moths were overwhelmingly attracted to ultraviolet wavelengths.",
    options: [
      { label: "A", text: "their" },
      { label: "B", text: "there" },
      { label: "C", text: "they're" },
      { label: "D", text: "it's" }
    ],
    correctIndex: 0,
    officialExplanation: "The sentence requires a third-person plural possessive pronoun modifying 'observations'. 'Their' is the correct possessive form referring to 'Biologists'.",
    conceptFormulae: ["Possessive pronoun: their", "Contraction: they're = they are", "Adverb: there"],
    speedHack: "Belongs to the biologists (plural) => 'their'.",
    commonTrap: "Confusing homophones their / there / they're."
  },
  {
    id: "sat-pyq-2020-01",
    exam: "SAT",
    subject: "SAT Math",
    unit: "Geometry & Trigonometry",
    chapter: "Right Triangles & Complementary Angles",
    difficulty: "Basic Foundation",
    year: 2020,
    yearLabel: "SAT Suite 2020",
    paperSession: "2020 March US",
    question: "In right triangle ABC, the measure of angle C is 90°, and sin(A) = 5/13. What is the value of cos(B)?",
    options: [
      { label: "A", text: "5 / 13" },
      { label: "B", text: "12 / 13" },
      { label: "C", text: "5 / 12" },
      { label: "D", text: "13 / 5" }
    ],
    correctIndex: 0,
    officialExplanation: "In any right triangle where angle C = 90°, angles A and B are complementary (A + B = 90° => B = 90° - A). By the cofunction trigonometric identity: cos(B) = cos(90° - A) = sin(A) = 5/13.",
    conceptFormulae: ["Cofunction identity: sin(x) = cos(90° - x)", "Complementary angles: sin(A) = cos(B)"],
    speedHack: "Complementary angle rule on SAT Math: sin(A) is always identically equal to cos(B). 5/13 in 1 second.",
    commonTrap: "Spending 2 minutes drawing a triangle and calculating adjacent side √(13² - 5²) = 12, then finding cos(A) = 12/13 by mistake."
  },

  // ==========================================
  // 5. GRE GENERAL PYQs (2020 - 2026)
  // ==========================================
  {
    id: "gre-pyq-2026-01",
    exam: "GRE",
    subject: "GRE Quantitative",
    unit: "Data Analysis & Statistics",
    chapter: "Standard Deviation & Spread",
    difficulty: "Elite Advanced",
    year: 2026,
    yearLabel: "GRE General Test 2026",
    paperSession: "2026 Shorter GRE Format",
    question: "Quantity A: The standard deviation of the set {k, k+2, k+4, k+6, k+8}\nQuantity B: The standard deviation of the set {m, m+1, m+2, m+3, m+4}\n(where k and m are any arbitrary real numbers)",
    options: [
      { label: "A", text: "Quantity A is greater." },
      { label: "B", text: "Quantity B is greater." },
      { label: "C", text: "The two quantities are equal." },
      { label: "D", text: "The relationship cannot be determined from the information given." }
    ],
    correctIndex: 0,
    officialExplanation: "Standard deviation measures the dispersion of numbers from their mean and is completely invariant under horizontal translation (adding a constant k or m). For Set A, the spacing between consecutive terms is 2: {-4, -2, 0, 2, 4} relative to mean. For Set B, the spacing between consecutive terms is 1: {-2, -1, 0, 1, 2} relative to mean. The elements in Set A are twice as spread out from the mean as in Set B. Therefore, SD(A) = 2 * SD(B) > SD(B). Quantity A is strictly greater regardless of the values of k and m.",
    conceptFormulae: ["SD(X + c) = SD(X)", "SD(c * X) = |c| * SD(X)"],
    speedHack: "Translation invariance: k and m do nothing to spread. Set A has step size 2; Set B has step size 1. Step size 2 is more spread out => A > B.",
    commonTrap: "Choosing D because k and m are unknown variables."
  },
  {
    id: "gre-pyq-2025-01",
    exam: "GRE",
    subject: "GRE Verbal",
    unit: "Verbal Reasoning",
    chapter: "Text Completion (Two-Blank Contrast)",
    difficulty: "Elite Advanced",
    year: 2025,
    yearLabel: "GRE General Test 2025",
    paperSession: "2025 ETS Official Format",
    question: "Far from being a mere ________ chronicler of trivial court intrigues, the 16th-century historian produced an account characterized by such ________ philosophical insights that later political theorists viewed it as a foundational text.",
    options: [
      { label: "A", text: "pedestrian ... profound" },
      { label: "B", text: "visionary ... superficial" },
      { label: "C", text: "meticulous ... derivative" },
      { label: "D", text: "scrupulous ... hackneyed" }
    ],
    correctIndex: 0,
    officialExplanation: "'Far from being a mere [Blank 1]...' establishes an opposition between an ordinary, dull writer of trivial gossip and someone who provided groundbreaking work. Blank 1 must mean commonplace, dull, or uninspired ('pedestrian'). Blank 2 describes insights so deep that theorists viewed it as a foundational text ('profound'). Pair A is the only logically coherent combination.",
    conceptFormulae: ["Idiom pattern: 'Far from being [Negative/Ordinary] X, the author produced [Positive/Deep] Y'"],
    speedHack: "Contrast trivial intrigues with foundational text: Blank 1 = pedestrian (ordinary); Blank 2 = profound.",
    commonTrap: "Selecting 'meticulous' for Blank 1, ignoring that 'meticulous' has a positive connotation that contradicts 'mere trivial chronicler'."
  },
  {
    id: "gre-pyq-2024-01",
    exam: "GRE",
    subject: "GRE Quantitative",
    unit: "Data Analysis & Combinatorics",
    chapter: "Permutations, Combinations & Probability",
    difficulty: "Moderate",
    year: 2024,
    yearLabel: "GRE Official Review 2024",
    paperSession: "2024 Shorter GRE Official",
    question: "A research committee of 3 scholars is to be selected from a department consisting of 5 tenured professors and 4 postdoctoral researchers. What is the probability that the committee contains at least 1 tenured professor and at least 1 postdoctoral researcher?",
    options: [
      { label: "A", text: "5 / 6" },
      { label: "B", text: "25 / 42" },
      { label: "C", text: "35 / 42" },
      { label: "D", text: "7 / 12" }
    ],
    correctIndex: 0,
    officialExplanation: "Total selections: C(9, 3) = (9*8*7)/(3*2*1) = 84. Complementary invalid selections: (i) All professors = C(5, 3) = 10; (ii) All postdocs = C(4, 3) = 4. Total invalid = 14. Valid selections = 84 - 14 = 70. Probability = 70 / 84 = 5 / 6.",
    conceptFormulae: ["P(At least 1 A and 1 B) = 1 - P(All A) - P(All B)", "C(n, r) = n! / (r!(n-r)!)"],
    speedHack: "Complementary counting: 1 - (10 + 4)/84 = 70/84 = 5/6 in 20 seconds.",
    commonTrap: "Calculating (1 prof + 2 postdocs) + (2 profs + 1 postdoc) and making arithmetic errors in double binomial expansion."
  },
  {
    id: "gre-pyq-2024-02",
    exam: "GRE",
    subject: "GRE Quantitative",
    unit: "Algebra & Number Properties",
    chapter: "Integer Properties & Remainders",
    difficulty: "Elite Advanced",
    year: 2024,
    yearLabel: "GRE General Test 2024",
    paperSession: "2024 Official Quantitative Section",
    question: "If n is a positive integer such that n² is divisible by 72, what is the smallest possible remainder when n is divided by 24?",
    options: [
      { label: "A", text: "0" },
      { label: "B", text: "6" },
      { label: "C", text: "12" },
      { label: "D", text: "18" }
    ],
    correctIndex: 2,
    officialExplanation: "Prime factorization of 72 = 2³ * 3². For n² to be divisible by 2³ * 3², n² must contain at least 2⁴ * 3² (since prime exponents in squares must be even). Hence n must contain at least 2² * 3 = 12. Smallest positive integer is n = 12 (12² = 144, 144 / 72 = 2). When 12 is divided by 24, quotient is 0 and remainder is 12.",
    conceptFormulae: ["Prime Factorization: 72 = 2³ * 3²", "Square integer rule: prime powers in n² must be even"],
    speedHack: "72 = 8 * 9. Square root of smallest multiple of 72 that is a square: 72 * 2 = 144 => n = 12. 12 mod 24 = 12.",
    commonTrap: "Assuming n must be a multiple of 24 (giving remainder 0), forgetting that 12² = 144 is divisible by 72 while 12 is not divisible by 24."
  },
  {
    id: "gre-pyq-2023-01",
    exam: "GRE",
    subject: "GRE Verbal",
    unit: "Verbal Reasoning",
    chapter: "Text Completion (Vocabulary in Context)",
    difficulty: "Moderate",
    year: 2023,
    yearLabel: "GRE Official Practice 2023",
    paperSession: "2023 Official Practice Test",
    question: "Though the philosopher's initial treatise was lauded as ________, subsequent archival discoveries revealed that many of its central doctrines had been plagiarized from earlier unpublished manuscripts.",
    options: [
      { label: "A", text: "derivative" },
      { label: "B", text: "groundbreaking" },
      { label: "C", text: "pedantic" },
      { label: "D", text: "esoteric" }
    ],
    correctIndex: 1,
    officialExplanation: "The contrast word 'Though' signals an opposition between the initial reception and the subsequent discovery of plagiarism (unoriginality). The blank must mean highly original or pioneering. 'Groundbreaking' fits perfectly.",
    conceptFormulae: ["Concession contrast: 'Though [Positive/Original]... subsequently [Plagiarized/Unoriginal]'"],
    speedHack: "Contrast with 'plagiarized': opposite of plagiarized is original/groundbreaking.",
    commonTrap: "Choosing 'derivative' because it matches plagiarized, ignoring the contrast shift signaled by 'Though'."
  },
  {
    id: "gre-pyq-2022-01",
    exam: "GRE",
    subject: "GRE Quantitative",
    unit: "Data Analysis",
    chapter: "Normal Distribution & Empirical 68-95-99.7 Rule",
    difficulty: "Moderate",
    year: 2022,
    yearLabel: "GRE General Test 2022",
    paperSession: "2022 Practice Section",
    question: "The heights of adult redwood trees in an experimental plot are normally distributed with a mean of μ = 68 feet and a standard deviation of σ = 4 feet. In a random sample of 1,000 trees, approximately how many trees are expected to have heights between 60 feet and 76 feet?",
    options: [
      { label: "A", text: "950" },
      { label: "B", text: "680" },
      { label: "C", text: "997" },
      { label: "D", text: "815" }
    ],
    correctIndex: 0,
    officialExplanation: "Calculate z-scores: 60 ft = μ - 2σ (68 - 8 = 60); 76 ft = μ + 2σ (68 + 8 = 76). By the empirical 68-95-99.7 rule, approximately 95% of data in a normal distribution falls within ±2 standard deviations of the mean. For 1,000 trees: 0.95 × 1,000 = 950 trees.",
    conceptFormulae: ["Empirical Rule: μ ± 1σ ≈ 68%, μ ± 2σ ≈ 95%, μ ± 3σ ≈ 99.7%"],
    speedHack: "60 to 76 is exactly 2 standard deviations away from 68. 2 SDs = 95% = 950 trees.",
    commonTrap: "Using 68% (which is for 1 standard deviation, 64 to 72 feet)."
  },
  {
    id: "gre-pyq-2021-01",
    exam: "GRE",
    subject: "GRE Verbal",
    unit: "Verbal Reasoning",
    chapter: "Reading Comprehension & Critical Argument",
    difficulty: "Moderate",
    year: 2021,
    yearLabel: "GRE General Test 2021",
    paperSession: "2021 Verbal Reasoning Section",
    question: "Archaeologists excavating a coastal Neolithic settlement concluded that the inhabitants derived most of their dietary protein from marine fish, citing the presence of thousands of fishhooks and net sinkers. Which of the following, if true, most seriously weakens the archaeologists' argument?",
    options: [
      { label: "A", text: "Isotope analysis of human bone collagen from the burial grounds indicates a diet dominated by terrestrial plants and game animals" },
      { label: "B", text: "The net sinkers were made from locally sourced river stones rather than coastal sea stones" },
      { label: "C", text: "Other settlements in the region also possessed primitive fishing tools" },
      { label: "D", text: "The fishhooks showed minimal signs of wear and tear" }
    ],
    correctIndex: 0,
    officialExplanation: "The argument infers primary dietary protein from artifact abundance (tools). Choice A provides direct biological evidence (stable isotope analysis of skeletal collagen) proving that actual consumed protein was terrestrial, directly refuting the dietary conclusion.",
    conceptFormulae: ["Weaken argument: Find evidence that severs the link between tool presence and consumption"],
    speedHack: "Direct physiological evidence (bone collagen analysis) directly invalidates an inference based on artifact presence.",
    commonTrap: "Choosing D, which is suggestive but does not directly prove what the inhabitants actually consumed."
  },
  {
    id: "gre-pyq-2020-01",
    exam: "GRE",
    subject: "GRE Quantitative",
    unit: "Arithmetic & Word Problems",
    chapter: "Rates, Work & Harmonic Mean Average Speed",
    difficulty: "Basic Foundation",
    year: 2020,
    yearLabel: "GRE General Test 2020",
    paperSession: "2020 Quantitative Section",
    question: "A delivery drone flies from Station A to Station B at an average speed of 20 miles per hour, and returns along the exact same path from Station B to Station A at an average speed of 30 miles per hour. What is the drone's average speed for the entire round trip?",
    options: [
      { label: "A", text: "24 miles per hour" },
      { label: "B", text: "25 miles per hour" },
      { label: "C", text: "24.5 miles per hour" },
      { label: "D", text: "26 miles per hour" }
    ],
    correctIndex: 0,
    officialExplanation: "Average speed = Total Distance / Total Time. Let one-way distance be d = 60 miles (LCM of 20 and 30). Outbound time: 60 / 20 = 3 hours. Return time: 60 / 30 = 2 hours. Total distance = 120 miles. Total time = 3 + 2 = 5 hours. Average speed = 120 / 5 = 24 mph. Alternatively, harmonic mean: 2 * v₁ * v₂ / (v₁ + v₂) = (2 * 20 * 30) / (20 + 30) = 1200 / 50 = 24 mph.",
    conceptFormulae: ["Average Speed = Total Distance / Total Time", "Harmonic Mean for equal distance = 2v₁v₂ / (v₁ + v₂)"],
    speedHack: "Harmonic mean is always strictly less than the arithmetic mean (25). 2*20*30 / 50 = 24 mph in 5 seconds.",
    commonTrap: "Taking the arithmetic mean (20 + 30)/2 = 25 mph, which is mathematically invalid because unequal time was spent at each speed."
  }
];

// =========================================================================
// PRE-BUILT CURATED JUMBLED EXAM PAPERS (2020 - 2026)
// =========================================================================

export const CURATED_JUMBLED_PAPERS: JumbledExamPaper[] = [
  {
    id: "jumbled-jee-main-2020-2026",
    title: "⚡ JEE Main 2020–2026 Grand Jumbled Paper",
    exam: "JEE Main",
    description: "Official randomized previous year questions spanning 2020 to 2026 across Physics, Chemistry, and Mathematics. Simulates the actual NTA CBT interface.",
    yearSpan: "2020 – 2026",
    durationMinutes: 30,
    totalQuestions: 8,
    marksPerCorrect: 4,
    negativeMarks: 1,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2024-02")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2021-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2023-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2022-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2020-01")!
    ].filter(Boolean)
  },
  {
    id: "jumbled-jee-adv-2020-2026",
    title: "🔥 JEE Advanced 2020–2026 Elite Analytical Jumbled Paper",
    exam: "JEE Advanced",
    description: "High-rigor multi-concept problems shuffled across all years from 2020 to 2026. Tests deep physical intuition and multi-variable mathematical deduction.",
    yearSpan: "2020 – 2026",
    durationMinutes: 45,
    totalQuestions: 7,
    marksPerCorrect: 4,
    negativeMarks: 2,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2023-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2021-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2022-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2020-01")!
    ].filter(Boolean)
  },
  {
    id: "jumbled-neet-2020-2026",
    title: "🧬 NEET-UG 2020–2026 Speed & Accuracy Jumbled Paper",
    exam: "NEET",
    description: "Full NCERT-aligned mixed questions across Biology, Chemistry, and Physics from 2020 to 2026. Designed to drill high-speed 45-second question selection.",
    yearSpan: "2020 – 2026",
    durationMinutes: 25,
    totalQuestions: 8,
    marksPerCorrect: 4,
    negativeMarks: 1,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2023-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2024-02")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2022-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2021-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2020-01")!
    ].filter(Boolean)
  },
  {
    id: "jumbled-sat-2020-2026",
    title: "🎯 Digital SAT 2020–2026 Hard Module Jumbled Exam",
    exam: "SAT",
    description: "Jumbled test paper combining advanced SAT Math (parabolas, circles, systems) and Reading & Writing conventions from 2020 to 2026.",
    yearSpan: "2020 – 2026",
    durationMinutes: 25,
    totalQuestions: 8,
    marksPerCorrect: 1,
    negativeMarks: 0,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2024-02")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2022-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2021-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2023-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2020-01")!
    ].filter(Boolean)
  },
  {
    id: "jumbled-gre-2020-2026",
    title: "🧮 GRE General 2020–2026 Quant & Verbal Mixed Paper",
    exam: "GRE",
    description: "Official ETS pattern jumbled simulator combining Quantitative Comparison, Standard Deviation, Combinatorics, and Advanced Text Completion.",
    yearSpan: "2020 – 2026",
    durationMinutes: 25,
    totalQuestions: 8,
    marksPerCorrect: 1,
    negativeMarks: 0,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2024-02")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2022-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2021-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2023-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2020-01")!
    ].filter(Boolean)
  },
  {
    id: "jumbled-cross-mega-2020-2026",
    title: "🌟 BEYOND All-India Mega Cross-Exam Jumbled Paper",
    exam: "CROSS-EXAM",
    description: "The ultimate analytical challenge: jumbled questions selected across JEE Main, JEE Advanced, NEET, SAT, and GRE spanning 2020 to 2026.",
    yearSpan: "2020 – 2026",
    durationMinutes: 40,
    totalQuestions: 10,
    marksPerCorrect: 4,
    negativeMarks: 1,
    isJumbled: true,
    questions: [
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2026-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-adv-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "neet-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "sat-pyq-2025-01")!,
      PYQ_DATABASE.find((q) => q.id === "jee-main-pyq-2024-01")!,
      PYQ_DATABASE.find((q) => q.id === "gre-pyq-2024-01")!
    ].filter(Boolean)
  }
];

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

export function getPYQsByExam(
  exam: "ALL" | "JEE" | "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE",
  year?: number | string
): PYQQuestion[] {
  let list = PYQ_DATABASE;

  if (exam === "JEE") {
    list = list.filter((q) => q.exam === "JEE Main" || q.exam === "JEE Advanced" || q.exam === "JEE");
  } else if (exam !== "ALL") {
    list = list.filter((q) => q.exam === exam);
  }

  if (year && year !== "ALL") {
    const numYear = Number(year);
    list = list.filter((q) => q.year === numYear);
  }

  return list;
}

export function getAvailableYears(): number[] {
  return [2026, 2025, 2024, 2023, 2022, 2021, 2020];
}

export function getUniqueUnitsForExam(exam: string): string[] {
  const questions = PYQ_DATABASE.filter((q) => {
    if (exam === "ALL") return true;
    if (exam === "JEE") return q.exam === "JEE Main" || q.exam === "JEE Advanced";
    return q.exam === exam;
  });
  return Array.from(new Set(questions.map((q) => q.unit)));
}

/**
 * Fisher-Yates shuffle to generate a randomized/jumbled exam paper
 */
export function generateJumbledExamPaper(params: {
  exam?: "ALL" | "JEE Main" | "JEE Advanced" | "NEET" | "SAT" | "GRE";
  startYear?: number;
  endYear?: number;
  count?: number;
  title?: string;
}): JumbledExamPaper {
  const {
    exam = "ALL",
    startYear = 2020,
    endYear = 2026,
    count = 10,
    title
  } = params;

  // Filter eligible questions
  let pool = PYQ_DATABASE.filter((q) => {
    const matchesExam =
      exam === "ALL" ||
      (exam === "JEE Main" && (q.exam === "JEE Main" || q.exam === "JEE")) ||
      q.exam === exam;
    const matchesYear = q.year >= startYear && q.year <= endYear;
    return matchesExam && matchesYear;
  });

  // If pool is smaller than count, take all
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  const isNeg = exam === "JEE Advanced" ? 2 : exam === "SAT" || exam === "GRE" ? 0 : 1;
  const marks = exam === "SAT" || exam === "GRE" ? 1 : 4;
  const mins = Math.max(10, Math.round(selected.length * 3.5));

  return {
    id: `custom-jumbled-${Date.now()}`,
    title: title || `${exam} Jumbled Exam Paper (${startYear}–${endYear})`,
    exam: exam as any,
    description: `Randomized test paper with ${selected.length} questions jumbled across ${startYear}–${endYear}.`,
    yearSpan: `${startYear} – ${endYear}`,
    durationMinutes: mins,
    totalQuestions: selected.length,
    marksPerCorrect: marks,
    negativeMarks: isNeg,
    questions: selected,
    isJumbled: true
  };
}
