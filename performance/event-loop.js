// NODE EVENT LOOP PSEUDO CODE INTERPRETATION

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// new timer, task, and operation are recorded from myFile running
myFile.runContents();

function shouldContinue() {
  // check any pending setTimeout, setInterval, setImmediate
  // check any pending os tasks, like server listening to port
  // check any pending long running operations, like FS module
  return pendingTimers.length || pendingOSTasks.length || pendingOperations.length;
}

// Entire body executes in one 'tick'
while(shouldContinue()) {
  // 1. Node looks at pendingTimers and sees if any functions
  // are ready to be called

  // 2. Node looks at pendingOsTasks and pendingOperations
  // and calls relevant callback

  // 3. Pause execution. Continue when...
  // - a new pendingOSTask is done
  // - a new pendingOperation is done
  // - a timer is about to complete

  // 4. Look at pendingTimers. call any setImmediate

  // 5. handle any 'close' events
}

// exit
