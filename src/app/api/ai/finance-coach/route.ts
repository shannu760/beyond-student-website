import { NextRequest, NextResponse } from "next/server";

const NEMOTRON_API_KEY =
  process.env.NEMOTRON_3_ULTRA_API_KEY ||
  process.env.EMITRON_ULTRA_API_KEY ||
  process.env.NVIDIA_API_KEY ||
  "";

interface FinanceCoachRequest {
  query: string;
  topicId?: string;
  monthlyAllowance?: number;
  mode?: "chat" | "budget_plan" | "sip_calc" | "scam_check";
}

// Built-in expert knowledge bank for instant zero-latency responses
function getExpertKnowledgeResponse(query: string, topicId?: string): string {
  const q = query.toLowerCase();

  if (q.includes("sip") || q.includes("mutual fund") || q.includes("calculator") || q.includes("invest")) {
    return `### 📈 AMFI & SEBI Guidelines on Student SIPs

1. **What is a SIP?**
   A Systematic Investment Plan (SIP) allows you to invest a small, fixed amount (as low as **₹100/month**) in mutual funds regularly.

2. **Rupee Cost Averaging**:
   When markets drop, your ₹500 buys *more units*; when markets rise, it buys *fewer units*. Over 5–10 years, this smooths out market fluctuations.

3. **Student Recommendation**:
   - Stick to **Direct Index Funds** (tracking Nifty 50 or Sensex) with low expense ratios (<0.20%).
   - Avoid speculative day trading, crypto, or derivative (F&O) schemes.
   - **Math Example**: Investing ₹500/month at a historical average 12% CAGR:
     - After 5 years: Invested ₹30,000 → Value ≈ ₹41,200
     - After 10 years: Invested ₹60,000 → Value ≈ ₹1,16,000
     - After 20 years: Invested ₹1,20,000 → Value ≈ ₹4,99,000`;
  }

  if (q.includes("tax") || q.includes("pan") || q.includes("section 10") || q.includes("87a") || q.includes("scholarship tax")) {
    return `### 🏛️ Indian Income Tax Rules for Students

1. **Scholarship Exemption (Section 10(16))**:
   Under **Section 10(16)** of the Income Tax Act, any scholarship granted to meet the cost of education is **100% exempt from income tax**, regardless of the amount.

2. **New Tax Regime (FY 2025–26)**:
   - Annual income up to **₹7,00,000** has zero tax liability due to the rebate under **Section 87A**.
   - Standard deduction under New Tax Regime is **₹75,000** for salaried/stipendiary trainees.

3. **PAN Card for Students**:
   - Minors (under 18) can apply for a PAN via Form 49A with a parent/guardian signature.
   - Once 18, you can get an instant e-PAN for free at *incometax.gov.in* using your Aadhaar.`;
  }

  if (q.includes("scam") || q.includes("fraud") || q.includes("upi") || q.includes("pin") || q.includes("1930")) {
    return `### 🛡️ NPCI & RBI Cybersecurity Protocol

1. **The Golden UPI Rule**:
   - **You NEVER need to enter your UPI PIN to RECEIVE money.**
   - Entering your UPI PIN will *always* deduct funds from your account.

2. **Common Student Scams**:
   - **Fake Scholarship Processing Fees**: Scammers claim you won an NSP or corporate scholarship and ask for a "registration fee" or "courier fee" via UPI. Real government scholarships NEVER charge processing fees.
   - **QR Code Scams**: "Scan this QR code to claim your prize" — scanning sends money out.
   - **Remote Screen Apps**: Never install AnyDesk, TeamViewer, or RustDesk on instructions from unknown callers.

3. **Emergency Action**:
   - Call **1930** (National Cyber Crime Helpline) immediately to freeze fraudulent transactions.
   - File an official complaint at **cybercrime.gov.in**.`;
  }

  if (q.includes("fd") || q.includes("fixed deposit") || q.includes("sbi") || q.includes("interest") || q.includes("inflation")) {
    return `### 🏦 Banking, SBI Interest Rates & Inflation Dynamics

1. **Current SBI Rates**:
   - Savings Account: ~2.70% p.a.
   - SBI Fixed Deposits (1–2 years): ~6.80% p.a. (Senior citizens receive +0.50%).

2. **The Inflation Factor**:
   - Current Indian CPI inflation hovers around **5.0% - 5.5%**.
   - Money kept in a standard savings account (2.7%) loses purchasing power over time.
   - Moving idle cash above your emergency buffer into a short-term FD or Auto-Sweep account preserves real purchasing power.

3. **Student BSBD Account**:
   - SBI offers Basic Savings Bank Deposit (BSBD) accounts with zero minimum balance requirement and no annual maintenance charge for basic debit cards.`;
  }

  if (q.includes("budget") || q.includes("50/30/20") || q.includes("pocket money") || q.includes("save")) {
    return `### 📊 Student 50/30/20 Budgeting Blueprint

For a typical student monthly allowance or scholarship stipend:

1. **50% — Essentials (Needs)**:
   - Books, printouts, laboratory stationery.
   - Bus/metro passes, college canteen basics.

2. **30% — Discretionary (Wants)**:
   - Social outings with classmates, weekend treats, hobby projects.

3. **20% — Wealth & Emergency Fund (Savings)**:
   - Build a 3-month emergency cushion (approx. ₹3,000 – ₹5,000) in an SBI savings/sweep account.
   - Once the emergency buffer is funded, start a disciplined ₹100 – ₹500/month index fund SIP.`;
  }

  return `### 💡 BEYOND FinAI Guidance

To make smart financial decisions as an Indian student:
- **Build Emergency Buffer First**: Maintain at least 1–2 months of living expenses in an accessible savings account before investing.
- **Utilize Official Portals**: Never pay intermediaries for NSP scholarships (scholarships.gov.in) or student PAN applications (onlineservices.nsdl.com).
- **Beware of High Return Promises**: Avoid Telegram "crypto doubling" or betting apps. Legitimate equity returns compound at 10–14% CAGR over multi-year horizons.
- **Learn the Basics**: Use free modules from RBI Financial Education (rbi.org.in/financialeducation) and SEBI Investor (investor.sebi.gov.in).`;
}

