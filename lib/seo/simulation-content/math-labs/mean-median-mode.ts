import type { SimulationContent } from "../types";

export const card = {
  slug: "mean-median-mode", title: "Mean, Median & Mode Explorer", concepts: "Mean · median · mode · range · outliers",
  difficulty: "Beginner", duration: "6–10 min", kind: "Statistics lab", outcome: "Drag data points to see how the mean, median and mode respond to an outlier.",
  seoTarget: "mean median mode", visualMode: "graph",
} as const;

export const es = { title: "Explorador de media, mediana y moda", outcome: "Arrastra datos para ver cómo responden la media, la mediana y la moda a un valor atípico.", concepts: "Media · mediana · moda · rango · valores atípicos", kind: "Laboratorio de estadística" };

export const description = "Drag dots on a 0–20 number line to see how the mean, median and mode respond. Watch one outlier pull the mean while the median holds its place.";

export const content: SimulationContent = {
  question: "What is the difference between the mean, median and mode?",
  answer: "The mean, median and mode are three ways to describe the center of a data set. The mean adds every value and divides by how many there are. The median is the middle value once the data are sorted. The mode is the value that appears most often. For the quiz scores 6, 7, 7, 8, 9, 10, 10, 10, 12, 13 and 15, the mean is about 9.73, the median is 10 and the mode is 10.",
  science: [
    "The mean can be pictured as a balance point. Place each value on a number line as an equal weight, and the line balances at the mean, because the distances of the values below it always add up to the same total as the distances above it. For the data 2, 4 and 9 the mean is 5, and the gaps of 3 and 1 on the left equal the gap of 4 on the right.",
    "Because every value counts in the mean, one extreme value can drag it a long way. Changing the largest value in 5, 6, 7, 7, 8, 9, 10, 11 to 20 raises the mean from 7.875 to 9 but leaves the median at 7.5. That is why house prices and incomes are usually reported as medians.",
    "The mode is the only one of the three that also works for categories, such as the most popular shoe size. A data set can have one mode, two modes, several, or none when every value appears exactly once. With an even number of values, the median is the average of the two middle values.",
  ],
  formula: { expression: "mean = (x₁ + x₂ + … + xₙ) ÷ n", meaning: "x₁ to xₙ are the data values and n is how many there are. The median sits in position (n + 1) ÷ 2 of the sorted list, or halfway between the two middle values when n is even." },
  steps: [
    "Keep Data set on Quiz scores. Read Mean 9.73, Median 10 and Mode 10, and find the white-ringed dot that marks the middle value.",
    "With Distances to the mean set to Show, compare the pink and green totals under the line. Drag any dot and check that the two totals stay equal.",
    "Drag the dot at 15 out to 20. Predict which readout changes more, then compare how far the amber mean line and the dashed median line move.",
    "Press + Add a value (at 10) or − Remove a value and watch the median switch between one middle dot and the average of two.",
    "Choose With an outlier and read the sorted list, the range and the mean − median gap in the panel below the plot.",
  ],
  misconception: { myth: "The mean is always the best average to use.", fact: "The mean is pulled toward extreme values, so for skewed data the median usually describes a typical value better. In 5, 6, 7, 7, 8, 9, 10, 20 the median of 7.5 is closer to most values than the mean of 9." },
  modelNote: "Values are whole numbers from 0 to 20, with 3 to 15 values in a set, each drawn as one dot. Grouped data, weighted means and quartiles are not covered, although the range is shown below the plot.",
  faq: [
    { q: "How do you find the median of an even number of values?", a: "Sort the values, take the two in the middle and average them. For 1, 3, 7 and 9 the middle pair is 3 and 7, so the median is (3 + 7) ÷ 2 = 5. The median can therefore be a number that does not appear in the data at all." },
    { q: "Can a data set have more than one mode?", a: "Yes. If two values tie for the highest count, the data are bimodal; for example, 2, 2, 5, 5 and 9 has modes of 2 and 5. If every value appears exactly once, there is no mode, because no value is more common than any other." },
    { q: "When should you use the median instead of the mean?", a: "Use the median when the data are skewed or contain outliers, such as salaries, house prices or reaction times. A few very large values lift the mean well above what most people experience, while the median still marks the point with half the data below it and half above." },
    { q: "What does the range tell you about a data set?", a: "The range is the largest value minus the smallest, so it measures how spread out the data are. Quiz scores running from 6 to 15 have a range of 9. Two classes can share the same mean but have very different ranges, which is why spread is reported alongside an average." },
  ],
};
