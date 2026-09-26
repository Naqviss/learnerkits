export const checking = `
To check an AI-generated science answer, identify its exact claim, inspect the assumptions, verify a relevant source, and redo the reasoning independently. For numerical answers, check units and calculate the result yourself. A simulation can test consistency with a model, but neither a chatbot’s confidence nor agreement between tools establishes scientific truth.

An incorrect answer is not always obviously absurd. It may use the right equation with the wrong quantity, omit a necessary condition, or cite a real source that does not support the conclusion. The following method gives you a repeatable way to decide what to keep, correct, or take to a teacher.

## First, separate the claim from the presentation

Copy the answer into your notes and underline the statements you would need to rely on. Separate definitions, calculations, causal explanations, and claims about research. A definition can be checked in a course text; a claim about a recent discovery needs the actual research and its date.

Rewrite a vague statement as a testable one. “A larger force means a faster object” mixes force, acceleration, and speed. A more precise claim specifies the net force, the mass, the time interval, and the quantity that changes. If the answer does not provide enough information, mark it as incomplete before trying to decide whether it is true.

Do not let formatting do the convincing. Equations, numbered steps, and a formal tone can appear in incorrect answers. Your job is to examine the relationship between the claim, the supporting evidence, and the conditions under which it applies.

## Check that the source exists and supports the claim

Open the cited source rather than asking the chatbot whether the citation is real. Confirm its title, author or responsible organization, and the passage relevant to the answer. A working link only confirms that a page exists; it does not confirm the AI’s interpretation of that page.

For established classroom science, begin with your assigned textbook or a recognized educational publication. For space or Earth observations, a relevant scientific agency may provide data and an explanation of how it was obtained. For a research claim, inspect the study’s methods and limitations, and distinguish one result from a broad consensus.

If no useful citation is given, search for the underlying concept independently. Avoid treating several pages that repeat the same unsourced sentence as separate confirmation. Keep the source link next to your corrected explanation so that you can revisit the evidence later.

## Inspect the quantities, units, and assumptions

Write a small inventory: what is known, what is requested, and which model is proposed. Convert units before substituting values. Check whether a temperature is absolute, whether a length is in metres or centimetres, and whether a stated force is applied force or net force.

Units provide an early warning. Force divided by mass has units of acceleration. Force multiplied by mass does not. Dimensional consistency cannot prove that an equation is correct, but a unit mismatch can show that a calculation needs repair.

Look for quiet assumptions: negligible drag, constant mass, an ideal gas, a closed circuit, or constant resistance. These are not decorative details. They determine whether the proposed relationship answers your question. Ask the AI to list them, then verify that list against the actual problem and source.

## Worked example: the wrong force in the right equation

Consider this hypothetical generated answer: “A 10 kg cart pushed with 25 N accelerates at 2.5 m/s².” That result follows if 25 N is the net force. If the cart also experiences 5 N opposing resistance, however, the net forward force is 20 N and the acceleration is 2 m/s².

Check it in [Newton’s Laws Force Lab](/en/simulations/newtons-laws-force-lab) using mass 10 kg, applied force 25 N, and resistance limit 5 N. These settings are above the resistance threshold in the model. Compare the displayed acceleration with your own subtraction and division. [OpenStax’s discussion of Newton’s second law](https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system) provides a reference for net external force.

The repair is not “the chatbot cannot do arithmetic.” Its arithmetic was consistent with a missing assumption. Your corrected answer should name the opposing force and explain why the original statement was incomplete. That makes the correction useful in the next problem too.

## Worked example: doubling the wrong temperature scale

Another hypothetical answer says: “Heating a sealed rigid container from 20 °C to 40 °C doubles its gas pressure.” For a fixed amount of ideal gas at constant volume, pressure is proportional to absolute temperature. The relevant temperatures are 293.15 K and 313.15 K, whose ratio is about 1.068.

The model therefore predicts an increase of about 6.8 percent, not a doubling. You can explore a nearby rounded comparison, 293 K to 313 K, in the [Gas Law Lab](/en/simulations/gas-law-lab), keeping volume and moles fixed. Use the exact temperatures in your written calculation and identify any rounding used in the simulation.

Consult the temperature discussion in [OpenStax’s ideal gas law chapter](https://openstax.org/books/chemistry-2e/pages/9-2-relating-pressure-volume-amount-and-temperature-the-ideal-gas-law). A statement about proportionality is incomplete until the scale and fixed conditions are specified. Do not test this example by heating a sealed physical container; the online model is sufficient for the learning task.

## Try a simple boundary or comparison case

Ask what the proposed explanation predicts in a case you can reason about easily. With the same positive net force, increasing mass should reduce acceleration in the introductory model. If a formula predicts the opposite, revisit the rearrangement. With fixed resistance in a closed ideal circuit, reducing supply voltage should reduce current.

The [Circuit Builder](/en/simulations/circuit-builder) also illustrates why the setup matters. In its series configuration, the separate resistor and the 10 Ω lamp both contribute resistance. Dividing voltage only by the adjustable resistor gives the wrong circuit current. Check that the resistor is installed and the switch closed before interpreting the output.

A boundary test is a diagnostic tool, not a substitute for a derivation. Some equations have a restricted domain. A surprising result outside that domain may show that the model is being misused rather than that the equation is wrong.

## Check a convincing explanation about something familiar

Imagine an answer says that the Moon looks like a crescent because Earth's shadow covers most of it. It contains no difficult arithmetic, and the word shadow sounds plausible. Start by separating two phenomena: ordinary lunar phases and a lunar eclipse. A source about eclipses alone would not establish an explanation of the monthly phase cycle.

NASA's [Moon phases guide](https://science.nasa.gov/moon/moon-phases/) explains the changing view of the Moon's sunlit portion as it orbits Earth. Use the positions and viewpoint in its illustration to inspect the claim. For ordinary phases, the changing visible fraction of the illuminated Moon is the relevant explanation; Earth's shadow is involved in lunar eclipses.

Write a short correction that names the confusion rather than simply marking the response wrong. Then open the [Moon Phases 3D Simulator](/en/simulations/moon-phases-3d) and connect the orbital position with the appearance from Earth. Treat the simulation as a representation of the geometry, while the source provides the reference explanation. This checks a causal story rather than only a number.

Do the same when a response contains a realistic everyday example. A familiar object does not make the reasoning reliable. Ask which observation the explanation accounts for, which competing explanation it rules out, and what conditions it assumes. Those questions work for a paragraph in a blog, a video caption, or a classroom handout as well as an AI answer.

## What to do when a link is real but the conclusion is too strong

A source may support a narrow statement while the response turns it into a universal rule. For example, a page discussing a particular simulation activity does not establish that every student learns every science topic better with simulations. Identify who was studied, what was compared, and which outcome was measured before repeating a research claim.

If you cannot access the full evidence, record the limit instead of filling the gap with confidence. You might write: this source describes the classroom activity, but I have not verified the claimed improvement in test scores. That is more useful than either accepting the number or rejecting the entire topic without checking.

When sharing a correction with a classmate, include the original claim, one direct source, and your own explanation of the difference. Avoid a long list of links with no indication of what each supports. The [digital science notebook guide](/en/articles/how-to-create-a-digital-science-notebook) shows how to keep this verification trail alongside your working notes.

## Keep a short verification record

- Claim: write the specific statement you checked, including conditions.
- Source: record the relevant section and what it supports.
- Independent check: show your calculation, diagram, or controlled comparison.
- Outcome: label the claim supported, corrected, incomplete, or unresolved.
- Remaining question: state what evidence or explanation is still needed.

This record helps a teacher see the issue quickly. It also stops a later conversation from replacing a checked answer with a new unverified version. For graded work, follow your class rules about documenting assistance and use your own explanation.

## What if two AI answers disagree?

Ask each for assumptions and a checkable argument, then resolve the disagreement with sources and independent work. Do not vote between chatbots or keep prompting until one agrees with you. If the evidence remains unclear, bring the original problem and your verification record to a teacher. Apply the same process when [creating practice questions with AI](/en/articles/use-ai-to-create-science-practice-questions): the answer key needs checking just as much as the question.
`;
