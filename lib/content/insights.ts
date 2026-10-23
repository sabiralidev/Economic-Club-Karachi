export type InsightDraft = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  paragraphs: string[];
};

export const insightDrafts: InsightDraft[] = [
  {
    slug: "questions-for-a-changing-city",
    title: "Questions for a changing city",
    summary: "A proposed reflection on listening, local context and the questions that can help a community think about change.",
    image: "/images/karachi-business.jpg",
    imageAlt: "Modern business buildings in a city",
    paragraphs: [
      "Every city contains many different experiences of change. Listening to those perspectives is a useful first step before deciding what progress should mean or who it should serve.",
      "For organizations working across business and community life, good questions can open a more thoughtful conversation: whose experience is missing, what needs attention, and how could people learn from one another?",
      "This is a proposed editorial draft for ECK review. It is not an official statement or a report on an ECK programme.",
    ],
  },
  {
    slug: "making-room-for-useful-dialogue",
    title: "Making room for useful dialogue",
    summary: "A draft perspective on how careful conversation can help people surface questions before proposing solutions.",
    image: "/images/ideas-workspace.jpg",
    imageAlt: "A bright workspace prepared for writing and discussion",
    paragraphs: [
      "Useful dialogue does not require everyone to begin with the same view. It does require a clear purpose, room for different perspectives, and care in how ideas are represented.",
      "A well-facilitated discussion can help participants clarify what they know, identify what remains uncertain, and decide whether there is a constructive next step.",
      "This is a proposed editorial draft for ECK review. It is not an announcement or a description of an existing ECK service.",
    ],
  },
];