# Example: A Helpful and Delightful Electric-Bill Payment Experience

## The Customer

**Elena Ramirez** is an electric utility customer.

She works full-time, has two children, and manages most household responsibilities from her phone. She received a reminder that her electric bill is due, and she is trying to take care of it during a short break at work.

Her current balance is **$286.42**.

Elena is not thinking about the utility’s customer information system, payment processor, credit policies, collections workflow, service-order system, or regulatory notices. She has a straightforward goal:

> “I need to pay my electric bill and know that my service is safe.”

She enters her debit-card information and selects **Pay Now**.

The screen spins for several seconds.

Then she sees:

> **Payment Error**
> We were unable to process your request. Please try again later or contact customer service.

This message leaves Elena with more questions than answers:

* Did the payment go through?
* Was the card charged?
* Should she try again?
* Could trying again create a duplicate payment?
* Is the bill still past due?
* Is her electric service at risk?
* Can she pay part of the bill?
* Is a payment arrangement available?
* Does she need to call the utility?
* Will she have to explain everything again?

The transaction failed, but the larger failure is the uncertainty placed on the customer.

For an electric utility, this is especially serious. The customer is not buying an optional product. She is trying to maintain an essential household service.

---

# The Profoundly Helpful and Delightful Version

Instead of displaying a generic error, the utility provides a precise, account-aware response:

> ## Your payment was not completed
>
> Your bank did not approve the **$286.42** payment.
>
> **No payment was posted to your utility account, and this payment attempt will not be retried automatically.**
>
> **Electric service status:** Active
> **Current account balance:** $286.42
> **Next account action date:** August 20
>
> To keep your account current, choose one of the available options below:
>
> **Try another payment method**
> Use a different card or bank account.
>
> **Pay part of the balance**
> Pay an amount today and review payment arrangements available for the remaining balance.
>
> **Review bill-assistance options**
> See assistance programs and protections that may be available for this account.
>
> **Get help with this payment**
> Chat with a representative or request a callback. We will include the details of this payment attempt so you do not have to repeat them.
>
> Your billing information and payment progress have been saved.

The page presents four prominent actions:

**Try Another Method**

**Review Payment Arrangement**

**Find Bill Assistance**

**Talk to Someone**

This is helpful because it provides accurate information.

It is delightful because it anticipates the customer’s emotional and practical needs.

In a utility context, “delightful” does not mean animations, congratulatory messages, or decorative features. It means:

* Elena knows whether her money moved.
* She knows whether she should try again.
* She knows the status of her electric service.
* She understands her next deadline.
* She receives only options that are actually available to her account.
* She does not lose the information she already entered.
* She does not have to repeat her story when she changes channels.
* She is treated as a person trying to solve a problem—not merely as a delinquent account.

---

# The Experience Must Distinguish Payment States

A well-designed utility payment experience must clearly distinguish among at least three states.

## 1. The Payment Failed

The system can confidently say:

> Your payment was not completed. No payment was posted to your account.

It should then explain whether the attempt will be retried and provide another path forward.

The utility should not claim that the customer had insufficient funds unless the payment provider has explicitly and appropriately supplied that information. A safer explanation is:

> Your bank did not approve the transaction.

## 2. The Payment Is Pending

The system should not encourage the customer to submit another payment.

Instead, it should say:

> ## Your payment is still being verified
>
> Your **$286.42** payment has not yet been posted, but it has not been declined.
>
> Please do not submit another payment while verification is in progress. Doing so could result in duplicate payments.
>
> We expect an update by **3:00 p.m. today**. We will notify you by text or email when the payment is posted or if another action is required.

The customer should be able to see the status without repeatedly calling the utility.

## 3. The Payment Was Posted

The confirmation should state:

> ## Your payment was successful
>
> **Amount paid:** $286.42
> **Payment method:** Bank account ending in 4812
> **Confirmation number:** UTY-4829371
> **Remaining balance:** $0.00
> **Account status:** Current
>
> A receipt has been sent to the email address and mobile number on file.

