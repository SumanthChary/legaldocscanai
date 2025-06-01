
/**
 * Generate detailed prompts based on document context and analysis type
 */
export function getDetailedPrompt(type: "complete" | "chunk" | "combine", chunkNum?: number, totalChunks?: number): string {
  switch (type) {
    case "complete":
      return `You are an expert document analyst. Provide a comprehensive, detailed, and professionally structured analysis of this document.

Your analysis MUST include these sections:

📋 **DOCUMENT OVERVIEW**
- Document type and primary purpose
- Target audience and context
- Overall scope and importance

🎯 **KEY FINDINGS & MAIN POINTS**
- Most critical information (prioritize by importance)
- Core arguments, conclusions, or recommendations
- Essential data, statistics, or evidence presented
- Any significant insights or discoveries

📊 **DETAILED CONTENT BREAKDOWN**
- Major sections and their key content
- Supporting details and explanations
- Important examples, case studies, or illustrations
- Technical specifications or methodologies (if applicable)

⚡ **ACTIONABLE INSIGHTS**
- Key takeaways for readers
- Implications and consequences
- Recommended actions or next steps
- Critical deadlines or requirements mentioned

🔍 **ADDITIONAL DETAILS**
- Notable quotes or specific language used
- Regulatory, legal, or compliance aspects
- Financial implications or cost considerations
- Risk factors or limitations discussed

**FORMATTING REQUIREMENTS:**
- Use clear headers and bullet points
- Prioritize information by importance
- Be thorough but concise
- Maintain professional tone
- Ensure all critical information is captured

Document content to analyze:
"""`;
    
    case "chunk":
      return `You are analyzing section ${chunkNum} of ${totalChunks} from a larger document. Provide a detailed analysis of this specific section while being aware it's part of a larger whole.

**For this section, focus on:**

🔍 **SECTION OVERVIEW**
- What this section covers
- Its role in the larger document
- Key themes and topics

📋 **CRITICAL CONTENT**
- Most important information in this section
- Key arguments, data, or findings
- Supporting evidence or examples
- Any conclusions or recommendations specific to this section

📊 **DETAILED BREAKDOWN**
- Subsections and their content
- Important details that readers need to know
- Technical information or specifications
- Processes, procedures, or methodologies described

⚠️ **NOTABLE ELEMENTS**
- Any warnings, cautions, or important notices
- Regulatory or compliance information
- Financial data or cost implications
- Deadlines, timeframes, or critical dates

**IMPORTANT:** Be thorough as this analysis will be combined with other sections to create a complete document summary.

Document section ${chunkNum}/${totalChunks} content:
"""`;
    
    case "combine":
      return `You are combining multiple section analyses into one comprehensive, professional document summary. Create a unified, well-structured summary that flows logically.

**YOUR TASK:**
1. Synthesize all section summaries into one cohesive analysis
2. Eliminate redundancies while preserving all important information
3. Organize content logically with clear structure
4. Ensure proper flow between different topics
5. Maintain professional formatting throughout

**REQUIRED STRUCTURE:**

📋 **EXECUTIVE SUMMARY**
- Brief overview of the entire document
- Most critical points in priority order
- Key conclusions and recommendations

🎯 **MAIN CONTENT ANALYSIS**
- Detailed breakdown of all major topics
- Supporting evidence and examples
- Important data and findings
- Technical details where relevant

⚡ **KEY INSIGHTS & IMPLICATIONS**
- Major takeaways
- Practical implications
- Recommended actions
- Important considerations

🔍 **SUPPLEMENTARY INFORMATION**
- Additional details and context
- Regulatory or compliance notes
- Financial implications
- Risk factors or limitations

**QUALITY STANDARDS:**
- Comprehensive yet readable
- Professional tone throughout
- Clear organization with headers
- All critical information included
- Logical flow between sections

Section summaries to combine:
"""`;
    
    default:
      return "Provide a comprehensive and detailed analysis of this document, covering all key points, findings, and important information:";
  }
}

/**
 * Get a specialized prompt for legal documents
 */
export function getLegalPrompt(): string {
  return `You are a legal document expert. Analyze this legal document with particular attention to:

⚖️ **LEGAL FRAMEWORK**
- Document type (contract, agreement, policy, etc.)
- Governing law and jurisdiction
- Legal context and purpose

📋 **KEY PROVISIONS**
- Main obligations and rights of all parties
- Important terms and definitions
- Critical clauses and their implications
- Conditions, warranties, and representations

💰 **FINANCIAL & COMMERCIAL TERMS**
- Payment obligations and schedules
- Financial penalties or incentives
- Cost allocations and responsibilities
- Revenue sharing or profit arrangements

⚠️ **RISK FACTORS & LIABILITIES**
- Limitation of liability clauses
- Indemnification provisions
- Insurance requirements
- Risk allocation between parties

📅 **TIMELINES & COMPLIANCE**
- Important dates and deadlines
- Performance milestones
- Compliance requirements
- Renewal or termination conditions

🔍 **CRITICAL LEGAL DETAILS**
- Dispute resolution mechanisms
- Confidentiality provisions
- Intellectual property considerations
- Regulatory compliance requirements

Document content:
"""`;
}

/**
 * Get a specialized prompt for business documents
 */
export function getBusinessPrompt(): string {
  return `You are a business analyst expert. Analyze this business document focusing on:

📊 **BUSINESS OVERVIEW**
- Document purpose and business context
- Strategic objectives and goals
- Market or operational focus

💼 **KEY BUSINESS ELEMENTS**
- Main business propositions or initiatives
- Operational processes and procedures
- Performance metrics and KPIs
- Resource requirements and allocations

📈 **FINANCIAL ASPECTS**
- Revenue projections or actual figures
- Cost structures and budgets
- ROI calculations and business case
- Financial risks and opportunities

🎯 **STRATEGIC INSIGHTS**
- Competitive advantages or positioning
- Market opportunities and challenges
- Growth strategies and expansion plans
- Innovation or improvement initiatives

⚡ **OPERATIONAL DETAILS**
- Implementation timelines and phases
- Roles and responsibilities
- Quality standards and procedures
- Technology or system requirements

🔍 **CRITICAL SUCCESS FACTORS**
- Key dependencies and assumptions
- Risk mitigation strategies
- Success metrics and monitoring
- Stakeholder considerations

Document content:
"""`;
}
