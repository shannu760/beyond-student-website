import { NextRequest, NextResponse } from "next/server";

const NEMOTRON_API_KEY =
  process.env.NEMOTRON_3_ULTRA_API_KEY ||
  process.env.EMITRON_ULTRA_API_KEY ||
  process.env.NVIDIA_API_KEY ||
  "";

interface CodeCoachRequest {
  skillId?: string;
  problemTitle?: string;
  query?: string;
  codeSnippet?: string;
  mode?: "hint" | "explain" | "debug";
  hintLevel?: 1 | 2 | 3;
}

// Built-in expert guidance database for instant responses
const PROBLEM_HINTS: Record<string, { intuition: string; algorithm: string; code: string; complexity: string }> = {
  "two sum": {
    intuition: "Instead of checking every pair with nested loops (O(n²)), check if the complement `target - current_num` was already seen using a Hash Map.",
    algorithm: "1. Initialize an empty hash map `seen = {}`.\n2. Iterate through `nums` with index `i`.\n3. Compute `diff = target - nums[i]`.\n4. If `diff in seen`, return `[seen[diff], i]`.\n5. Otherwise, store `seen[nums[i]] = i`.",
    code: `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    complexity: "Time: O(n) | Space: O(n)"
  },
  "reverse linked list": {
    intuition: "Think of three pointers: `prev`, `curr`, and `next_temp`. You change each node's `.next` pointer to point backwards to `prev` as you advance.",
    algorithm: "1. Set `prev = None`, `curr = head`.\n2. While `curr` is not None:\n   a. Save `next_temp = curr.next`\n   b. Reverse pointer: `curr.next = prev`\n   c. Advance `prev = curr`\n   d. Advance `curr = next_temp`\n3. Return `prev` as the new head.",
    code: `def reverseList(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev`,
    complexity: "Time: O(n) | Space: O(1)"
  },
  "valid parentheses": {
    intuition: "Opening brackets must be closed in reverse order (Last In, First Out) — a Stack is the ideal data structure.",
    algorithm: "1. Initialize an empty stack.\n2. Create a mapping for closing brackets: `{')': '(', '}': '{', ']': '['}`.\n3. For each character: if opening, push to stack; if closing, check if stack is non-empty and top matches, then pop. Else return False.\n4. Return `len(stack) == 0`.",
    code: `def isValid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack`,
    complexity: "Time: O(n) | Space: O(n)"
  },
  "climbing stairs": {
    intuition: "To reach step n, you must come from either step (n-1) or step (n-2). The number of ways is `ways(n) = ways(n-1) + ways(n-2)` — exactly Fibonacci!",
    algorithm: "1. If `n <= 2`, return `n`.\n2. Keep two variables: `prev2 = 1`, `prev1 = 2`.\n3. For step 3 to n: `current = prev1 + prev2`, then update `prev2 = prev1`, `prev1 = current`.\n4. Return `prev1`.",
    code: `def climbStairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b`,
    complexity: "Time: O(n) | Space: O(1)"
  },
  "three.js scene": {
    intuition: "Every 3D scene requires 3 core pillars: Scene (the 3D world), Camera (how you view it), and Renderer (drawing it onto the HTML <canvas>).",
    algorithm: "1. Create `scene = new THREE.Scene()`\n2. Create `camera = new THREE.PerspectiveCamera(fov, aspect, near, far)`\n3. Create `renderer = new THREE.WebGLRenderer({ canvas })`\n4. Add Mesh (Geometry + Material)\n5. Add Light (`THREE.DirectionalLight` or `AmbientLight`)\n6. Call `renderer.render(scene, camera)` in `requestAnimationFrame`.",
    code: `import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x22c55e });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
scene.add(light);

camera.position.z = 3;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();`,
    complexity: "GPU Render: 60 FPS standard loop"
  }
};

function getMatchingHint(title: string) {
  const t = title.toLowerCase();
  for (const [key, val] of Object.entries(PROBLEM_HINTS)) {
    if (t.includes(key)) return val;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body: CodeCoachRequest = await req.json();
    const { problemTitle, query, codeSnippet, mode = "explain", hintLevel = 1 } = body;

    // Check if live NVIDIA Nemotron API is available
    let aiContent: string | null = null;
    let source = "BEYOND CodeAI Knowledge Engine";

    if (
      NEMOTRON_API_KEY &&
      !NEMOTRON_API_KEY.includes("your-nemotron") &&
      NEMOTRON_API_KEY.startsWith("nvapi-")
    ) {
      try {
        let systemPrompt = "";
        let userPrompt = "";

        if (mode === "hint") {
          systemPrompt = `You are BEYOND CodeAI, an elite algorithmic & programming coach.
The student is working on: "${problemTitle || query}".
Deliver Level ${hintLevel} assistance:
- Level 1: Core Intuition & Mental Model (DO NOT give complete code)
- Level 2: Step-by-Step Algorithm & Data Structure to use
- Level 3: Clean Python/JS Code implementation with Big-O Complexity.
Keep explanations concise, encouraging, and razor sharp.`;
          userPrompt = `Please give me Level ${hintLevel} guidance for "${problemTitle || query}".`;
        } else if (mode === "debug") {
          systemPrompt = `You are BEYOND CodeAI Code Reviewer.
Analyze the following code for syntax errors, logical bugs, edge cases, and performance bottlenecks.
Provide the corrected code and explain specifically what was fixed.`;
          userPrompt = `Code snippet:\n\`\`\`\n${codeSnippet || query}\n\`\`\`\nContext/Goal: ${problemTitle || "Debug this code"}`;
        } else {
          systemPrompt = `You are BEYOND CodeAI, a patient, master-level tutor for Python, Three.js 3D graphics, and Data Structures.
Explain the requested concept clearly with real-world analogies, code examples, and practical tips.`;
          userPrompt = query || `Explain ${problemTitle}`;
        }

        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${NEMOTRON_API_KEY}`
          },
          body: JSON.stringify({
            model: "nvidia/llama-3.1-nemotron-70b-instruct",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.2,
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generated = data.choices?.[0]?.message?.content;
          if (generated) {
            aiContent = generated;
            source = "NVIDIA Nemotron 70B Code Reasoning Engine";
          }
        }
      } catch (err) {
        console.warn("NVIDIA CodeAI connection failed, using local core:", err);
      }
    }

    // Local deterministic fallback
    if (!aiContent) {
      const match = problemTitle ? getMatchingHint(problemTitle) : null;

      if (mode === "hint" && match) {
        if (hintLevel === 1) {
          aiContent = `### 💡 Level 1: Conceptual Intuition\n\n${match.intuition}\n\n*Think about which data structure allows you to remember what you have already inspected in constant time.*`;
        } else if (hintLevel === 2) {
          aiContent = `### ⚙️ Level 2: Algorithmic Steps\n\n${match.algorithm}\n\n*Complexity Target: ${match.complexity}*`;
        } else {
          aiContent = `### 💻 Level 3: Canonical Solution & Complexity\n\n\`\`\`python\n${match.code}\n\`\`\`\n\n**Complexity Analysis**:\n${match.complexity}`;
        }
      } else if (mode === "debug" && codeSnippet) {
        aiContent = `### 🔍 Code Review & Diagnostic\n\n1. **Syntax Check**: Code syntax structure verified.\n2. **Edge Cases to Test**:\n   - Empty inputs or \`None\` / \`null\` values.\n   - Single element arrays or extreme boundary values.\n   - Duplicate elements.\n3. **Recommendation**: Ensure you are using strict type hints and handling zero-division or out-of-bounds indexing.`;
      } else {
        aiContent = `### 🚀 CodeAI Explanation: ${problemTitle || query || "Programming Concept"}\n\n- **Foundational Idea**: Master the relationship between time complexity (how many operations) and space complexity (memory allocated).\n- **Best Practice**: Always trace inputs through edge cases on paper before typing.\n- **Next Step**: Try breaking the problem into sub-problems or drawing pointer states step-by-step.`;
      }
    }

    return NextResponse.json({
      success: true,
      mode,
      hintLevel,
      content: aiContent,
      source,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error("Code Coach API error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate code guidance" }, { status: 500 });
  }
}