The customer should have an easily accessible receipt and confirmation number.

---

# When the Customer Cannot Pay the Full Balance

Suppose Elena has only **$175** available today.

The utility should not force her through a full-payment workflow only to reject her at the end. It should make legitimate account options visible before she begins.

The experience might say:

> ## You have options for this balance
>
> Your current balance is **$286.42**.
>
> Based on the current status of your account, you can:
>
> * Pay the full balance.
> * Pay at least $150 today and divide the remaining balance across two future bills.
> * Request a different payment arrangement.
> * Review available bill-assistance programs.
> * Speak with an account specialist.
>
> Selecting an option will show the exact dates, amounts, and conditions before you agree to anything.

Elena selects **Pay $175 and review an arrangement**.

The system then presents the proposed terms in plain language:

> **Payment today:** $175.00
> **Remaining balance:** $111.42
> **Additional amount on next bill:** $55.71
> **Additional amount on following bill:** $55.71
>
> Your regular monthly charges will still be due in addition to these amounts.
>
> Review the full terms before confirming.

This final sentence is important. A payment arrangement can sound affordable when the customer sees only the past-due portion. The experience should clearly explain that normal future usage charges will continue.

The system should never make an arrangement look easier than it really is merely to increase enrollment.

---

# When Electric Service May Be at Risk

The experience must be completely accurate about service status.

It should never use vague language such as:

> Pay now to avoid immediate disconnection.

unless immediate disconnection is actually possible and the statement complies with applicable rules and utility policy.

Instead, the system should obtain authoritative information from the appropriate account and service-order systems.

A clear message might read:

> ## Your electric service is currently active
>
> A service-interruption review is scheduled for **August 20**.
>
> To prevent further collection activity, complete one of the following by **5:00 p.m. on August 19**:
>
> * Pay the required amount.
> * Establish an eligible payment arrangement.
> * Complete an approved assistance application.
> * Contact us if you believe the account status is incorrect.
>
> Completing an action online will generate a confirmation. Keep that confirmation for your records.

Where account rules allow it, the system should immediately update downstream collections and service-order workflows after a qualifying payment or arrangement is completed.

The customer should not have to wonder whether the website, call center, billing system, and field-service organization have received the same information.

---

# A Better End-to-End Customer Journey

## Step 1: Elena Sees the Bill Clearly

Before asking for payment, the utility explains:

* The total balance
* The current monthly charges
* Any past-due amount
* Fees or adjustments
* Credits
* Previous payments
* The due date
* The customer’s current account and service status

If the bill is unusually high, the experience might also offer a clear explanation:

> This bill is $74 higher than your previous bill. The largest difference is increased electricity usage between July 3 and July 18.

The payment experience should begin with understanding, not simply a large **Pay Now** button.

## Step 2: Elena Selects a Realistic Payment Option

The interface shows the payment methods and account options that are actually available:

* Bank account
* Debit or credit card
* One-time payment
* Scheduled payment
* Partial payment
* Payment arrangement
* Assistance-program review
* Human support

Fees, processing times, and posting dates should be disclosed before confirmation.

## Step 3: The System Confirms Elena’s Intent

Before submitting, the utility summarizes:

> You are authorizing a one-time payment of **$175.00** from the bank account ending in **4812**. The payment is scheduled for today.

The system should make it clear whether this payment affects any existing automatic-payment instruction.

For example:

> You are currently enrolled in automatic payment. Your scheduled automatic payment of $286.42 is still active.
>
> Would you like this one-time payment to reduce or replace the scheduled automatic payment?

This prevents one of the most frustrating payment experiences: accidentally paying the same bill twice.

## Step 4: The Payment Is Processed Safely

The system uses an idempotent transaction process so that repeated taps, slow network conditions, or page refreshes do not create duplicate payments.

The customer sees an honest status:

* Processing
* Pending verification
* Completed
* Failed

The interface does not display “successful” before authoritative confirmation is available.

