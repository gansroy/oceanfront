/*
defineStateTree
 - correlates to defineComponent
 - return a new class constructor for loading a value, a subclass of StateTree
 - typed, and potentially with validation and hooks
 - may have default values
 - properties can be nested
 - additionalProperties flag? or covered by schema?
*/

// can alternatively create a new class deriving from our superclass (StateTree)

/*
example 1:
 - create a state object
 - replace the state (calls commit, which returns a promise. assign to property of locker)
 - show that vue sees the state update (track works)
 - show that no state update happens on the initial assignment
 - prevent assignment of additional properties on the state
 (eventually) allow commit to be cancelled, so that when the promise returns nothing happens
   - cancel resolve hook and raise exception inside promise
*/

/*
example 10:
 - define a Field a required when another field is set to a specific value
 - change the label of a Field depending on another field value
*/
