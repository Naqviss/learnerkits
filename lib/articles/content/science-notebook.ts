export const scienceNotebook = `
A digital science notebook is a searchable record of your questions, predictions, observations, calculations, and changing explanations. It can be a document, a folder of plain-text files, a spreadsheet with notes, or a school-approved notebook application. The tool matters less than whether you can reconstruct what you did and understand why you reached a conclusion.

The most useful notebook is not a polished collection of copied definitions. It preserves enough of your thinking to help you learn from mistakes and continue an investigation later. This guide shows how to choose a simple format, create a reusable entry, record simulation results honestly, and review your work. A worked pendulum entry demonstrates the structure without pretending that example values are your own measurements.

## Choose a format you can maintain

Start with the tools you already have access to. A document is convenient for paragraphs and diagrams. A spreadsheet is useful when calculations and tables are central. Plain-text or Markdown files can be easy to search and move between tools. A dedicated notebook application may combine these features, but extra features are helpful only if you use them.

Check a few practical requirements before committing. Can you export your work? Can you search the text? Can you add a table without turning it into an unreadable image? Can you reopen the file on your usual device? If your class requires a particular format, use that requirement as the starting point.

Try one complete entry before reorganizing a whole course. You may discover that your preferred app makes equations awkward or that a complicated folder system slows you down. A simple structure you update regularly is more useful than an elaborate template you abandon after a week.

## Organize by subject and investigation

Create a main folder for the course, then a small number of topic folders. Within each topic, give every investigation a date and a descriptive title. For example, 2026-09-26-pendulum-length-period is easier to identify than notes-final-new. Use a naming convention that makes sense when the file is viewed outside the app.

Keep a short index page with links to major investigations and a list of unresolved questions. If you use tags, keep them few and meaningful: motion, gases, measurement, or needs-review. Avoid spending more time labeling entries than explaining the science inside them.

Store supporting files near the entry they belong to. A screenshot name can include the investigation and run label, such as pendulum-run-b. Include a caption in the notebook so that the image retains its meaning even if the file is opened separately. If you move files, check that the links still work.

## A reusable science notebook template

Give each entry the same basic headings so you do not need to invent a structure every time. You can copy the following field list into a document and expand each item as needed. Short activities may need only a few sentences; longer investigations may need several tables and a fuller explanation.

- Title and date: name the investigation and when you worked on it.
- Question: state the relationship or problem you are investigating.
- Prediction and reason: record what you expect before seeing the result.
- Model or method: identify the simulation, equipment, equation, and relevant assumptions.
- Variables and settings: name what changes, what you observe, and what stays fixed.
- Results: preserve outputs or measurements with units and run labels.
- Analysis: show calculations, graphs, comparisons, and any corrections.
- Conclusion and limits: answer the question and state what the evidence does not establish.
- Sources and next question: link references and identify a useful follow-up.

Keep prediction and conclusion in separate fields. If you replace an incorrect prediction with the final explanation, you lose evidence of how your thinking changed. Similarly, keep the original output separate from calculations made later. This makes the notebook easier to audit when a result seems inconsistent.

## Worked entry: pendulum length and period

Here is an illustrative entry you can use as a model. The question is: how does increasing pendulum length from 0.25 m to 1.00 m affect the period at fixed gravity? The prediction is that the period doubles because, in the small-angle model, period is proportional to the square root of length.

The method uses the [Pendulum Physics Lab](/en/simulations/pendulum-physics). Set gravity to 9.81 m/s² and release angle to 5 degrees. Record that the model is undamped and uses the small-angle relationship. The independent variable is length in metres; the dependent variable is period in seconds.

For run A, record length 0.25 m and a calculated reference period of approximately 1.00 s. For run B, record length 1.00 m and a calculated reference period of approximately 2.01 s. These numbers are worked predictions from T = 2π√(L/g), not a claim that you performed a physical experiment. Add your own displayed readings when you run the activity.

The analysis compares ratios: length increases by a factor of four, while period increases by a factor of two. The conclusion is conditional on fixed gravity and the model assumptions. A useful next question is how period changes if gravity changes while length stays fixed. Link [OpenStax's simple pendulum section](https://openstax.org/books/college-physics-2e/pages/16-4-the-simple-pendulum) as the equation reference.

## Build tables that preserve meaning

Use one row per run and one column per quantity. Include units in column headings, such as length (m) and period (s). Add columns for controlled settings when those settings are necessary to reconstruct the investigation. Do not rely on remembering that every run used the default values.

Separate predicted and observed values into different columns. For a simulation, observed means read from the simulation display; label that column accordingly. For a physical experiment, include the measured quantity and any repeated measurements your method requires. Never mix calculated examples with your own collected values without identifying which is which.

If you correct a transcription error, preserve a brief note explaining the change. For example, record that a volume was copied as 2 L but the screenshot showed 20 L. You do not need formal version control for every school activity, but a clear correction record prevents later confusion about why a conclusion changed.

## Show calculations so you can check them

Write the relationship first, then substitute values with units, then state the result. For a period calculation, identify length and gravitational acceleration before entering numbers. In a spreadsheet, keep input cells separate from result cells and label both. This reduces the chance of replacing a formula accidentally with a single answer.

Keep enough digits during intermediate calculations and round the final result appropriately for the task. A simulation may display many decimal places even though the model simplifies reality. Numerical detail should not be confused with experimental accuracy. For measurement terminology, consult [OpenStax on accuracy, precision, and significant figures](https://openstax.org/books/college-physics-ap-courses-2e/pages/1-3-accuracy-precision-and-significant-figures).

Check at least one calculation independently when using a spreadsheet. A formula copied down a column can reproduce the same mistake many times. Compare a simple row with a hand calculation, and check whether cell references change as intended. Add a sentence interpreting the answer; a correct number without context is difficult to learn from later.

## Use screenshots and diagrams as evidence

A screenshot can preserve settings or a graph, but it should supplement readable notes. Write a caption stating what the image shows and why it matters. Include the run label, relevant settings, and any output you will discuss. This helps when small text becomes difficult to read on another device.

Crop only to improve focus, and do not remove settings needed to interpret the result. If you annotate an image, distinguish your arrows and comments from the original display. A diagram you draw yourself should identify its conventions, such as whether arrow length represents force magnitude or merely indicates direction.

For important information, provide a text equivalent. A caption that says screenshot from lab is not enough if the image contains the only record of the numbers. A small table and a sentence about the trend make the notebook more searchable, more accessible, and easier to review without reopening every image.

## Rescue a notebook entry that is only a screenshot

Imagine opening last week's notes and finding a screenshot with a pressure of 249.4 kPa but no explanation. You cannot remember whether you reduced volume, raised temperature, or changed the gas amount. Start by inspecting the visible controls. If a setting is cropped out or unreadable, mark it as unknown rather than reconstructing a convenient value from memory.

Create a new entry with a clear question and repeat the comparison in the [Gas Law Lab](/en/simulations/gas-law-lab). For example, fix gas amount at 1 mol and temperature at 300 K, then compare 20 L and 10 L. The expected pressures are about 124.7 kPa and 249.4 kPa. Label these as calculated reference values until you have recorded the actual displayed outputs for your own runs.

:::figure notebook-entry

Keep the old screenshot and write why it was insufficient. Your new record should state which variable changed, what stayed fixed, and whether the numbers were model outputs or physical measurements. That short repair is more useful than making the original screenshot look tidier. It gives your future self enough information to interpret the result.

The same rule applies when a value looks suspicious. Preserve the original entry, add the corrected value with a reason, and check whether the conclusion changes. An unexplained edit can make your notebook harder to trust even when the final number happens to be correct.

## A weekly notebook review that takes a few minutes

Choose one recent investigation and ask whether another student could repeat it from your notes. Look for missing units, unnamed controls, uncaptioned images, and conclusions that mention a pattern without citing the results. Repair the first important gap you find instead of redesigning the entire notebook.

Then hide the conclusion and answer the original question again. Write one transfer question that changes a condition, such as doubling temperature while holding volume fixed. Save that question for your next review. Your notebook then becomes a source of practice rather than only an archive of completed work.

For ideas about choosing and combining review activities, see the Learning Scientists' [discussion of when learning strategies work best](https://www.learningscientists.org/blog/2017/4/20-1). You do not need to adopt every suggested strategy at once. Begin with a question you can answer from memory and a record that lets you check the reasoning afterward.

If several people share the same device, keep file names and ownership clear. Export your own entry when appropriate, and check that its tables and diagrams remain readable. A shared screen should not leave you dependent on someone else's account to revisit your learning record.

## Record sources and assistance honestly

Save the title and direct link of the simulation or reference page you used, along with the date you accessed it when useful. Link the relevant section rather than only the website homepage. If a teacher supplied a worksheet or data set, identify it as supplied material and follow the class rules for attribution.

Distinguish your explanation from copied text. Prefer a short paraphrase in your own words with a source link. If you quote a definition, mark it clearly as a quotation. The purpose of the notebook is to preserve understanding and evidence, so a long passage you cannot explain adds little value.

If you use an AI tool for brainstorming or clarification, record how you used it and check scientific claims against reliable material. Do not treat a generated response as measured data. The guide to [checking AI-generated science answers](/en/articles/check-ai-generated-science-answers) provides a verification routine you can include in your notes.

## Turn the notebook into a study tool

At the end of an entry, write two or three questions you could answer later without looking. Include one explanation question and one new prediction. For the pendulum investigation, ask why quadrupling length doubles period and what happens when length becomes one quarter as large.

During review, hide the answer and attempt the question first. Then compare your reasoning with the entry and correct any gap. The [Institute of Education Sciences practice guide](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) includes recommendations on spacing study and using quizzes. Your notebook can support those practices by keeping questions separate from their explanations.

Mark entries that still need attention and note the specific obstacle. Needs work on units is more useful than bad at physics. When you revisit the topic, start from that obstacle instead of rereading everything. [The simulation self-study guide](/en/articles/educational-simulations-for-self-study) shows how to connect this review with a new controlled investigation.

## Keep your work portable and appropriately shared

Save a backup outside the single device or account you normally use, following school requirements. Export an occasional readable copy and open it to verify that tables, equations, and links survived. An export button is useful only if the resulting file preserves the information you need.

Check sharing settings before sending a notebook link. Use the access level required for the assignment, and avoid including classmates' personal details or unrelated information. A collaborative notebook should identify who contributed which observations so the group can resolve questions about the record.

Review the structure after a few investigations. Remove unused fields, improve unclear headings, and keep the parts that help you reconstruct and explain your work. A strong digital science notebook grows through use: it should make your next question easier to ask, your evidence easier to inspect, and your understanding easier to test.
`;