## Step 5: The Customer Receives the Right Recovery Path

When something fails, the options are based on:

* Payment status
* Account balance
* Due date
* Service status
* Eligibility for payment arrangements
* Assistance-program availability
* Customer communication preferences
* Applicable account protections
* Existing promises or arrangements
* Scheduled automatic payments

The system does not send every customer to the same generic FAQ page.

## Step 6: The Customer Receives Durable Confirmation

After Elena completes a payment or arrangement, she receives:

* A confirmation number
* The amount and date
* The remaining balance
* The next required action
* Any future arrangement dates
* Current service status
* A receipt
* A way to return to the agreement later

The confirmation should be available through the channel Elena selects, such as email, text, the mobile application, or a printable page.

## Step 7: Every Utility Channel Sees the Same Result

If Elena calls later, the representative should be able to see:

* The failed attempt
* The successful payment
* The arrangement she reviewed or accepted
* The messages she received
* The stated next action
* Any pending assistance request

Elena should not hear:

> “I don’t see anything here. You will need to explain what happened.”

Channel continuity is part of the customer experience.

---

# An AI Assistant Within This Experience

An AI assistant could help Elena navigate the situation, but it must operate against authoritative account information and clearly defined permissions.

Elena asks:

> “Did my payment go through, and is my power going to be shut off?”

A helpful response would be:

> Your $286.42 payment did not post, and no payment was collected from that attempt.
>
> Your electric service is currently active. The next account action date shown on your account is August 20.
>
> You can try another payment method, review a payment arrangement, or check bill-assistance options. I can explain any of those choices or prepare the next step for you.

Suppose Elena chooses a payment arrangement.

The assistant might say:

> Your account currently shows an option to pay $175 today and divide the remaining $111.42 across two future bills.
>
> I can prepare that arrangement for your review. I cannot accept the agreement or submit the payment without your authorization.

The assistant should never:

* Invent a service date
* Promise that service will remain active without authoritative confirmation
* Claim a customer is eligible for an arrangement before checking
* Hide fees or future obligations
* Submit a payment without explicit authorization
* Change a payment method silently
* Represent a pending payment as completed
* Discourage the customer from seeking human help
* Make legal or regulatory determinations outside its approved instructions

When the assistant reaches a permission boundary, it should explain the boundary and the next action rather than simply refusing. This follows the broader design principle for agentic experiences. 

---

# How This Experience Replaces the Roadmap as the Coordination Mechanism

In a traditional utility operating model, this work might be divided into separate initiatives:

* Billing portal redesign
* Payment-processor upgrade
* Mobile-payment enhancement
* Credit and collections modernization
* Payment-arrangement redesign
* Bill-assistance integration
* Contact-center scripting
* Customer-information-system integration
* Service-order integration
* Notification improvements
* Accessibility remediation
* AI virtual-assistant implementation
* Analytics modernization

Each initiative might have its own budget, roadmap, project manager, schedule, requirements, and success measures.

The payment portal team could complete its project while the call center still lacks transaction visibility.

The collections team could launch a new arrangement while the website still displays the old rules.

The AI assistant could answer questions using documents that do not reflect the authoritative billing system.

The notification team could send a successful-payment message before the service-order system receives the update.

Every individual project might appear “green,” while Elena’s experience remains broken.

The experience-led model starts with a shared customer outcome:

> **When a customer cannot complete an electric-bill payment, the customer will immediately know whether money moved, whether electric service is at risk, and the fastest valid action available to keep the account current or obtain help—without losing work or repeating the situation.**

That outcome becomes the coordination mechanism.

---

# How Each Utility Function Contributes

## Product Management

Product management defines the customer problem and the intended outcome.

It must answer:

* What does Elena need to know immediately?
* What uncertainty is causing the most anxiety?
* Which recovery options create real value?
* Which customers abandon the process?
* Which customers call after trying to pay online?
* Which problems can be solved without contacting an employee?
* Which situations require human judgment?

