export type ProposedService = {
  slug: string;
  title: string;
  category: string;
  overview: string;
  outcome: string;
  objectives: string[];
  audience: string[];
  potentialDeliverables: string[];
  process: string[];
  faqs: { question: string; answer: string }[];
};

export const proposedServices: ProposedService[] = [
  {
    slug: "ideas-and-dialogue",
    title: "Ideas & dialogue",
    category: "Knowledge exchange",
    overview: "A proposed format for structured conversation around questions affecting business and community life.",
    outcome: "A clearer view of the question, perspectives, and possible next steps.",
    objectives: ["Define a useful question together", "Make room for different viewpoints", "Summarize themes without overstating consensus"],
    audience: ["People with a question to explore", "Organizations considering a discussion", "Community members with relevant perspectives"],
    potentialDeliverables: ["Discussion outline", "Facilitated conversation", "Non-attributed themes summary, if agreed"],
    process: ["Share the topic and intended audience", "Confirm whether ECK can support it", "Agree format and any follow-up"],
    faqs: [
      { question: "Is this an established ECK service?", answer: "No. This is a proposed service concept for ECK review, not a confirmed offering." },
      { question: "Can I request a specific topic?", answer: "Yes, you can share an idea through the enquiry form. ECK will need to confirm whether it can take part." },
    ],
  },
  {
    slug: "community-initiatives",
    title: "Community initiatives",
    category: "Community engagement",
    overview: "A proposed way to explore community priorities and opportunities for participation with ECK.",
    outcome: "A better understanding of a community question and whether a collaborative next step is appropriate.",
    objectives: ["Listen to local perspectives", "Clarify needs and constraints", "Identify possible, mutually agreed next steps"],
    audience: ["Community groups", "Individuals with a community question", "Organizations exploring local engagement"],
    potentialDeliverables: ["A listening-session outline", "A summary of themes, with permission", "A proposed follow-up plan"],
    process: ["Describe the community context", "Discuss consent, access, and expectations", "Confirm scope before any activity"],
    faqs: [
      { question: "Does ECK currently run this programme?", answer: "This page describes a concept for review; current programmes have not been confirmed." },
      { question: "Can I request funding or direct assistance?", answer: "No funding or assistance policy has been provided. Please ask ECK directly about its current capacity." },
    ],
  },
  {
    slug: "professional-connection",
    title: "Professional connection",
    category: "Business connection",
    overview: "A proposed opportunity to explore whether ECK can bring relevant people and organizations into a conversation.",
    outcome: "A defined purpose for a potential introduction or discussion, if ECK agrees to facilitate one.",
    objectives: ["Understand the reason for connecting", "Identify relevant perspectives", "Agree boundaries and a suitable format"],
    audience: ["Business owners and professionals", "Organizations with a shared question", "People exploring a possible collaboration"],
    potentialDeliverables: ["A topic brief", "A proposed participant profile", "An introduction request for ECK to review"],
    process: ["Describe the intended connection", "ECK reviews fit and availability", "Agree next steps if appropriate"],
    faqs: [
      { question: "Does ECK guarantee introductions?", answer: "No. This is a proposed concept, and any introduction depends on ECK's review and the consent of everyone involved." },
      { question: "Is this a business advisory service?", answer: "No advisory service has been verified. Contact ECK to ask what it currently offers." },
    ],
  },
];

export const engagementSteps = [
  "Share your question, context, and intended outcome.",
  "ECK reviews the enquiry and confirms whether it is in scope.",
  "Agree any format, expectations, and next steps before proceeding.",
];