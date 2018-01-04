const say = require('say')

// Use default system voice and speed
say.speak('Hello!')

// Stop the text currently being spoken
say.stop()

// More complex example (with an OS X voice) and slow speed
// say.speak("What's up, dog?", 'Alex')
say.speak("What's up, dog?", 'Fiona')