Product does not begin by requesting a new error screen. It begins by defining the complete recovery experience.

## Customer Experience and Design

Design covers more than the visual layout of the payment page.

It designs:

* Bill explanations
* Payment-selection logic
* Confirmation language
* Error states
* Pending states
* Duplicate-payment prevention
* Service-status explanations
* Payment-arrangement disclosures
* Assistance-program navigation
* AI-assistant responses
* Contact-center handoffs
* Text and email notifications
* Accessibility behavior
* Multilingual experiences
* What happens when account data is unavailable

Design’s central questions are:

> Does the customer understand what happened?

> Does the customer know what to do next?

## Billing and Customer Information Systems

The billing platform supplies authoritative information about:

* Current balance
* Due date
* Past-due amount
* Payment history
* Account status
* Existing arrangements
* Automatic-payment enrollment
* Credits and adjustments
* Applicable account rules

The experience must not rely on a delayed copy of this information when it could result in an incorrect payment or service-status message.

## Payments Engineering

Payments engineering ensures that:

* Transactions are secure
* Payment states are accurate
* Duplicate payments are prevented
* Provider responses are translated appropriately
* Retry rules are explicit
* Pending transactions are monitored
* Confirmations are generated only after valid processing
* Reversals and returned payments are handled correctly
* The customer can see what happened

Its job is not merely to connect to a payment processor. It is to make the transaction trustworthy.

## Credit and Collections

Credit and collections defines:

* Account-action rules
* Arrangement options
* Required payment amounts
* Collection stages
* Eligible recovery paths
* Escalation conditions
* Downstream service-order actions

The function should help design a pathway to resolution, not merely supply warning language.

## Bill-Assistance Program Operations

This team makes assistance discoverable and understandable.

It should ensure that the experience explains:

* What kinds of assistance may be available
* What information the customer must provide
* What happens after an application
* Whether an application affects current account activity
* How the customer can track status
* Where human help is available

The product should avoid forcing customers to search through multiple websites or repeatedly enter the same information.

## Customer Care

Customer-care employees contribute real-world evidence:

* What do customers ask after a failed payment?
* Which messages create confusion?
* What account situations are too complex for self-service?
* Where do customers lose trust?
* Why do customers call more than once?
* What information is missing from the employee desktop?

When Elena escalates to a representative, the employee should inherit the context from the digital interaction.

## Field and Service Operations

Where applicable, service operations ensures that qualifying payments, arrangements, or account protections are reflected in downstream service-order activity.

The customer-facing system should not promise that a service action has been canceled until the authoritative operational system confirms it.

## Regulatory, Legal, and Compliance

These functions help ensure that:

* Notices are accurate
* Required disclosures are presented
* Customer protections are applied correctly
* Payment arrangements are represented honestly
* Service-status statements are not misleading
* Records are retained
* Customer choices are not manipulated
* Available assistance is not obscured

Their role is to help create a safe and understandable experience—not merely approve wording at the end of the project.

## Security and Privacy

Security and privacy protect:

* Payment credentials
* Account data
* Identity-verification processes
* Authorization
* Agent permissions
* Customer communication preferences
* Audit records

Security should be integrated into the experience so customers can understand why verification is required and what information will be used.

## Accessibility and Language Services

Customers must be able to complete the experience through:

* Screen readers
* Keyboard navigation
* Sufficient visual contrast
* Understandable language
* Mobile devices
* Supported languages
* Appropriate text sizing
* Accessible documents and confirmations

The most critical payment and service information should not be less complete in an alternate language or accessible channel.

## AI and Automation Teams

AI teams can support:

* Plain-language bill explanations
* Account-aware guidance
* Document retrieval
* Call summarization
* Agent assistance
* Next-action preparation
* Translation support
* Quality monitoring

But AI must operate within documented standards, authoritative data sources, permissions, escalation paths, and definitions of completion. Agents increasingly act on documentation, which makes ambiguity operationally dangerous. 

## Data and Analytics

Analytics measures whether the customer successfully recovered—not simply whether a feature launched.

