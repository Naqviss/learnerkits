export const interactiveLearning = `
Interactive learning simulations are digital models that let learners change conditions and observe the consequences. Instead of only reading that a larger force changes an object's motion, you can adjust a force, keep the mass fixed, and compare the resulting acceleration. The important feature is the connection between your decision and a response governed by a model.

A simulation can resemble a laboratory, a diagram, a game, or a simple graph. Its educational value depends on the questions you investigate and the explanations you build, rather than how realistic the graphics appear. This guide explains how simulations work as learning tools, how to recognize their limits, and how students and teachers can use one purposeful investigation to move beyond clicking controls.

## What makes a learning simulation interactive?

Three ingredients are usually present: a representation of a system, controls that change its conditions, and feedback showing what follows. In a motion model, the system might be a cart. Its controls might include mass and applied force. Its feedback might include an animation, acceleration readout, or graph. These parts should refer to the same underlying situation.

Interactivity means the learner can influence the modeled outcome. A video of a cart moving is an explanation you watch. A simulation lets you ask what would happen with a different mass and test that comparison. Some animations include a pause button but no scientific choices; pausing alone does not create an investigation of variables.

The word simulation also describes tools outside education, including engineering forecasts and training environments. Educational versions deliberately simplify a system to make selected relationships easier to investigate. A beginner's model might remove air resistance or restrict motion to one dimension. That simplification should be stated because it affects what conclusions the learner can reasonably draw.

## How inputs become observable results

Behind the interface, a simulation uses rules. These might be equations, logical relationships, or numerical procedures that update the system over time. When you change a control, the program applies those rules and redraws the display. Some models calculate an answer immediately; others advance through many small time steps.

Consider a fixed-mass cart with a constant net force. The relationship a = F / m connects acceleration, net force, and mass. The animation is a visible interpretation of that relationship. A faster-looking cart does not by itself tell you the acceleration, because its speed also depends on how long the force has acted and its starting speed.

This is why readouts and units matter. A force arrow, a number measured in newtons, and an acceleration measured in metres per second squared express different aspects of the system. Before using a simulation, identify which quantities you control, which quantities it calculates, and which visual details are only illustrative.

## A first investigation: force and acceleration

Open the [Newton's Laws Force Lab](/en/simulations/newtons-laws-force-lab). Begin with a question narrow enough to answer: how does doubling the net force affect acceleration when mass stays constant? Write your prediction before changing the controls. A useful prediction gives both a direction and a reason, rather than saying only that something will happen.

Use a mass of 5 kg, an applied force of 10 N, and an opposing resistance of 0 N. The illustrative calculation is 10 / 5 = 2 m/s². Then increase the applied force to 20 N without changing the other settings. The model predicts 4 m/s². Record the displayed values and compare them with these calculations.

For the scientific relationship behind the example, consult [OpenStax's explanation of Newton's second law](https://openstax.org/books/college-physics-2e/pages/4-3-newtons-second-law-of-motion-concept-of-a-system). The relevant force is the net force acting on the chosen system. If you add an opposing force, subtract it when calculating the net force for this one-dimensional comparison.

Finish by writing a conditional conclusion: at fixed mass in this model, doubling the net force doubles acceleration. Avoid the broader claim that doubling any force always doubles an object's speed. That claim leaves out other forces, elapsed time, and initial conditions. A precise conclusion shows that you understood more than the direction of the animation.

## Why a game-like activity still needs a science question

Imagine trying to land a virtual ball on a target. After several launches, you find a setting that works, but you cannot explain why. The activity was interactive, and you achieved the game's goal, yet the scientific relationship may still be unclear. A useful next question is how launch angle changes range when launch speed and gravity stay fixed.

Use the [Projectile Lab](/en/simulations/projectile-lab) to turn trial and error into a comparison. Choose one permitted speed and gravity, then predict whether a 30-degree launch or a 60-degree launch travels farther in the lab's model. Record the landing range for both and explain what stayed constant. Read the model notes: this activity uses level launch and landing heights and omits air drag.

In that ideal setup, the two complementary angles have the same range, although their flight times and maximum heights differ. That is a more interesting outcome than simply finding one successful shot. It lets you ask why different-looking paths can end at the same horizontal distance. A real basketball shot may start and end at different heights and experience drag, so its practical advice cannot be copied directly from this comparison.

The distinction applies to any simulation mission. After reaching a target, identify the variable you changed deliberately and predict what a nearby setting would do. If you cannot, return to a smaller comparison. Success in the interface becomes useful learning evidence when you can explain the choices that produced it.

## A useful question for a parent or study partner to ask

You do not need to know the full topic to help someone explain an investigation. Ask what they expected, what they changed, and what surprised them. Then ask whether the result would still hold if a different condition changed. These questions encourage the learner to name the relationship instead of narrating a sequence of clicks.

For instance, after the projectile comparison, ask whether matching landing points means the two balls reach their highest points at the same time. The learner can examine the outputs or sketch the trajectories before answering. Let them locate the evidence rather than supplying a result immediately.

When choosing follow-up activities, [PhET's science activity design workshop](https://phet.colorado.edu/en/teaching-resources/virtual-workshop/science-activity-design) offers examples of designing questions around simulations. Use such resources to improve your investigation, while checking the assumptions of the particular model you actually use. A question designed for one tool may require different controls or outputs in another.

## The difference between exploration and an experiment

Free exploration is useful when you are learning what the controls do. Move a slider, restart the model, and inspect the available readings. During this orientation stage, changing several settings can help you understand the interface. It becomes a problem only when you later use that uncontrolled exploration as evidence for a specific cause.

For a focused investigation, select an independent variable, a dependent variable, and conditions to hold constant. In the force example, you changed net force and observed acceleration while controlling mass. Record a baseline and at least one deliberate comparison. If your question concerns a pattern, add more values across the permitted range.

Simulated results are outputs of an implemented model. They can help you discover or check its consequences, but they are not independent physical measurements confirming nature's behavior. Keep that distinction in your notes. If you eventually compare the model with real measurements, the differences become another scientific question to investigate.

## Where simulations are especially useful

Some scientific processes are hard to observe directly. Gas particles are too small to watch individually in a classroom, orbital motion unfolds across large distances, and electrical quantities require interpretation through instruments. A simulation can represent selected features at a convenient scale and put several related views beside each other.

The [Gas Law Lab](/en/simulations/gas-law-lab), for example, allows you to compare chamber volume, temperature, gas amount, and pressure within an ideal-gas model. The dots are an illustration of particles; counting them does not measure the actual number of molecules. The numerical readings and stated equation define the quantitative investigation.

Other activities benefit from immediate reset. You can return to a baseline, change one variable, and try again without rebuilding equipment. That can make comparisons convenient. It does not automatically produce understanding: a learner still needs to decide what to compare, explain the result, and recognize when the model leaves out an important effect.

## Simulations, games, virtual labs, and explanations

A science game may include a simulation, but points and levels are an additional design layer. Reaching a target demonstrates that a particular goal condition was met. It does not necessarily demonstrate that the player can explain the underlying science. After a successful mission, ask which settings mattered and whether another combination would also work.

A virtual lab usually organizes simulation or other digital resources around an investigation. It may include a question, equipment-like controls, observations, and a report. The boundary is flexible: a small interactive diagram can become part of a virtual lab when paired with a thoughtful investigation. See [how virtual science labs work](/en/articles/how-virtual-science-labs-work) for a complete example.

An explanation provides language for interpreting relationships. A simulation provides a model to investigate. Students may need both, along with feedback from a teacher or a trusted reference. The comparison in [AI tutors versus interactive simulations](/en/articles/ai-tutors-vs-interactive-simulations) examines one way conversational explanations and modeled experiments can serve different purposes.

## How teachers can build a short lesson around one

Start with a learning objective that can be assessed without the simulation. For example: students will explain why increasing mass reduces acceleration when net force stays fixed. Choose an activity that makes that relationship visible, and check every setting you plan to use before class.

One possible sequence is a private prediction, a paired investigation, and an individual explanation. Let partners compare reasons before using the controls. Give one learner responsibility for recording conditions and the other responsibility for operating the model, then switch roles. Ask both to explain a result independently at the end.

[PhET's research overview](https://phet.colorado.edu/en/research) describes work on simulation design and classroom use. Research about a particular platform should not be treated as proof that every interactive tool improves learning. For your own lesson, look at students' explanations and later performance, alongside how smoothly the activity ran.

With limited devices, project the model and collect predictions from the whole class before each change. With uneven prior knowledge, provide a starting example and a vocabulary list while keeping the same central question. Students should have a way to participate in the reasoning even when they cannot independently operate every control.

## How to judge whether a simulation fits your needs

Check the scientific scope first. Can you find an explanation of what the model includes and omits? Are the variables labeled with units? Does the behavior agree with a simple case you can calculate? A beautiful interface cannot compensate for an unclear or incorrect relationship.

Then check usability with the devices and learners who will actually use it. Try keyboard navigation, zoom, small-screen layouts, and any available text alternatives. A graph distinguished only by color may be difficult to interpret. A task requiring precise dragging may need a different way to enter values or a partner-supported arrangement.

Finally, check the learning task. A useful activity has a question and a product: a table, an annotated diagram, a calculation, or an explanation. If the only instruction is to explore until time runs out, decide what evidence would show that the session helped. The tool and the task need to fit each other.

## Mistakes that make an activity less useful

One common mistake is changing every control and then attributing the result to whichever change you remember. Another is copying a numerical output without its units or input settings. Both make it difficult to reconstruct the investigation. Record conditions at the moment you collect each result.

Students can also confuse visual scale with physical scale. An enlarged force arrow or particle is often a teaching convention. Ask what its size, color, and position mean before drawing a quantitative conclusion. If the interface does not define a visual encoding, treat it cautiously rather than inventing an interpretation.

Finally, avoid using repetition as a substitute for a new question. Repeating an identical deterministic run may produce the same answer every time. A better next step might be predicting an unfamiliar setting, explaining an apparent contradiction, or considering an omitted effect. Your investigation should gradually demand more reasoning, not merely more clicks.

## A practical way to begin today

Choose one simulation from the [science simulation library](/en/simulations), one relationship you want to understand, and one comparison you can explain in a few sentences. Write the question, prediction, settings, result, and limitation on a single page. Save enough information that someone else could repeat your comparison.

Then close the simulation and predict a new case. If you can justify the prediction using the relationship rather than remembering the animation, you have a useful indication of understanding. If you cannot, return to the confusing step, change the investigation, or consult a reference. For a repeatable routine, continue with [using educational simulations for self-study](/en/articles/educational-simulations-for-self-study).
`;
