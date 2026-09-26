export const comparison = `
An AI tutor helps through conversation: it can explain a term, respond to a question, or comment on a proposed solution. An interactive simulation helps through experimentation: you change a defined input and inspect the model’s response. Combine them by using conversation to frame a question and a simulation to test a prediction.

Neither label guarantees educational quality. A conversational tool may give an incorrect explanation, and a simulation may implement an oversimplified or faulty model. The useful question is which activity helps you demonstrate the particular understanding you need. Here is a practical comparison for students choosing a study method and teachers planning a lesson.

## What an AI tutor contributes

In this article, “AI tutor” means a conversational generative AI tool used for study. Some dedicated tutoring products add reviewed curricula, restrictions, or assessment features; their behavior may differ. Do not assume that every general chatbot has those safeguards or can accurately diagnose a learner’s needs.

A conversation is useful when your difficulty is verbal or procedural. You can request a simpler definition, ask why a step follows, or submit your own explanation for criticism. For example, you might ask why pressure changes when a gas container becomes smaller. Follow-up questions let you identify whether the missing idea concerns particles, collisions, or the meaning of pressure.

The weakness is that a fluent explanation may conceal an unsupported claim. A chatbot can also change its position when challenged without resolving the underlying science. Keep a textbook or other authoritative reference available, and judge the explanation by its reasoning and evidence rather than how encouraging it sounds.

## What an interactive simulation contributes

A simulation makes a model available for repeated investigation. You choose inputs, observe outputs, and compare runs under controlled conditions. The [Gas Law Lab](/en/simulations/gas-law-lab), for example, connects the amount of gas, volume, and temperature to a displayed pressure. You can vary one quantity while keeping the others fixed.

That creates a different learning task from reading a generated explanation. Before each change, you can predict a direction or value. Afterward, you can compare your prediction with the display and account for a mismatch. The record of settings makes the comparison reproducible within the model.

A simulation also has boundaries. An ideal-gas model does not include every interaction in a real gas. An animation may rescale particles or time to make an idea visible. A visually convincing result therefore needs the same questions you would ask of an equation: what assumptions are built in, and when do they stop being useful?

## Compare the tools by the work you need to do

- Clarify an unfamiliar term: begin with your course material, then use a conversation to ask a focused follow-up.
- Explore how one variable affects another: use a simulation with explicit controls and readable outputs.
- Diagnose a mistaken explanation: write your reasoning first, request feedback, and verify the correction independently.
- Prepare for a numerical assessment: solve the problem yourself, check the calculation, then compare with an appropriate model.
- Develop experimental judgment: plan a controlled comparison and explain what the model cannot establish about the real world.

These choices can change within a single study session. You may start with a vocabulary question and discover that your difficulty is really a prediction about an unfamiliar system. Switch activities when the question changes. Spending more time in one tool is not itself evidence of more learning.

## A homework question that needs two different kinds of help

Suppose your homework asks why gas pressure rises when a fixed amount of gas occupies less space. You can repeat the phrase more collisions, but you cannot explain what must stay constant. A conversational tool might help you identify that missing condition. A simulation can then let you compare volumes while keeping temperature and gas amount unchanged.

Before opening either tool, decide what you want to produce: a two-run comparison and a short explanation. In the conversation, ask what pressure means and which variables could affect it. In the model, record the starting conditions and change only volume. Return to the explanation afterward and check whether it describes the exact comparison you performed.

The order matters less than the division of work. If you already understand the terminology, you may begin with the simulation. If the interface is confusing, a teacher's demonstration or the lab's instructions may be more useful than a chatbot. Choose the next action because it resolves your current difficulty, not because one tool is supposed to be used first.

A bicycle pump is a familiar starting image, but it adds complications. An actual pumping process may change temperature and transfer gas into a tyre, whereas a constant-temperature, fixed-amount model holds both of those conditions steady. Use the everyday object to introduce a question, then state clearly which part of the real process your digital comparison represents.

:::figure gas-comparison

## A simple way to divide the work in a pair

If two students share a laptop, one can be the questioner and the other the investigator. The questioner writes a prediction and challenges missing assumptions. The investigator operates the controls and records the values. Swap roles for the next comparison so neither person becomes a permanent spectator or typist.

Keep a small shared record with three lines: what we predicted, what the model showed, and what we still need to explain. If a generated answer disagrees with your calculation, preserve both and check the relevant source. The aim is not to make the tools agree by changing inputs until a convenient number appears.

End with an individual question that changes one condition. Ask each learner to explain the result without the conversation or simulation visible. A pair may produce a convincing group answer while one learner remains unsure. This final step makes that gap easier to notice and discuss.

Teachers can find examples of classroom questioning and facilitation in [PhET's teaching resource on facilitation](https://phet.colorado.edu/en/teaching-resources/teaching-with-phet/facilitation). Use it as planning support for the discussion around a model; it is not an evaluation of a particular AI tutor. For a student routine that works with or without a conversational tool, continue with [simulation-based self-study](/en/articles/educational-simulations-for-self-study).

## A worked investigation: compressing an ideal gas

Start with this question: “For a fixed amount of ideal gas at constant temperature, what happens to pressure when volume is halved?” Write a prediction before consulting either tool. Include the fixed conditions, because pressure also depends on temperature and the amount of gas.

In the Gas Law Lab, choose 1 mol, 300 K, and 20 L. The displayed pressure should be about 124.7 kPa. Change only the volume to 10 L. The expected pressure is about 249.4 kPa. These are calculated model values using P = nRT/V and R = 8.314 kPa·L/(mol·K), not measurements collected from a physical gas sample.

Ask the AI to explain why the ratio of the two pressures is two. Then ask it to identify which conditions are necessary for that result. Compare the explanation with [OpenStax’s ideal gas law chapter](https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law). If the response discusses heating the gas, bring it back to your constant-temperature comparison.

Now add a transfer question: “If volume doubles while temperature also doubles in kelvin, with the same amount of gas, what happens to pressure?” The two changes cancel in this ideal model. Solve the ratio on paper before checking a new pair of settings. This tests whether you understand the relationship beyond the first slider movement.

## Why agreement between tools is not proof

The simulation calculates a result from its model, and the chatbot may describe that same model. Agreement can show that the explanation and implementation are consistent. It does not show that the model captures every feature of nature or that either tool is error-free.

For instance, an ideal-gas comparison cannot establish the pressure of every real substance near condensation. You would need to examine whether ideal behavior is a suitable approximation and, for a real investigation, consider actual measurements. Keep a clear distinction between a mathematical consequence and experimental evidence.

When the tools disagree, check inputs, units, rounding, and assumptions first. Record the exact conflicting statements. Then use [the AI science-answer checklist](/en/articles/check-ai-generated-science-answers) or ask a teacher to help resolve the remaining issue. Do not select the answer merely because its interface looks more professional.

## How teachers can combine them in a lesson

A teacher can prepare a short, deliberately incomplete explanation and ask students what information is missing. Students then make individual predictions, compare them in pairs, and test one agreed comparison in a simulation. The final discussion should ask what changed in their reasoning and what evidence supports that change.

Conversation can assist the preparation of prompts and alternative explanations, but the teacher checks them before class. During the activity, the simulation provides a shared reference for discussion. PhET’s [whole-class teaching strategies](https://phet.colorado.edu/en/teaching-resources/virtual-workshop/whole-class-strategies) describe approaches centered on inquiry and prediction that can inform this kind of lesson design.

Give students roles that rotate: one predicts, one operates the controls, and one records and questions the result. If devices are limited, project the simulation and collect predictions before changing a control. Students can still perform the reasoning even when they are not individually operating a screen.

## Choose an activity that reveals understanding

The [Pendulum Physics Lab](/en/simulations/pendulum-physics) offers a useful next comparison. It uses a small-angle, undamped model. Ask students to predict how changing length affects period, then test two lengths with gravity held fixed. Require a statement of the approximation as part of the explanation.

Assess the reasoning students produce after using the tools. Can they identify controlled variables, explain a pattern, and predict a new case? A copied explanation and a completed simulation mission do not, on their own, answer those questions. An exit task without either tool provides a clearer view of what remains difficult.

## Which should you use first?

Start with the obstacle. If you cannot state the scientific question, use your notes and a short explanation to clarify it. If you already have a question about cause and effect, begin with a prediction and a controlled simulation comparison. For a complete classroom sequence, see [preparing science lessons with AI](/en/articles/how-teachers-use-ai-to-prepare-science-lessons). The strongest combination leaves the learner doing the predicting, checking, and explaining.
`;