The team should examine:

* What failed
* Why it failed
* What the customer did next
* Whether the customer completed payment
* Whether the customer sought assistance
* Whether the customer contacted the utility
* Whether the customer had to repeat the process
* Whether account or service status was communicated correctly

---

# The Experience as a Daily Decision Filter

Instead of waiting for a quarterly roadmap meeting, the cross-functional team can evaluate changes against the customer experience.

## Does the change reduce uncertainty?

Showing whether the payment posted is valuable.

## Does it prevent customer harm?

Warning Elena not to retry a pending payment can prevent a duplicate charge.

## Does it improve continuity of service?

Providing an accurate payment-arrangement path may help the customer resolve the account before further collection activity.

## Does it preserve the customer’s effort?

Saving the bill, payment amount, and assistance information is valuable.

## Does it treat the customer with dignity?

Plain, neutral language is better than threatening or accusatory language.

## Does it provide an action the customer can actually take?

Displaying an ineligible payment arrangement is not helpful, even if the screen looks polished.

## Does it create a new risk?

An AI assistant promising that service will remain active without authoritative confirmation should not move forward.

## Can the team test it with customers?

The team can place the working recovery experience in front of customers, observe where they hesitate, and improve it quickly.

---

# Measures of Success

The program should not be declared successful merely because the new payment page went live.

It should measure customer outcomes.

## Payment Recovery

* Percentage of failed payments followed by a successful payment
* Median time from payment failure to resolution
* Percentage of customers who successfully use another payment method
* Percentage who complete an available payment arrangement

## Customer Understanding

* Percentage of customers who correctly understand whether the payment posted
* Percentage who understand the next required action
* Percentage who correctly understand their service status
* Customer-effort score after a failed payment

## Customer Protection

* Duplicate-payment rate
* Incorrect payment-status message rate
* Incorrect service-status message rate
* Number of customers who receive conflicting information across channels
* Number of customers who lose an arrangement because of system or communication failure

## Channel Effectiveness

* Calls generated by failed online payments
* Repeat-contact rate
* Transfers between customer-care teams
* Percentage of escalations that include complete digital context
* Time required for a representative to understand the situation

## Assistance and Affordability

* Percentage of eligible customers who find assistance options
* Completion rate for assistance applications
* Abandonment rate during arrangement enrollment
* Arrangement completion and adherence
* Reasons customers decline or abandon available options

A particularly useful north-star measure might be:

> **Percentage of customers who experience a recoverable payment problem and reach a valid resolution within ten minutes without receiving contradictory information or repeating their situation.**

Critical accuracy should be treated as a guardrail, not merely an optimization metric:

> **The utility must not misstate whether money moved, whether a payment posted, whether an arrangement was accepted, or whether service is at risk.**

---

# The Single Coordinating Statement

The entire utility can align around one sentence:

> **When Elena tries to pay her electric bill, she will always know whether her payment was completed, what her account and service status are, and the fastest valid action she can take next—without losing her work, receiving conflicting information, or being treated without dignity.**

That sentence clarifies:

* **Who matters:** Elena
* **What she is trying to do:** Pay her electric bill
* **What she fears:** Losing money, making a duplicate payment, or risking service
* **What “helpful” means:** Accurate status and actionable choices
* **What “delightful” means:** Confidence, dignity, preserved effort, and continuity
* **What engineering must provide:** Reliable payment and account-state information
* **What design must provide:** Clarity across every channel and failure state
* **What operations must provide:** Account options that actually work
* **What compliance must protect:** Accuracy, fairness, disclosure, and customer protections
* **What AI must do:** Explain and prepare actions without inventing facts or exceeding authority
* **What the utility should measure:** Successful customer resolution

The utility may still maintain investment plans, regulatory commitments, capital plans, and delivery forecasts.

But those plans no longer serve as the primary mechanism holding the work together.

**The customer’s successful, dignified resolution of the electric bill becomes the thing that holds the work together.**
