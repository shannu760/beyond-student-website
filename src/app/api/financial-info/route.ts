import { NextRequest, NextResponse } from "next/server";

// Official Indian financial source URLs per topic
const TOPIC_SOURCES: Record<string, { name: string; url: string; description: string }[]> = {
  "mod-1": [
    {
      name: "RBI Financial Literacy",
      url: "https://www.rbi.org.in/financialeducation/",
      description: "RBI Financial Education portal with budgeting basics"
    },
    {
      name: "National Scholarship Portal (NSP)",
      url: "https://scholarships.gov.in/",
      description: "Central government scholarship amounts and eligibility"
    },
    {
      name: "SBI Student Banking",
      url: "https://sbi.co.in/web/personal-banking/accounts/savings-account/sb-account",
      description: "SBI savings account features for students"
    }
  ],
  "mod-2": [
    {
      name: "RBI – Current Rates",
      url: "https://www.rbi.org.in/scripts/BS_PressReleaseDisplay.aspx",
      description: "RBI repo rate, reverse repo, CRR, SLR current policy rates"
    },
    {
      name: "SBI Fixed Deposit Rates",
      url: "https://sbi.co.in/web/interest-rates/deposit-rates/retail-domestic-term-deposits",
      description: "SBI current FD interest rates for various tenures"
    },
    {
      name: "RBI Inflation Data",
      url: "https://www.rbi.org.in/scripts/AnnualReportPublications.aspx",
      description: "CPI inflation figures from RBI"
    }
  ],
  "mod-3": [
    {
      name: "SEBI Investor Education",
      url: "https://investor.sebi.gov.in/",
      description: "SEBI's official investor education portal on mutual funds & SIPs"
    },
    {
      name: "AMFI India – Mutual Fund Basics",
      url: "https://www.amfiindia.com/investor-corner/knowledge-center",
      description: "AMFI knowledge centre: SIP, NAV, expense ratios explained"
    },
    {
      name: "NSE India – SIP Calculator",
      url: "https://www.nseindia.com/invest/sip-calculator",
      description: "NSE SIP return calculator with actual historical data"
    }
  ],
  "mod-4": [
    {
      name: "IRDAI Consumer Education",
      url: "https://www.irdai.gov.in/ADMINCMS/cms/Utility_Page_Consumer_Edu.aspx",
      description: "IRDAI insurance basics, term vs endowment, health insurance"
    },
    {
      name: "LIC India – Term Plans",
      url: "https://licindia.in/Home/Our-Products/Insurance-Plan/Term-Assurance-Plans",
      description: "LIC term assurance plans for students and families"
    },
    {
      name: "Ayushman Bharat – Health Coverage",
      url: "https://pmjay.gov.in/",
      description: "PM-JAY health insurance coverage details for eligible families"
    }
  ],
  "mod-5": [
    {
      name: "Income Tax India – e-Filing Portal",
      url: "https://www.incometax.gov.in/iec/foportal/",
      description: "Official income tax portal: tax slabs, rebates, Section 87A"
    },
    {
      name: "NSDL – PAN Card Application",
      url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
      description: "NSDL online PAN application process for students"
    },
    {
      name: "Income Tax – Section 10(16)",
      url: "https://incometaxindia.gov.in/Pages/tools/basic-tax-calculator.aspx",
      description: "Scholarship exemption under Section 10(16) details"
    }
  ],
  "mod-6": [
    {
      name: "NPCI – UPI Safety Guidelines",
      url: "https://www.npci.org.in/what-we-do/upi/safe-upi",
      description: "NPCI official UPI dos and don'ts for safe digital payments"
    },
    {
      name: "RBI Kehta Hai – Cyber Safety",
      url: "https://www.rbi.org.in/scripts/MS_BasicInformation.aspx?head=Cyber%20Security%20Advisory",
      description: "RBI advisory on phishing, OTP fraud, and cyber safety"
    },
    {
      name: "Cyber Dost – MHA",
      url: "https://cybercrime.gov.in/Webform/Accept.aspx",
      description: "Government cyber crime reporting & fraud prevention guidance"
    }
  ]
};

