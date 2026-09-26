export const virtualLabs = `
A virtual science lab is a digital environment for investigating scientific questions. You may adjust modeled equipment, choose conditions, observe an animation, read measurements, and record results. In a simulation-based lab, those results come from a computer model. The learning happens when you connect your choices, the output, and a scientific explanation.

Virtual labs vary considerably. Some resemble a real laboratory bench, while others use a few sliders and graphs. Some focus on procedures; others focus on relationships between variables. Understanding what kind of lab you are using helps you decide what its results mean and what the activity can teach you. This guide follows a gas-pressure investigation from the first question to a finished explanation.

## What is inside a virtual science lab?

You can think of a simulation-based lab as four connected parts. The interface gives you controls and instructions. The model defines how the system behaves. The display turns model outputs into readings, graphs, or motion. The learning activity asks you to use those outputs to answer a question.

These parts can be easy to confuse. A pressure gauge drawn on a screen is an interface element. The number shown by that gauge may be calculated directly from an equation. It is not necessarily a measurement with sensor noise, a calibration error, or a delay. Those features exist only if the program deliberately includes them.

A score or completion message is another separate layer. It usually checks whether you reached a target or completed a sequence. It can guide an activity, but it does not establish that your reasoning is correct. You should be able to explain the result after hiding the score and closing the instructions.

## Simulated labs and remote labs are different

A simulated lab calculates behavior using a model. A remote lab allows you to control or observe actual equipment through a network connection. Both can appear in a browser, but their evidence comes from different places. A recorded experiment is a third possibility: you may inspect real observations without controlling the experiment yourself.

Look for a description of the data source before beginning. Does the activity say calculated, simulated, recorded, or live? If you are unsure, describe the data conservatively in your report. Writing that you measured a physical gas pressure would be misleading if you actually read a value calculated by an ideal-gas model.

This difference does not make one activity automatically better. A model can be excellent for exploring a relationship with conditions held fixed. Real equipment provides opportunities to study instruments, uncertainty, and unexpected behavior. The right choice depends on your question and the skills the activity is designed to develop.

## Begin with a question you can investigate

Open the [Gas Law Lab](/en/simulations/gas-law-lab). A useful starting question is: how does pressure change when volume decreases while gas amount and temperature remain constant? This identifies a relationship and tells you what must stay fixed. A question such as what happens to gas is too broad to guide a careful comparison.

Before touching the controls, write a prediction. You might expect pressure to rise as the same amount of gas occupies a smaller volume at the same temperature. Add a quantitative prediction if you know the relationship: halving the volume should double the pressure in this model under those controlled conditions.

Next identify the available variables. This lab uses volume in litres, temperature in kelvin, gas amount in moles, and pressure in kilopascals. Record these units in your notebook immediately. A column labeled temperature without a unit makes later calculations harder to check, especially when different resources use different temperature scales.

## A worked pressure investigation

Set the gas amount to 1 mol and temperature to 300 K. Begin at a volume of 30 L, then compare 20 L and 10 L while leaving amount and temperature unchanged. Record the displayed pressure for each setting. Use a small table in your notebook with columns for run label, volume, temperature, amount, and pressure.

For comparison, the model uses P = nRT / V with R = 8.314 kPa·L·mol⁻¹·K⁻¹. The calculated pressures are approximately 83.14 kPa at 30 L, 124.71 kPa at 20 L, and 249.42 kPa at 10 L. These are worked model predictions, not data collected from a physical experiment. Your display may round them to fewer decimal places.

Compare the 20 L and 10 L cases first. The volume halves and the pressure doubles. Now compare 30 L and 20 L. The volume becomes two thirds as large, so pressure becomes one and a half times as large. This second comparison checks whether you understand the relationship beyond one memorable example.

For a reference on the equation and its assumptions, read [OpenStax's ideal gas law section](https://openstax.org/books/college-physics-2e/pages/13-3-the-ideal-gas-law). Use absolute temperature in kelvin for this relationship. Substituting a Celsius temperature directly into the equation changes the meaning of the calculation and can produce an incorrect result.

## Why a simulation updates immediately

Some virtual labs calculate equilibrium relationships directly. When you change volume, the program can calculate the new pressure from the current values and update the readout immediately. That does not mean a physical sample would reach a new equilibrium without any elapsed time or heat transfer.

Other labs update a changing state repeatedly. A pendulum animation, for example, needs a position at successive times. A numerical model may approximate motion through small steps, while another implementation may evaluate a formula for the position. Different methods have different limits, particularly for fast changes or extreme parameter values.

You do not need to inspect source code to learn from a lab, but you do need its model description. Ask whether the activity represents a steady state, a changing process, or an illustrative sequence. If a transition is instant on screen, avoid writing that the physical transition must also be instant.

## Reading the visual display correctly

In the gas lab, moving dots help represent particle motion and chamber occupancy. They are not a literal view of every molecule in one mole of gas. Their count, size, and speed may be adjusted for readability. Use the stated numerical model for quantitative conclusions, and treat the scene as a supporting explanation.

Graphs require similar care. Read both axis labels, the units, and the scale. An upward trend may look nearly straight over a short range even when the underlying relationship is curved. If you plot pressure against volume using the worked values, do not connect them and conclude that pressure decreases by the same amount for every equal volume increase.

Try plotting pressure against the reciprocal of volume instead, if that idea fits your course. At fixed amount and temperature, the ideal-gas equation predicts a straight-line relationship between those quantities. This is an optional extension you can do in a notebook or spreadsheet; it does not require the lab to provide a built-in graph.

## Controls, resets, and fair comparisons

Changing one variable at a time is a useful starting method because it makes a comparison easier to interpret. If you change temperature and volume together, pressure may rise, fall, or remain unchanged depending on the combination. That can become a worthwhile later investigation, but it answers a different question.

Reset carefully. A reset button may restore defaults, restart time, or clear a mission result. Do not assume it returns every control to your intended baseline. Read the values again before recording a run, and write down any changes you made between trials.

Repeated identical outputs are normal in a deterministic model with identical starting conditions. They do not demonstrate that real measurements have zero uncertainty. If your assignment asks for repeated trials, explain whether repetitions explore a random model, check reproducibility, or merely repeat the same calculation. Do not invent scatter to make simulated results look more experimental.

## Turning observations into an explanation

A useful lab conclusion has three parts: the relationship you found, specific results that support it, and a reason grounded in the model. For the worked investigation, identify the fixed temperature and amount, cite the 20 L and 10 L pressure comparison, and connect it to inverse proportionality.

Then state a limit. The activity uses an ideal-gas approximation and does not establish how every real gas behaves under every condition. The immediate update also does not model the complete process of compressing a real container. These limits help define the conclusion; they are not admissions that the activity was pointless.

Keep observations separate from explanations. A readout of approximately 249.4 kPa is an observed simulation output. Saying that pressure rose because volume decreased at fixed amount and temperature is an interpretation. Keeping both makes your report easier to check and helps you revise the explanation without losing the original record.

## What to do when a result looks wrong

Start with the inputs. Check whether you changed moles accidentally, read litres as millilitres, or confused temperature scales. Then recalculate one simple case independently. Compare the number of decimal places before treating a small difference as a scientific disagreement.

Next inspect the model notes and operating range. A tool may deliberately omit a phenomenon you expected to see. For example, an ideal-gas equation alone will not show a realistic condensation process. Missing behavior may reflect the scope of the model rather than a malfunction.

If the disagreement remains, save the settings, your calculation, and a screenshot if useful. Describe the exact problem to a teacher or through the site's correction channel. Avoid repeatedly changing controls until the number happens to resemble your expectation. A reproducible mismatch is useful evidence; a selected matching result can hide the original issue.

## Build a record you can revisit

Save the lab title and link, the date, your question, settings, outputs, and conclusion. Add the source you used to check the equation. A screenshot can support this record, but text and a small data table usually make it easier to search and compare later.

Use [the digital science notebook guide](/en/articles/how-to-create-a-digital-science-notebook) to organize that record. For your next lab, try the [Pendulum Physics Lab](/en/simulations/pendulum-physics) and compare length with period. You will use the same investigation structure while working with a different scientific relationship.

Before moving on, close the lab and answer a new question: at the same volume and gas amount, what would doubling the absolute temperature do to the ideal-gas pressure? Explain your prediction, then reopen the model to check it. That final step helps reveal whether you learned a relationship you can use beyond the particular settings in your first investigation.
`;
