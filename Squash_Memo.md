**SQUASH**

**Investor Memo |  May 2026**

**Our Mission**

*AI is on track to write most of the code at top engineering teams. We believe the same shift is coming for product. Within 5 years, the majority of insights that drive product roadmaps will come from AI, not from human analysis. **Squash is building that layer.***

**What we are**

*Squash sits across a product team's full stack: analytics, session replay, support tickets, user interviews, error logs, and the data warehouse. It monitors them 24/7. It tells the team what is broken, why it is happening, and what to ship next. The AI teammate that does the data synthesis work PMs don't have time to do themselves.*

# **1\. The Problem**

**What we tell customers**

We are building the **AI product manager that works 24/7 on your product stack**. Squash watches your analytics, session recordings, user feedback tools, and error logs all the time. When it finds something wrong or frustrating users, it investigates it across tools and flags that insight to the team with what’s happening, explains why, and suggests what they should fix or build next. 

**The specific pain**

PMs spend 30 to 40% of their time on manual data work. Opening five tools, cross-referencing funnels, watching session recordings, and pulling weekly reports. They still miss things. A conversion drop happens on Tuesday. They find out on Friday. The fix ships next sprint. The data was always there. Nobody had time to find it. **We fix the attention problem, not the data problem.**

**Why it has not been solved before**

Solving this needs three things at once. First, pulling data together from many tools (analytics, customer feedback channels, error logs, the data warehouse). Second, watching for anomalies continuously, not just when asked. Third, knowing enough about the product to turn raw signals into a useful insight rather than a noisy alert. This combination only became tractable with LLMs that can reason over mixed structured and unstructured data.

**Product strategy**

* Integration layer first. We plug into what the customer already uses. No migration, no new stack, no behaviour change for their team.

* Insight engine runs continuously in the background. No prompts. No dashboards to check. Insights are pushed to where teams already work: Slack, Gmail, etc.

* The action layer is where the real value sits. Once Squash is writing tickets and suggesting the right fixes, and they actually work, it becomes infrastructure for our customers. You don't rip out infrastructure.

We are not competing with the existing tools. We sit on top of them. Our go-to-market actually benefits from their distribution. The more teams using those tools, the larger our addressable market.

# **2\. Ideal Customer**

**Who is a good fit**

* 250+ employees or $10M+ in ARR. Data-rich enough to need this, and budget to pay for it.

* At least one full-time PM or Head of Product with tool budget.

* Already paying for at least one of: PostHog, Mixpanel, Amplitude, Heap, BigQuery, Snowflake.

* Defined product funnel with at least 1,000 monthly active users.

* Shipping product weekly – enough velocity that things break and get missed

**Conviction on the ICP**

High. We see the same signal across every prospect call: PMs have a recurring weekly "data review" block on their calendar. That block is exactly what we replace. We have now heard this from 25+ PMs across our outreach pipeline. The pattern is consistent.

**What we believe that others don't**

**PMs don’t actually want more data. They want someone to tell them what to do.** When we show the insight card with plain English, a specific insight, and a suggested action already created, the reaction isn’t "interesting". It’s "Why doesn’t this exist already?”

The champion is always the PM who watches session recordings and deeply cares about their users. Every PM team has one person who cares enough to go look at raw data. That person feels vindicated by Squash. Everyone else just benefits.

The economic buyer approves the tool because it makes their team faster without headcount. The ROI conversation is easy once we can show one insight that saved a sprint.

# **3\. Competitive Landscape**

We have mapped the landscape into four categories. Each one solves a slice of 'understand your product better,' but no one sits in the full synthesis layer Squash is building. The bet: the right wedge is not to replace any of them. It is to sit above all of them.

**Four categories of competition**

