export const studentAi = `
AI can help you understand difficult science by rephrasing an explanation, asking diagnostic questions, and giving feedback on your reasoning. Use it in a cycle: identify one confusion, ask for a hint, make a prediction, test that prediction, and explain the result yourself. Check scientific claims against a trusted source before relying on them.

The useful outcome is something you can do without the conversation open. Can you explain why a cart accelerates, interpret a graph, or solve a different problem? A polished answer on a screen is only a starting point. This guide shows a study routine you can use with your class notes and LearnerKits simulations.

## Find the exact point where you get stuck

“I do not understand forces” is a large problem. “I do not understand why a moving object can have zero net force” is a question you can investigate. Before asking AI, spend two minutes writing what you know, what the question asks, and the step where your reasoning stops.

Separate vocabulary trouble from model trouble. You may know the definition of acceleration but confuse it with velocity. You may understand an equation but not know which forces belong in it. Give the AI that specific difficulty, your approximate course level, and the explanation you have already tried. Leave out names, grades, and other personal information.

> I am studying introductory forces. I think a moving cart must have a forward net force. Ask me one question at a time to find the problem with my reasoning. Use a frictionless horizontal track and do not give me a full solution yet.

This prompt creates space for you to think. If the response immediately supplies a solution, repeat the request for a single hint. You remain responsible for deciding whether the explanation makes sense.

## Ask for two explanations, then connect them

Request a short verbal explanation followed by a diagram description or numerical example. Different representations can expose different misunderstandings. For forces, a verbal account should distinguish a change in velocity from velocity itself. A force diagram should identify the object being studied and the forces acting on that object.

Ask what an analogy leaves out. A shopping-cart comparison may help you picture pushing a mass, but everyday carts have resistance. That makes the analogy unsuitable for explaining frictionless motion unless the difference is stated. A good follow-up is: “Which part of this comparison fails, and what scientific statement should I remember instead?”

Keep the explanation close to your course. If the response introduces unfamiliar calculus when your lesson uses simple ratios, ask for an explanation using those ratios. More technical language does not automatically make an explanation more useful or more accurate.

## Work through a force example you can test

Open [Newton’s Laws Force Lab](/en/simulations/newtons-laws-force-lab). Set the cart mass to 10 kg, applied force to 25 N, and resistance limit to 5 N. These settings exceed the resistance limit, so the model gives a net force of 20 N and an acceleration of 2 m/s². Predict the acceleration before running the cart.

Now change only the mass to 20 kg. Keep the two force settings fixed. The net force remains 20 N, so the acceleration becomes 1 m/s². Write the comparison in a small results table in your notebook: mass, applied force, resistance, net force, and acceleration. Include units in every heading.

Use AI after recording your observations. Ask it to critique your explanation that doubling mass halves acceleration when net force stays constant. Compare its feedback with [OpenStax’s explanation of Newton’s second law](https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system). The important condition is the fixed net force; changing several controls together would test a different claim.

This activity checks your reasoning against a programmed model. Agreement does not independently prove that all real carts behave this way. The lab simplifies resistance and begins with a cart at rest. Read its model notes before extending your conclusion to other situations.

## Turn an explanation into a prediction

Before moving a slider, complete this sentence: “If I change ___ while keeping ___ fixed, I expect ___ because ___.” This forces you to name the variable, the comparison, and the reason. A vague prediction such as “it will move differently” is difficult to evaluate.

Try the same method in the [Gas Law Lab](/en/simulations/gas-law-lab). Hold the amount of gas and temperature constant, then predict what happens to pressure when volume decreases. Record the starting settings so you can repeat the comparison. Ask AI to connect the numerical pattern to a particle explanation, then check that it has kept the same conditions throughout.

If your observation disagrees with your prediction, investigate before changing your answer. Did you accidentally change another control? Did you use Celsius where the relationship requires kelvin? Is the simulation describing an idealized system? A disagreement is useful when it leads to a more precise question.

## Check the answer before adding it to your notes

Treat confident wording as a writing style, not evidence. Ask for the relevant principle and a source you can open yourself. Check whether that source actually supports the particular claim. A citation to a real book is insufficient when the cited section discusses something different.

- Recalculate numerical steps with a calculator, including unit conversions.
- Look for missing conditions such as constant temperature, negligible friction, or small angles.
- Compare the explanation with your assigned textbook and ask a teacher about unresolved differences.
- Label invented examples as hypothetical; never record generated measurements as experimental observations.

For a fuller procedure, use [the science-answer checking guide](/en/articles/check-ai-generated-science-answers). Asking a second chatbot can reveal disagreement, but agreement between chatbots is not an independent scientific source.

## Finish with a short explanation from memory

Close the conversation and write three sentences: the scientific claim, the evidence you observed, and the condition under which the claim holds. Then solve a nearby problem. For example, predict acceleration for a 5 kg cart with 20 N net force. The expected result is 4 m/s²; explain why rather than simply copying the equation.

Return to your original misconception. If you thought continued motion always requires a forward net force, explain the difference between maintaining velocity and changing velocity. Ask AI for feedback only after you have written your own version. Save the corrected explanation alongside the original attempt so you can see what changed.

## Keep the study routine manageable

A twenty-minute session could use three minutes to identify a question, four to discuss an explanation, eight to test predictions, and five to explain and check your understanding. These timings are a suggested routine, not a research claim about an ideal study duration. Adjust them to the difficulty of your task.

Use school-approved tools and follow your teacher’s rules about assistance and attribution. [UNESCO’s guidance on generative AI in education](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research) emphasizes human agency, age-appropriate use, and privacy. If a chatbot is unavailable or unsuitable, the same prediction-and-check routine works with a textbook, a classmate, and a simulation.

## Can AI replace a teacher or a science experiment?

AI can support questions and explanations, but a teacher can inspect your reasoning in context and decide what you need next. A simulation lets you explore a defined model, while a physical experiment introduces measurement uncertainty and real equipment. Each serves a different purpose. Read [AI tutors versus interactive simulations](/en/articles/ai-tutors-vs-interactive-simulations) to choose a useful combination for your next topic.
`;
