export const teachers = `
Teachers can use AI to draft explanations, organize lesson sequences, suggest misconceptions, and propose assessment questions. Start with a specific learning objective and accurate source material, then check every scientific claim and classroom instruction. The teacher’s decisions about evidence, accessibility, and student understanding determine whether the resulting lesson is useful.

The most productive starting point is a task you can evaluate. Asking for “an engaging science lesson” often produces a busy sequence with unclear learning goals. Asking for a lesson in which students distinguish applied force from net force gives you a concrete standard for deciding which suggestions to keep.

## Define what students should be able to explain

Write an objective that names observable reasoning. For an introductory forces lesson: “Students will calculate net force on a horizontal cart and explain how changing mass affects acceleration when net force is fixed.” This is more assessable than “students will understand Newton’s laws.”

List prerequisites and constraints before requesting a draft. Students need to distinguish mass from force, subtract opposing forces, and divide simple quantities. State the lesson length, device availability, reading demands, and the model’s scope. A class sharing one projected simulation needs a different activity structure from pairs with individual devices.

Use your curriculum and course text to establish the scientific content. AI can reorganize supplied material, but it should not determine what your curriculum requires. Check any claimed standard or syllabus reference against the actual document rather than assuming the generated identifier is real.

## Give AI a bounded planning brief

> Draft a 45-minute introductory science lesson about net force, mass, and acceleration. Students can subtract and divide but often confuse speed with acceleration. Use a cart that starts at rest, with applied force, opposing resistance, and mass controls. Include an individual prediction, two controlled comparisons, pair discussion, and a five-minute exit task. Label proposed answers for teacher checking. Do not invent curriculum codes or research evidence.

Review the output as a set of proposals. Remove activities that do not contribute to the objective. Check whether timings include opening the page, distributing a worksheet, and discussing results. A plan with six substantial investigations in twenty minutes may look complete while being impractical in class.

Ask for alternatives only where needed. You might request a lower-reading-load version of the instructions while preserving the same scientific reasoning. Compare versions to make sure simpler wording has not removed the controlled-variable condition or supplied the answer prematurely.

## Build a lesson around a reproducible investigation

Use [Newton’s Laws Force Lab](/en/simulations/newtons-laws-force-lab) as the shared model. Preview the page yourself, including its controls and model explanation. The following sequence is an example you can adapt; it is not a claim that every class will need the same timing.

- Minutes 0–5: show two proposed explanations of a cart’s motion and collect an individual choice with a reason.
- Minutes 5–10: identify the cart as the system, name the horizontal forces, and distinguish net force from the applied push.
- Minutes 10–22: students predict, run, and record the two controlled comparisons below.
- Minutes 22–32: pairs compare explanations, identify the fixed variables, and discuss any disagreement with the model.
- Minutes 32–40: students solve a new example and explain one limitation of the investigation.
- Minutes 40–45: collect an individual exit response and note the next teaching step.

For the first comparison, use a 10 kg cart with 5 N resistance. Compare applied forces of 15 N and 25 N. The corresponding net forces are 10 N and 20 N, giving accelerations of 1 m/s² and 2 m/s². Keep mass and resistance fixed, and ask students to predict before each run.

For the second comparison, hold applied force at 25 N and resistance at 5 N, then change mass from 10 kg to 20 kg. Acceleration falls from 2 m/s² to 1 m/s². Require students to explain why the net force stays the same. The chosen values remain above the model’s resistance threshold, avoiding ambiguity about motion onset.

## Check the science before class

Recalculate every answer and compare the explanation with [OpenStax’s treatment of Newton’s second law](https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system). Check the exact simulation settings, because a correct general equation can still produce an incorrect worksheet answer when the setup differs.

Watch for common wording errors. “Twice the force means twice the speed” is not the lesson’s relationship. Neither is “a heavier object always accelerates less,” without specifying the same net force. Ask students to use the quantities they measured, rather than descriptions such as “more motion” that blur several ideas.

State that the simulation is an educational model with simplified resistance. Students are comparing its predictions, not measuring friction in actual equipment. If you later use physical carts, introduce measurement uncertainty and the practical difficulty of controlling forces. The transition provides a useful discussion about models and evidence.

## Plan support without lowering the reasoning demand

Offer a results sheet with headings for mass, applied force, resistance, net force, and acceleration. Include units in the headings and one blank row for a student-designed comparison. For learners needing language support, provide the sentence frame: “When ___ changed and ___ stayed fixed, acceleration ___ because ___.”

Give students who finish early an inverse task: choose settings that produce 2 m/s² in two different ways. Ask them to explain which values must change together. This extends the same objective instead of adding unrelated content or merely increasing the number of calculations.

Prepare an accessible alternative to operating the simulation. Supply the numerical results in a readable table and ask the same prediction and explanation questions. Use labels alongside color, describe visual changes aloud, and check keyboard access on the classroom devices before relying on it.

## Make assessment reveal the misconception

An exit task could ask: “A 5 kg cart has a 15 N forward applied force and 5 N opposing resistance. Find its acceleration and explain what changes if its mass doubles while both forces remain fixed.” The checked answers are 2 m/s² and 1 m/s².

Score the explanation as well as the number. One student may divide correctly but omit the opposing force; another may calculate correctly while still believing acceleration means speed. Those errors call for different feedback. Ask AI to suggest feedback categories, then compare them with actual anonymized response patterns before using them.

Do not upload identifiable student work to an unapproved service. [UNESCO’s guidance on generative AI in education](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research) highlights privacy and human oversight. Use school-approved processes and keep the teacher responsible for assessment decisions.

## Review the lesson after teaching it

Record where students changed their explanations and where confusion persisted. Did they vary several controls at once? Did they use applied force in place of net force? Revise the next lesson around that evidence. An attractive AI-generated plan is only a draft until its activities make sense for your students.

For a later topic, try the [Pendulum Physics Lab](/en/simulations/pendulum-physics) to investigate length and period within its small-angle approximation. Reuse the planning structure, but rebuild the scientific questions and checks. The guide to [creating science practice questions](/en/articles/use-ai-to-create-science-practice-questions) can help you prepare follow-up work with verified answers.
`;