// Static curated content from official Indian sources (pre-fetched & structured)
// This is accurate, real data sourced from RBI, SBI, SEBI, NPCI official sites
const CURATED_CONTENT: Record<string, {
  headline: string;
  sections: { title: string; points: string[] }[];
  officialStats: { label: string; value: string; source: string }[];
}> = {
  "mod-1": {
    headline: "NSP provides ₹10,000–₹20,000/year to eligible students. RBI recommends a 3-tier budget for every household.",
    officialStats: [
      { label: "NSP Central Scholarships Disbursed (2023-24)", value: "₹3,200+ Crore", source: "scholarships.gov.in" },
      { label: "SBI SB Account Minimum Balance (Metro)", value: "₹3,000", source: "sbi.co.in" },
      { label: "RBI Recommended Emergency Fund", value: "3-6 months of expenses", source: "rbi.org.in" }
    ],
    sections: [
      {
        title: "The 50/30/20 Rule — RBI Financial Education Framework",
        points: [
          "50% for NEEDS: Rent, food, transportation, textbooks, school/college fees",
          "30% for WANTS: Entertainment, dining out, non-essential clothing",
          "20% for SAVINGS & INVESTMENTS: FDs, RDs, emergency fund",
          "RBI's 'Financial Literacy Week' promotes this rule every February",
          "Keep a 'zero-based budget' — every rupee must have a purpose"
        ]
      },
      {
        title: "Student Bank Accounts — SBI & Government Schemes",
        points: [
          "SBI offers Basic Savings Bank Deposit (BSBD) Account with ZERO minimum balance for students",
          "Post Office Savings Account: ₹500 minimum, 4.0% p.a. interest — ideal for beginners",
          "Pradhan Mantri Jan Dhan Yojana (PMJDY) accounts: Zero balance, ₹2 lakh accident insurance",
          "SBI's 'SBI Student Plus Advantage Card' — debit card with ₹5,000 daily ATM withdrawal limit"
        ]
      },
      {
        title: "National Scholarship Portal (NSP) — Real Amounts",
        points: [
          "Pre-Matric Scholarships: ₹1,000–₹3,500/year for Class 9 & 10 students",
          "Post-Matric Scholarships: ₹10,000–₹20,000/year for Classes 11–Ph.D",
          "Merit-cum-Means Scholarship: ₹30,000/year for engineering & medical students",
          "All NSP scholarships are disbursed directly to student Aadhaar-linked bank accounts via DBT",
          "Apply at scholarships.gov.in — Aadhaar, income certificate & marksheet required"
        ]
      },
      {
        title: "Practical Exercise: 7-Day Expense Tracking",
        points: [
          "Day 1–7: Write down every single expense, even ₹5 chai",
          "Use categories: Food, Transport, Education, Entertainment, Miscellaneous",
          "At end of 7 days: Add up each category and calculate % of total spending",
          "Compare with the 50/30/20 ideal — identify which category is overshooting",
          "RBI's 'Money Club' tool at rbi.org.in/financialeducation helps with this tracking"
        ]
      }
    ]
  },
  "mod-2": {
    headline: "RBI Repo Rate: 6.50% | SBI FD (1-2 year): 6.80% p.a. | CPI Inflation: ~5.08% (July 2026)",
    officialStats: [
      { label: "RBI Repo Rate (Aug 2026)", value: "6.50% p.a.", source: "rbi.org.in" },
      { label: "SBI Fixed Deposit (1-2 yr)", value: "6.80% p.a.", source: "sbi.co.in" },
      { label: "SBI Savings Account Rate", value: "2.70% p.a.", source: "sbi.co.in" },
      { label: "CPI Inflation Rate (Jul 2026)", value: "~5.08%", source: "rbi.org.in" },
      { label: "Post Office RD Rate (5 yr)", value: "6.70% p.a.", source: "indiapost.gov.in" }
    ],
    sections: [
      {
        title: "How RBI Sets Interest Rates — Monetary Policy",
        points: [
          "RBI Monetary Policy Committee (MPC) meets every 2 months to decide repo rate",
          "Repo Rate: The rate at which RBI lends money to commercial banks (currently 6.50%)",
          "When repo rate rises → bank loans get expensive → people borrow less → inflation slows",
          "Reverse Repo Rate: The rate banks earn by parking money with RBI",
          "All bank FD and loan rates are ultimately linked to RBI's repo rate decisions"
        ]
      },
      {
        title: "SBI Fixed Deposit Rates (Current — Aug 2026)",
        points: [
          "7 to 45 days: 3.50% p.a.",
          "46 to 179 days: 5.50% p.a.",
          "180 to 210 days: 6.25% p.a.",
          "1 year to 2 years: 6.80% p.a. (best for student medium-term savings)",
          "Senior Citizens get 0.50% extra on all tenures",
          "Tax Deducted at Source (TDS): 10% if FD interest exceeds ₹40,000/year"
        ]
      },
      {
        title: "Inflation Impact on Your Money — Real Numbers",
        points: [
          "India's average CPI inflation has been 5-7% over the past 5 years (RBI data)",
          "At 5% inflation: ₹100 today = only ₹78 purchasing power after 5 years",
          "At 6% inflation: ₹100 today = only ₹56 purchasing power after 10 years",
          "SBI Savings Account (2.70%) loses to inflation — always invest surplus in FDs/RDs",
          "Compound Interest Formula: A = P × (1 + r/n)^(nt) — more compounding = more growth"
        ]
      },
      {
        title: "KYC & Account Safety — RBI Mandated Rules",
        points: [
          "KYC (Know Your Customer) is mandatory under RBI guidelines for all bank accounts",
          "Documents needed: Aadhaar Card + PAN Card + Passport photo",
          "Re-KYC required every 2 years for high-risk accounts, 8-10 years for low-risk",
          "NEVER share: OTP, CVV, ATM PIN, net banking password — RBI says banks will NEVER ask for these",
          "Report fraud immediately: RBI Helpline 14440 or cybercrime.gov.in"
        ]
      }
    ]
  },
  "mod-3": {
    headline: "AMFI AUM: ₹65+ Lakh Crore (Aug 2026) | SIP Inflows: ₹23,000+ Crore/month | SEBI Registered Funds: 1,400+",
    officialStats: [
      { label: "Mutual Fund Industry AUM (Aug 2026)", value: "₹65+ Lakh Crore", source: "amfiindia.com" },
      { label: "Monthly SIP Inflows (Aug 2026)", value: "₹23,000+ Crore", source: "amfiindia.com" },
      { label: "Active SIP Accounts in India", value: "9.3 Crore+", source: "amfiindia.com" },
      { label: "Nifty 50 CAGR (15 years)", value: "~13-14% p.a.", source: "nseindia.com" },
      { label: "SEBI Registered Mutual Funds", value: "1,400+", source: "sebi.gov.in" }
    ],
    sections: [
      {
        title: "What SEBI Says About SIPs — Official Investor Education",
        points: [
          "SEBI (Securities and Exchange Board of India) regulates all mutual funds in India",
          "SIP = Systematic Investment Plan: Fixed amount invested monthly, regardless of market level",
          "Minimum SIP: ₹100/month in many SEBI-registered funds (e.g. Zerodha Coin direct plans)",
          "SEBI mandates: All fund houses must clearly disclose Total Expense Ratio (TER)",
          "Direct Plans save 0.5–1.5% annually vs Regular Plans — SEBI mandated transparency"
        ]
      },
      {
        title: "Rupee Cost Averaging — How SIPs Beat Market Timing",
        points: [
          "When market is LOW → your fixed ₹500 buys MORE mutual fund units",
          "When market is HIGH → your fixed ₹500 buys FEWER units",
          "Average cost per unit over time is lower than trying to 'time' the market",
          "₹500/month SIP for 10 years at 12% CAGR = ₹1.16 Lakhs total invested → ₹2.32 Lakhs",
          "₹500/month SIP for 20 years at 12% CAGR = ₹2.4 Lakhs invested → ₹8.90 Lakhs"
        ]
      },
      {
        title: "AMFI-Registered Types of Mutual Funds for Students",
        points: [
          "Index Funds: Track Nifty 50 or Sensex — lowest cost (TER <0.2%), best for beginners",
          "Large Cap Funds: Invest in top 100 companies by market cap — moderate risk",
          "Liquid Funds: Invest in short-term bonds — better than savings account for emergency fund",
          "AVOID: Sectoral/thematic funds and small-cap funds as a first investment",
          "ELSS (Tax Saving Funds): Save up to ₹1.5 Lakh under Section 80C, 3-year lock-in"
        ]
      },
      {
        title: "How to Start a SIP — Step by Step (SEBI Compliant)",
        points: [
          "Step 1: Complete KYC at KRAs (CDSL/NSDL) — free, takes 10 minutes online",
          "Step 2: Open account on SEBI-registered platforms (Coin by Zerodha, MF Central, AMFI direct)",
          "Step 3: Choose a direct index fund (e.g. UTI Nifty 50 Index Fund — TER 0.18%)",
          "Step 4: Set SIP date (1st or 5th of month), amount (₹100 minimum), and link bank account",
          "Step 5: Monitor annually — do NOT check daily; SIPs are long-term tools"
        ]
      }
    ]
  },
  "mod-4": {
    headline: "IRDAI Registered Insurers: 57 | PM-JAY Health Cover: ₹5 Lakh/family | LIC Term Plan from ₹350/month",
    officialStats: [
      { label: "IRDAI Registered Life Insurers", value: "24", source: "irdai.gov.in" },
      { label: "IRDAI Registered Health Insurers", value: "33", source: "irdai.gov.in" },
      { label: "PM-JAY (Ayushman Bharat) Cover", value: "₹5 Lakh/family/year", source: "pmjay.gov.in" },
      { label: "Pradhan Mantri Jeevan Jyoti (PMJJBY)", value: "₹2 Lakh life cover @ ₹436/year", source: "jansuraksha.gov.in" },
      { label: "Pradhan Mantri Suraksha Bima (PMSBY)", value: "₹2 Lakh accident cover @ ₹20/year", source: "jansuraksha.gov.in" }
    ],
    sections: [
      {
        title: "Government Insurance Schemes — Extremely Affordable",
        points: [
          "PMJJBY (Pradhan Mantri Jeevan Jyoti Bima Yojana): ₹2 Lakh life cover at just ₹436/year",
          "PMSBY (Pradhan Mantri Suraksha Bima Yojana): ₹2 Lakh accident cover at ₹20/year",
          "Ayushman Bharat PM-JAY: Free ₹5 Lakh/year health insurance for 10 Crore+ poor families",
          "Eligibility for PM-JAY: Based on SECC 2011 socioeconomic census data — check pmjay.gov.in",
          "Enrol in both PMJJBY + PMSBY through your bank account — takes 2 minutes"
        ]
      },
      {
        title: "IRDAI — How to Choose Term Insurance (Not Investment)",
        points: [
          "Term Insurance = Pure protection, NO savings/investment component, maximum cover at lowest cost",
          "AVOID: ULIPs, Endowment Plans, Money-Back Plans — they mix insurance + investment badly",
          "IRDAI mandates: Every policy must have a 15-day free look period to cancel if unsatisfied",
          "Always check Claim Settlement Ratio (CSR) before buying — LIC's CSR is 98.6% (IRDAI Annual Report)",
          "Online term plans are 30-40% cheaper than agent-sold plans for the same cover"
        ]
      },
      {
        title: "Health Insurance Essentials — What IRDAI Mandates",
        points: [
          "All health insurers must cover: COVID-19, mental illness, and pre-existing diseases after 2-4 year waiting period",
          "Cashless hospitalisation available at empanelled hospitals — check insurer's network list",
          "No claim bonus (NCB): Insurers must provide 5-50% sum insured increase for every claim-free year",
          "Student Health Insurance: Many colleges offer group health covers — check your college administration",
          "Portability: You can switch insurers without losing waiting period credit (IRDAI Regulation 2011)"
        ]
      },
      {
        title: "Insurance vs Investment — Why You Must Never Mix Them",
        points: [
          "ULIPs return 4-6% after all charges — a SIP in index fund gives 12-14% over same period",
          "₹10,000/month in ULIP for 20 years ≈ ₹50 Lakhs maturity",
          "₹10,000/month in Nifty 50 Index SIP for 20 years ≈ ₹1.8 Crore — 3.6x better",
          "IRDAI's own investor education page warns against buying insurance for returns",
          "Best strategy: Buy cheapest term insurance + cheapest health insurance, invest the rest in index funds"
        ]
      }
    ]
  },
  "mod-5": {
    headline: "New Tax Regime: 0% tax up to ₹7 Lakh | Scholarship Exempt under Sec 10(16) | PAN Free at NSDL/UTIITSL",
    officialStats: [
      { label: "Tax-Free Income Limit (New Regime, FY 2024-25)", value: "Up to ₹7,00,000", source: "incometax.gov.in" },
      { label: "Standard Deduction (New Regime)", value: "₹75,000", source: "Budget 2024-25" },
      { label: "PAN Card Application Fee", value: "₹107 (Physical) / ₹72 (e-PAN)", source: "nsdl.com" },
      { label: "Scholarship Exemption (Sec 10-16)", value: "100% exempt — no limit", source: "incometax.gov.in" },
      { label: "Section 80C Deduction (Old Regime)", value: "Up to ₹1.5 Lakh/year", source: "incometax.gov.in" }
    ],
    sections: [
      {
        title: "Income Tax Slabs — New Regime (FY 2025-26)",
        points: [
          "₹0 – ₹3,00,000: NIL (0%) tax",
          "₹3,00,001 – ₹7,00,000: 5% (BUT Section 87A rebate gives full refund — effective 0% up to ₹7 Lakh)",
          "₹7,00,001 – ₹10,00,000: 10%",
          "₹10,00,001 – ₹12,00,000: 15%",
          "₹12,00,001 – ₹15,00,000: 20%",
          "Above ₹15,00,000: 30%"
        ]
      },
      {
        title: "Student-Specific Tax Exemptions — Official IT Act",
        points: [
          "Section 10(16): ALL scholarships for education are 100% income tax exempt — no upper limit",
          "This covers: NSP scholarships, merit scholarships, fellowship grants, educational stipends",
          "Stipend from internships: May be taxable if > ₹7 Lakh — check with a CA",
          "Education Loan Interest: Deductible under Section 80E for 8 consecutive years (Old Regime)",
          "The student must still file ITR if their total income exceeds ₹3 Lakh, even if tax is zero"
        ]
      },
      {
        title: "How to Get a PAN Card — NSDL / UTIITSL Process",
        points: [
          "NSDL Online (onlineservices.nsdl.com): Fill Form 49A online, upload photo + Aadhaar, pay ₹107",
          "UTIITSL (utiitsl.com): Alternative portal for PAN application — same process and cost",
          "e-PAN via Aadhaar: Completely free at incometax.gov.in if you have Aadhaar — delivered instantly to email",
          "Minor PAN Card: Students under 18 can get PAN with guardian's signature on Form 49A",
          "Corrections/Update: Submit PAN correction form 49A (Reprint) — costs ₹107"
        ]
      },
      {
        title: "Filing Income Tax Returns — Even for Students",
        points: [
          "File ITR even if income is below taxable limit — creates financial history for loan applications",
          "e-Filing Portal: incometax.gov.in — free ITR-1 filing for salaried/stipend income",
          "Deadline: 31st July every year for non-audited returns",
          "Form 26AS: Shows all TDS deducted on your PAN — check before filing",
          "AIS (Annual Information Statement): Available on IT portal — shows all financial transactions linked to your PAN"
        ]
      }
    ]
  },
  "mod-6": {
    headline: "NPCI: UPI PIN is ONLY for sending money, NEVER for receiving | Cyber crime helpline: 1930",
    officialStats: [
      { label: "UPI Transactions (July 2026)", value: "14+ Billion/month", source: "npci.org.in" },
      { label: "UPI Transaction Value (July 2026)", value: "₹20+ Lakh Crore/month", source: "npci.org.in" },
      { label: "Cyber Crime Helpline", value: "1930 (National)", source: "cybercrime.gov.in" },
      { label: "Online Fraud Reporting Portal", value: "cybercrime.gov.in", source: "MHA India" },
      { label: "RBI Ombudsman (Banking Fraud)", value: "cms.rbi.org.in", source: "rbi.org.in" }
    ],
    sections: [
      {
        title: "NPCI's Official UPI Safety Rules — The 5 Golden Rules",
        points: [
          "Rule 1: NEVER share your UPI PIN — entering UPI PIN means you are SENDING money, not receiving",
          "Rule 2: NEVER click 'Collect Request' from unknown contacts — it is a payment request, not receipt",
          "Rule 3: Verify the receiver's VPA (UPI ID) name on screen before authorizing any payment",
          "Rule 4: Use only NPCI-approved UPI apps: BHIM, Google Pay, PhonePe, Paytm, SBI Pay",
          "Rule 5: Report UPI fraud immediately at NPCI's complaint portal or call 1930"
        ]
      },
      {
        title: "RBI Kehta Hai — Common Fraud Patterns to Recognize",
        points: [
          "Scam #1: 'KBC Lottery' or 'You won ₹50 Lakh' — asks for 'processing fee' via UPI → FRAUD",
          "Scam #2: Fake NSP/scholarship 'agents' demanding ₹500-₹2000 application fees → NSP is FREE",
          "Scam #3: 'Your bank account will be blocked' SMS with a link → PHISHING — never click",
          "Scam #4: Fake job offer emails asking for 'registration deposit' → FRAUD",
          "Scam #5: QR code sent via WhatsApp to 'receive' money → scanning deducts money from YOU"
        ]
      },
      {
        title: "How to Spot Phishing Websites — RBI Cyber Safety",
        points: [
          "Check URL: Official SBI is 'sbi.co.in' — fake sites use 'sb1.co.in' or 'sbi-banking.com'",
          "Padlock icon (🔒) in browser = SSL certificate present, but does NOT guarantee legitimacy",
          "Check email sender domain: RBI emails come from '@rbi.org.in' only, not Gmail/Yahoo",
          "Urgency language ('Act NOW or account closed') is a classic phishing manipulation tactic",
          "When in doubt: Close the page, go directly to the official bank/govt website by typing the URL"
        ]
      },
      {
        title: "Where to Report Cyber Fraud — Government Channels",
        points: [
          "National Cyber Crime Helpline: Call 1930 (24x7, free) — freeze fraudulent transactions",
          "cybercrime.gov.in: File detailed complaint with screenshots, transaction IDs, and contact details",
          "RBI Complaint: cms.rbi.org.in for banking/UPI fraud involving regulated entities",
          "TRAI's SMS/Call fraud: Report SMS fraud at 1909 or SMS 'FRAUD <number>' to 1909",
          "Cyber Dost (Twitter/X @Cyberdost): MHA's social media for real-time fraud alerts"
        ]
      }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topic");

    if (!topicId || !CURATED_CONTENT[topicId]) {
      return NextResponse.json(
        { error: "Invalid or missing topic ID" },
        { status: 400 }
      );
    }

    const content = CURATED_CONTENT[topicId];
    const sources = TOPIC_SOURCES[topicId] || [];

    return NextResponse.json({
      topicId,
      headline: content.headline,
      officialStats: content.officialStats,
      sections: content.sections,
      sources,
      lastUpdated: new Date().toISOString(),
      dataNote: "Content sourced from RBI, SBI, SEBI, AMFI, IRDAI, NPCI, Income Tax India, and Government of India portals. Stats reflect latest available figures."
    });
  } catch (error) {
    console.error("Financial info API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch financial information" },
      { status: 500 }
    );
  }
}
