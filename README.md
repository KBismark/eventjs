
> ## Event.js  
> 
> Event.js is a javascript event tool that can be used in your front-end applications. It uses the traditonal onEvent methods of HTML elements but gives you the same benefits you get from using the modern addEventListener method and even more features.
> 
> 
> - Removes the main downside of using the traditional DOM events, i.e you can add as many event listeners as you want just like using the addEventListener method 
> 
> - Easy manipulations on targeted elements.
>  
> - Chainable.
> 
> - Event.js has all the features of the addEventListener method.
> 
> - Event.js is supported in many browsers (modern browsers + old browsers).
> 
> 
> ### Methods
> - #### `targ` or `$` **EventListenerObject**.targ(elements) | **EventListenerObject**.$(elements)
> Use to set object(s) for event manipulations.
>> ```js
>> var divs = document.getElementsByTagName("div");
>> var events = new EventListener();// Returns EventListenerObject.
>> 
>> events.targ(divs) 
>> //or do this 
>> events.$(divs)
>> 
> - #### `on` .on(eventName, handler, optional-identifier)
> Use to add event listeners.
>> ```js
>>  events.targ(divs).on("mouseover",function(eventObject,targetElements){
>> 
>>    // "this" refers to the element among the targeted elements that is focused or hovered.
>>    this.style.color="red";
>>    console.log(this===eventObject.target);// true
>>    
>>    // Also take advantage of the `each` method of the targetElements parameter
>>    // It iterates over all the targeted elements and performs the function passed as argument to it.
>>    targetElements.each(function(){
>>        // Note: "this" here is not the same as the "this" above.
>>        console.log(this);
>>    });
>>    
>> },"my optional identifier for the anonymous function")/* chainable */
>> 
>> .on("mouseout",function(eventObject, targetElements){
>> 
>>    // "this" refers to the element among the targeted elements that is blured.
>>    this.style.color="blue";
>>    console.log(this===eventObject.target);// true
>> })
>> /* Add another mouseover listener */
>>  .on("mouseover",function(eventObject, targetElements){
>> 
>>    console.log(eventObject);// Mouse Event Data
>> });//Chaining ends here but event.js is not ended yet.
>> 
>> //  Add another mouseover listener
>> events.targ(divs).on("mouseover",function(eventObject, targetElements){
>> 
>>    console.log(eventObject);// Mouse Event Data
>>    console.log(targetElements);// An array of the Targeted Elements with the each method attached to the array.
>> });
>> 
> - #### `removeAllListeners` .removeAllListeners(eventName)
> Use to remove all event listeners/handlers of the event name specified.
>> ```js
>> // Removes all mouseover listeners/handlers of the first and second Div elements.
>> events.targ([divs[0],divs[1]]).removeAllListeners("mouseover");
>> 
> - #### `eventCount` .eventCount(eventName, count)
> Use to set how many times an event listener/handler will be called.
>> ```js
>> // Sets the mouseover listeners to be called once.
>> events.targ(divs).eventCount("mouseover",1);// Results:
>>                                                  // Listeners are executed when a targeted element is hovered for the first time 
>>                                                  // and do not get executed afterwards when hovered again.
>> 
> - #### `removeListener` .removeListener(eventName, the-optional-identifier-for-the-listener | A reference to the listerner)
> Use to remove an event listener/handler of the specified event name.
>> ```js
>>  var button = document.getElementById("button");
>>  
>>  // Removing listener by identifier
>>  events.targ(button).on("click",function(e,ech){
>>      //...
>>      
>>  },"buttonClickedListener1").on("click",function(e,ech){
>>      //...
>>      
>>  },"buttonClickedListener2").removeListener("click","buttonClickedListener1");
>>  // If the button is clicked, only the second listener gets executed.
>>  
>>  // Removing listener by reference
>>  function buttonIsClicked(eventObject,targetElements){
>>      //do stuff..
>>  };
>>  
>>  events.targ(button).on("click",buttonIsClicked).on("click",function(e,ech){
>>      //...
>>  },"buttonClickedListener2").removeListener("click",buttonIsClicked);
>>  // If the button is clicked, the buttonIsClicked listner does not get executed.
>>  
> - #### `removeTargetEvents` .removeTargetEvents(targetElements | undefined)
> Use to remove all listening events of the object(s) specified.
>> ```js
>> /* Let's go back to the divs examples above */
>> 
>> // Removes all listening events of the targeted elements
>> events.targ(divs).removeTargetEvents();
>> 
>>  // Removes all listening events of the element(s) passed as argument to the removeTargetEvents method.
>>  events.targ(divs).removeTargetEvents(button);
>>  
>> `
>**Note**: If you choose to use event.js, do not use the onEvent properties of the HTML elements. Use event.js throughout for all that you will use the onEvent properties of the HTML elements