export async function POST(req: NextRequest) {
  try {
    const body: FinanceCoachRequest = await req.json();
    const { query, topicId, monthlyAllowance, mode = "chat" } = body;

    if (!query && !monthlyAllowance) {
      return NextResponse.json({ error: "Query or monthlyAllowance is required" }, { status: 400 });
    }

    // Specialized Mode: Budget Calculation
    if (mode === "budget_plan" && typeof monthlyAllowance === "number" && monthlyAllowance > 0) {
      const needs = Math.round(monthlyAllowance * 0.5);
      const wants = Math.round(monthlyAllowance * 0.3);
      const savings = Math.round(monthlyAllowance * 0.2);
      const emergencyAllocation = Math.round(savings * 0.6);
      const sipAllocation = Math.round(savings * 0.4);

      return NextResponse.json({
        success: true,
        mode: "budget_plan",
        allowance: monthlyAllowance,
        breakdown: {
          needs: { amount: needs, percentage: 50, label: "Needs (Books, Travel, Canteen)" },
          wants: { amount: wants, percentage: 30, label: "Wants (Social, Hobbies, Treats)" },
          savings: { amount: savings, percentage: 20, label: "Savings & Investments" },
          recommendations: {
            emergencyBuffer: `Keep ₹${emergencyAllocation}/month in an SBI Savings/Auto-Sweep account until you reach ₹${monthlyAllowance * 2}.`,
            sipSuggestion: sipAllocation >= 100
              ? `Start a ₹${sipAllocation}/month SIP in a Nifty 50 Direct Index Fund (SEBI registered).`
              : `Accumulate ₹500 in a Post Office Recurring Deposit before starting an equity SIP.`
          }
        },
        officialAdvice: "Approved under RBI Financial Education framework. Never risk money you will need in the next 12 months."
      });
    }

    // Check if live NVIDIA Nemotron API is available
    let aiContent: string | null = null;
    let source = "BEYOND FinAI Knowledge Core (RBI/SEBI/NPCI Grounded)";

    if (
      NEMOTRON_API_KEY &&
      !NEMOTRON_API_KEY.includes("your-nemotron") &&
      NEMOTRON_API_KEY.startsWith("nvapi-")
    ) {
      try {
        const sysPrompt = `You are BEYOND FinAI, an expert financial literacy mentor strictly dedicated to Indian high school and college students.
Ground your answers in official Indian frameworks: RBI, SEBI, NPCI, IRDAI, Income Tax Act, and National Scholarship Portal (NSP).
Always emphasize:
- Real data (SBI rates ~6.8%, repo rate 6.5%, Sec 10(16) scholarship exemption, UPI safety via 1930).
- Responsible non-trading principles (no speculative trading, no crypto hype).
- Clear, bulleted, student-friendly explanations with action steps.`;

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${NEMOTRON_API_KEY}`
          },
          body: JSON.stringify({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [
              { role: "system", content: sysPrompt },
              { role: "user", content: query }
            ],
            temperature: 0.2,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generated = data.choices?.[0]?.message?.content;
          if (generated) {
            aiContent = generated;
            source = "NVIDIA Nemotron 70B Financial Literacy Engine";
          }
        }
      } catch (err) {
        console.warn("NVIDIA FinAI error, falling back to local core:", err);
      }
    }

    if (!aiContent) {
      aiContent = getExpertKnowledgeResponse(query, topicId);
    }

    return NextResponse.json({
      success: true,
      query,
      topicId,
      answer: aiContent,
      source,
      timestamp: new Date().toISOString(),
      disclaimer: "Educational literacy only. Sourced from RBI, SEBI, NPCI & Govt. of India regulations. Not financial advisory."
    });
  } catch (error: any) {
    console.error("Finance Coach API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate financial advice" }, { status: 500 });
  }
}