* **Category A. Session replay watchers:** [Lucent](https://lucenthq.com/), [Decipher](https://www.deciphr.ai/), [Human Behavior.](https://www.humanbehavior.co/) AI watches recordings only.

* **Category B. Voice of customer and feedback intelligence:** [Dovetail](https://dovetail.com/), [Enterpret](https://www.enterpret.com/), [Productboard](https://www.productboard.com/). AI on support tickets, calls, surveys, reviews.

* **Category C. Product analytics incumbents:** [Amplitude](https://amplitude.com/), [Mixpanel](https://mixpanel.com/home/), [PostHog](https://posthog.com/), [Heap](http://heap.io), [FullStory](https://www.fullstory.com/). Passive analytics with bolted-on AI features.

* **Category D. 'What to build' tools:** [ProductBot](https://productbot.ai/), [Productboard](https://www.productboard.com/). Strategic recommendation engines on top of feedback data and competitive research.

**Detailed competitor analysis**

| Competitor | Category | What they do | How Squash is different |
| :---- | :---- | :---- | :---- |
| **Lucent (YC)** | Session replay AI | AI watches PostHog session replays automatically. Sends bug and UX alerts to Slack and Linear. 30+ YC customers (Reducto, Finta). | Lucent only sees what is on screen. It cannot tell you why DAU dropped 8%, why paid users churn at twice the rate of free users, or how a Stripe webhook failure connects to anything. Squash watches the full stack. Replays are one signal of many. Lucent is a feature inside a bigger product. Squash is that bigger product. |
| **Decipher** | Session replay AI | Vision-LLM agent watching session replays. Founded by ex-Google engineers. | Same limit as Lucent: single source. Squash pulls signals from everywhere at once. A conversion drop in Mixpanel, plus rage clicks in replay, plus a business metric decline in BigQuery becomes one clear root-cause card. Decipher can only see the rage clicks. |
| **Human Behavior** | Session replay AI \+ auto-fix | AI agents watch replays, auto-instrument with no code, can hand fixes off to code agents and redesign UI/UX. | More ambitious on the action side (they fix the UI/UX themselves), but still replay first. We build the fix just like them but with a deeper analysis and understanding of the problem (since we pull multiple signals) |
| **Dovetail** | Customer intelligence (feedback) | AI-native research and feedback platform. Fall 2025 launched an agentic platform with Linear, Salesforce, and Gong integrations. $30/seat starter, $375/mo team plan. | Dovetail tracks what users say. Squash tracks what users do and say. These are not the same thing. Users complain about feature X while quietly churning over feature Y. Dovetail customers actively need Squash. |
| **Enterpret** | Feedback intelligence (enterprise) | Series A, $25M raised (Canaan, Kleiner Perkins). Custom AI models per customer, 50+ feedback sources. Customers: Notion, Canva, Linear, Loom, Strava. Est. $30K to $100K+ ACV. | Closest to our ACV and sales motion, but still feedback only. They combine what users say across feedback channels. We combine what users do across product data. A company like Notion needs both. Their growth validates our price point and our bet on AI agents that take action. |
| **ProductBot** | 'What to build' intelligence | Synthesises customer feedback, market data, and competitor signals. Knowledge-graph-based feature ranking. | ProductBot answers 'what should we build next?' Squash answers that along with 'what is broken right now, and why?' It has more context about how things are today to answer the same question, hence gives better insights.  |
| **Amplitude (with June)** | Product analytics incumbent | $312M revenue in 2024, $1.5B market cap. Acqui-hired June (July 2025\) for B2B SaaS simplicity. Has 'Ask Amplitude' NLQ and anomaly detection. | Amplitude's AI sits inside Amplitude. It can answer questions about Amplitude data only. Squash reads Amplitude AND every other tool the customer uses. Incumbents cannot be neutral. If they read other tools well, they would eat into the lock-in their own pricing relies on. Salesforce never built Zapier for the same reason. |
| **Mixpanel** | Product analytics incumbent | $171M revenue in 2024\. Acquired DoubleLoop (Oct 2025\) for product-strategy tracking. 'Mixpanel Spark' for AI insights. | Same single-source limit as Amplitude. Mixpanel's AI tells you about events in Mixpanel. It cannot correlate those events with Stripe webhooks, support tickets in Zendesk, or deploys in GitHub. We can. |
| **PostHog** | Product analytics (open source) | $50M+ ARR (Oct 2025), $1.4B valuation. Max AI for in-product analytics queries. All-in-one platform (analytics, replay, flags, surveys). | PostHog's strategy is 'add every product, keep customers in.' Ours is 'reason across whatever tools they already have.' PostHog Max is good but limited to PostHog's own data. Most serious product teams run 4 to 6 tools, not just one. Our opening is exactly that fragmentation. |
| **Heap.io** | Product analytics incumbent | Auto-capture pioneer. Acquired by Contentsquare in 2024\. Strong on retroactive event creation. | Same incumbent pattern. Heap's value (auto-capture) is data plumbing. Squash is the layer above the plumbing. |

 

**The structural insight**

Every competitor falls into one of two traps. The first is single source. They own the data they read (Amplitude, Mixpanel, PostHog), so they can never be a neutral layer that combines across tools. The second is single input. They only look at one type of signal (replays only, or feedback only), so they miss the connections between different signal types. Squash is the first to be both multi-source and multi-input by design. That is the moat.

# **4\. Market Size & Why This Can Be Huge**

**Most of the user data already exists. Almost nobody is using it.**

In a typical week, a PM watches maybe 5 to 10 hours of session recordings and pulls 3 to 5 insights out of them. They scan a dashboard for another 5 hours. That is about it. Meanwhile, the same product has thousands of hours of recordings sitting in PostHog every week, millions of analytics events, and tens of thousands of support tickets across Zendesk and Intercom. The PM sees less than 1% of what is there.

The maths is striking. If 100 hours of replays gives a human team 5 insights (one insight per 20 hours of watching), then 100,000 hours of replays at the same rate would give 5,000 insights. Even if Squash is 10 times worse per hour than a careful human, it still pulls out 500 insights from the same pool. **That is 100x more than the human team got.** And replays are just one source. The same gap shows up in analytics, support tickets, feedback, and error logs.

*There is a huge reservoir of user data sitting across every product company in the world today. Almost none of it is being used. The market is not 'dashboard analytics'. The market is to turn that reservoir into action.* 

We size the opportunity from two angles: the immediate wedge, and the ceiling.

**Angle 1\. The wedge: bottoms-up by company**

* **Target universe:** About 17,000 B2B SaaS companies globally, plus around 13,000 adjacent product-led companies (mid-market e-commerce, fintech, marketplaces, consumer apps with PM teams). Roughly 30,000 qualified accounts.

* **Initial Product-team ACV:** $30K to $70K, benchmarked against Enterpret ($30K to $100K) and Amplitude mid-market ($30K to $100K).

*30,000 companies x $50K blended ACV \= $1.5B initial product-team TAM.*

* **Expansion across teams:** Each account grows from Product to CS (churn signals) to Engineering (bug and performance signals) to Growth (funnel signals). Conservative 2.5x expansion per logo over 24 months.

*With 2.5x expansion across teams, this grows to **$3.75B** at maturity.*

**Angle 2\. The ceiling: AI-replaced PM payroll**

This is the framing that justifies calling the opportunity huge. It mirrors how Cursor and GitHub Copilot are priced. They are priced against developer payroll, not against the dev-tools market.

* **Global PM count:** about 1.3M (2026).

* **Average loaded PM cost:** $140K (median US PM total comp is $190K,  global blended estimate is around $140K, including India, EU, Latin America).

* **Total global PM payroll:** 1.3M x $140K \= $182B per year.

* **Share of PM time spent on analytical work:** 30 to 40%.

* **Replaceable analytical work:** $182B x 35% \= $64B per year of human PM hours currently spent on tasks Squash automates.

*If Squash captures even 5% of that displaced work as software revenue, that is **$3.2B ARR**. At 15%, the share GitHub Copilot is approaching on developer productivity, it is **$9.6B ARR**. This is why this can be huge.*

**Why the value maths works in our favour**

A human PM processes, at best, 5 to 10% of the available product data in a week. Interviews, sampled dashboards, a handful of replays. Squash looks at 100% of it every hour, forever. The bar for Squash to be useful is not 'better than the best PM in the world'. The bar is 'better than the PM’s acting on 5% of data.'

*If Squash produces insights that get added to a roadmap more often than a median human PM's output, the question shifts. It stops being 'is this a tool?' and becomes **'What share of a team's roadmap is Squash-originated?’** It slowly becomes the infrastructure that is the equivalent of headcount, and every product team in the world needs to be on it.* 

# **5\. Pricing**

**Hybrid platform fee plus tiered ACV**

The right pricing model for Squash mirrors what works for category-defining infrastructure (Datadog, Segment, and Snowflake). A platform fee for the data plumbing, plus tiered usage limits, plus a premium tier that captures expansion value. Four tiers, designed to set the ACV expectations we want enterprise buyers to anchor on.

| Tier | Starter | Growth | Scale | Enterprise |
| :---- | :---- | :---- | :---- | :---- |
| **Price** | $1,500/mo  ($18K/yr) | $3,500/mo  ($42K/yr) | $6,500/mo  ($78K/yr) | $150K+/yr custom |
| **Target buyer** | Series A or B, 1-5 PM team | Series B or C, 5 to 15 PM teams | Series C+, full Product org | Public or late-stage |
| **No. of context pods** | 1 | 3 | 10 | Customised |
| **Monthly active data/users tracked** | To be capped | To be capped | To be capped | Customised |
| **Seats** | Up to 5 | Up to 25 | Unlimited | Unlimited \+ SSO |

   
**Gated on monthly data processed.** Squash's cost scales with the data it processes (events, replays, tickets).  
**Value-based pricing.** We will eventually be an infrastructure that helps them decide what to build next and identify their customer’s pain point. This is a high-value problem which will reduce the headcount of product, data and CS teams. Pricing will match the value we deliver.

*Note: The majority of our customers are based out of the US and abroad; we believe this is a very fair and reasonable pricing for them.*

# **6\. Goals for the Next 6 Months**

* **Close 10 paying enterprise customers.** Prove people will pay $18K to $78K for this before optimising anything else.

* **Ship integrations on customer demand.** unblocks a large chunk of potential customers and steadily increase our TAM.

* **Close the loop from insight to execution.** Become the most insightful PM teammate our customers have ever had. Measured by Squash-originated tickets shipped per week.

*Detailed roadmap: [Squash Roadmap](http://docs.google.com/spreadsheets/d/1xmmIGXn93t2VOpPXMJG1-iitMpfsnDHOmBa-pkxO2Uc)* 

# **Appendix. Investor Q\&A**

**Q: Is Amplitude / Mixpanel / PostHog going to build this?**

They have tried. 'Ask Amplitude,' 'Mixpanel Spark,' 'PostHog Max.' Each is good at querying its own data. None can read across tools, because doing so would weaken the lock-in their own pricing relies on. This is the classic incumbent problem. The layer that combines across tools needs to be neutral, and an incumbent cannot be neutral. (Salesforce never built Zapier. Datadog never built Segment. Same reason.)

**Q: How is ProductBot different from Squash?**

ProductBot is a strategic recommendation engine. It answers 'what should we build next?' using customer feedback, competitor signals, and market data. Squash answers this along with 'What is broken right now and why?' using behavioural data, replays, error logs, and the data warehouse. It has more context about how things are today to answer the same question, hence giving better insights. 

**Q: What does June's acquisition by Amplitude signal?**

June was a very simple product analytics tool for B2B SaaS. It gave teams automatic metrics out of the box (DAU, retention, power users), with a 2-minute setup, no SQL, and Slack alerts. Amplitude acqui-hired it in July 2025\. June shut down on August 8, 2025\.

Two signals:

* Amplitude is doubling down on the exact wedge Squash targets (B2B SaaS, simple insight delivery).

* Amplitude could not build that simplicity in-house, even with $312M of revenue and around 600 employees. Incumbents have organisational gravity that prevents simplicity. That is structural. It does not go away.

Squash benefits both ways. The deal validates the demand, and it reinforces that the incumbents themselves cannot build it.

**Q: Why now? Why could this not have been built two years ago?**

Three things had to be true at the same time, and only became true in late 2024 or early 2025:

* LLMs cheap enough to run continuously on every event in a product, not just on demand.

* LLMs accurate enough to reason over a mix of structured data (analytics events) and unstructured data (support tickets, replay metadata) without hallucinating numbers.

* MCP and similar tool-use protocols standardised, so we can plug into 20+ tools without writing 20+ custom connectors.