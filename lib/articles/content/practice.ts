export const practice = `
Use AI to create science practice questions by specifying a learning objective, a question mix, and the assumptions each problem must state. Request a separate answer key with reasoning, then solve and verify every item before using it. Good practice reveals how a learner thinks; a long list of generated questions does not necessarily do that.

Students can use this method to prepare revision tasks after studying a concept. Teachers can use it to draft a worksheet or a short formative assessment. In both cases, the useful work includes choosing what to assess, removing ambiguity, and correcting the answers. Keep generated questions separate from checked questions until those steps are complete.

## Start with a question blueprint

Choose one objective narrow enough to assess in several ways. For example: “Calculate acceleration from mass and net force, including a stated opposing resistance.” Identify what learners already know and which errors the practice should uncover. That prevents the generator from drifting into unrelated topics or more advanced mathematics.

Plan a small set with different demands: one conceptual explanation, one direct calculation, one error diagnosis, one prediction, and one transfer problem. Changing only the numbers across ten otherwise identical questions mainly repeats the same operation. A mixed set can reveal whether students recognize the relationship in different forms.

Specify allowed assumptions and units. For the examples below, use a cart on a horizontal track with constant mass and stated horizontal forces. Applied force exceeds opposing resistance. Acceleration is measured in m/s², force in newtons, and mass in kilograms. The task concerns the simplified model, not an uncontrolled physical experiment.

## Ask for questions and answers separately

> Create five introductory questions about net force and acceleration for students who know subtraction and division. Include explanation, calculation, error diagnosis, prediction, and transfer. State all forces and masses. Use a constant-mass cart with applied force greater than opposing resistance. Give the questions first, then a separate answer key with units, reasoning, and one likely misconception for each. Do not claim alignment with a named exam board.

Review the questions before looking at the generated key. Solve them independently so that a plausible answer does not steer your calculation. If you cannot solve an item from the supplied information, flag it as incomplete. Ask for a revision that supplies the missing condition rather than silently assuming it yourself.

The five questions below are worked examples for this guide, not a transcript from an AI service or a standardized assessment. You can attempt them first and then open each answer. Compare their reasoning with the [Newton’s Laws Force Lab](/en/simulations/newtons-laws-force-lab) and your course material.

## A checked five-question practice set

### 1. Explain a relationship

A cart’s mass doubles while its net force stays the same. What happens to its acceleration, and which condition makes your conclusion valid?

:::answer Answer and reasoning
Acceleration halves because acceleration equals net force divided by mass. The essential condition is that net force remains unchanged. Saying only that “heavy objects accelerate less” leaves out that condition and overgeneralizes the result. No initial speed is needed to answer this particular acceleration comparison.
:::

### 2. Calculate with opposing forces

A 10 kg cart is pushed forward with 25 N and experiences 5 N of opposing resistance. Calculate its net force and acceleration, taking forward as positive.

:::answer Answer and reasoning
The net force is 25 − 5 = 20 N forward. Acceleration is 20 ÷ 10 = 2 m/s² forward. Dividing 25 by 10 would omit resistance. Adding the force magnitudes would also be wrong because they act in opposite directions along the same line.
:::

### 3. Diagnose an incorrect solution

A learner writes: “A 5 kg cart has 15 N applied force and 5 N resistance, so its acceleration is 3 m/s².” Identify the mistake and correct the result.

:::answer Answer and reasoning
The learner used the applied force instead of net force. Subtracting resistance gives 10 N, so acceleration is 10 ÷ 5 = 2 m/s². A useful correction names the omitted force and shows the subtraction; simply replacing 3 with 2 does not explain the error.
:::

### 4. Predict before using the model

Keep mass at 10 kg and resistance at 5 N. Increase applied force from 15 N to 25 N. Does acceleration increase by a factor of 25/15, by a factor of two, or remain unchanged? Explain your choice.

:::answer Answer and reasoning
It doubles, from 1 m/s² to 2 m/s², because net force rises from 10 N to 20 N. The ratio of applied forces is not the ratio of net forces when the same nonzero resistance is subtracted in both cases. This distinction is the purpose of the question.
:::

### 5. Solve an inverse problem

You want a 10 kg cart to accelerate at 2 m/s² against 5 N resistance. What applied force is required? What applied force would produce the same acceleration for a 20 kg cart with the same resistance?

:::answer Answer and reasoning
The first cart needs 20 N net force, so apply 25 N. The second needs 40 N net force, so apply 45 N. Add the resistance after calculating mass times acceleration. Doubling the first applied force to 50 N would not preserve the target acceleration for the second cart.
:::

## Connect practice to observable results

Use the force lab to check the settings in questions two, four, and five. Write the prediction first, record the settings, and compare the displayed acceleration with the calculation. Explain any disagreement before changing the worksheet. A different resistance setting can make a correct answer appear wrong.

For another topic, use the [Gas Law Lab](/en/simulations/gas-law-lab). Ask for a question in which volume halves while temperature and amount of gas remain fixed. Then add a second question that changes temperature too. Check that the answer uses kelvin and makes the controlled conditions explicit. This produces a meaningful conceptual variation instead of merely changing digits.

## Audit the answer key and wording

- Check that every question has enough information and that its units are consistent.
- Recalculate the answer independently, including intermediate steps and rounding.
- Confirm that a multiple-choice item has one intended correct answer under its stated assumptions.
- Explain why each distractor is wrong; remove options that differ only through ambiguous wording.
- Make sure the worked solution uses the same setup as the question and the linked simulation.

Use [OpenStax’s account of net force and acceleration](https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system) as a reference for this set. For broader checks, follow [how to verify an AI-generated science answer](/en/articles/check-ai-generated-science-answers). A second generated answer is another draft to inspect, not a completed verification.

## Turn a familiar situation into a question with enough information

A vague generated question might ask why a full shopping trolley is harder to push than an empty one. This can begin a discussion, but it is not yet a numerical problem. The wording does not specify the applied force, opposing forces, or the quantity to compare. Ask for a revised classroom model rather than accepting an answer based on unstated assumptions.

For example: a cart of mass 10 kg has a constant net horizontal force of 20 N. A second cart has mass 20 kg and the same net force. Compare their accelerations. The answers are 2 m/s² and 1 m/s². Now ask the student which detail from a real supermarket the simplified model leaves out. This combines a checked calculation with a discussion of the example's limits.

A useful AI instruction is to change the context while preserving the relationship, and then change the relationship while keeping the context. The first variation might replace the cart with another wheeled laboratory object. The second might hold mass fixed and change net force instead. Review both versions so a change in storytelling does not quietly introduce a different model.

Avoid generating ten questions that differ only in their numbers. Include at least one request to draw the forces, one to explain why a tempting answer is wrong, and one to predict a new case. These require students to use the idea in different ways rather than recognize a familiar calculation pattern.

## Mark the reasoning, then decide what to practice next

For a short forces question, use a simple three-part check: identify the correct net force, apply the mass relationship, and state the answer with direction and units where appropriate. A learner who makes an arithmetic slip after setting up the problem correctly needs different practice from one who confidently omits resistance.

Keep an error note in the learner's own words. For example: I used the push as the net force and forgot the opposing force. The next question should address that distinction with manageable numbers. Once the student can explain it, change the context or ask for an inverse calculation. More difficult arithmetic is not always the next useful step.

For revision ideas beyond question generation, the Learning Scientists' [discussion of when study strategies work best](https://www.learningscientists.org/blog/2017/4/20-1) is useful background reading. Build a small practice set you can check carefully, attempt it without the key, and revisit the troublesome idea later. Follow [the self-study guide](/en/articles/educational-simulations-for-self-study) if you want to connect that review with a fresh simulation prediction.

## Revise from mistakes and revisit later

After attempting the set, classify errors: missing concept, wrong model, arithmetic slip, unit conversion, or unclear explanation. Choose the next question to address the actual problem. A learner who repeatedly omits resistance needs a force-identification task before another page of division exercises.

Try a similar question again later without the answer key. Students should follow classroom rules about AI assistance; teachers should review drafts before distribution and keep identifiable student information out of unapproved tools. Save the final checked questions with their assumptions and source references so future revisions do not accidentally reintroduce an error.
`;
