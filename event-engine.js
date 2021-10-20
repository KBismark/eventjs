"use strict"
function EventEmitter(){
    if(!new.target){
        return new EventEmitter();
    }
    let eventStore=[],eNames=[],fNames=[],count=[],e=-1,allow=false;
    let o={
        //Use to set how many times an event should be triggered/emitted.
        count:function(num){
            if(allow){
                if(typeof (num)==="number"){
                    num=Math.ceil(num);
                    count[e]=num;
                    e=-1;
                }
                allow=false;
            }
        }
    };
    //Use to add event listeners
    this.on=function(eventName,func,funcName){
        if(typeof (eventName)==="string"&&typeof (func)==="function"){
            let index=eNames.indexOf(eventName);
            if(0>index){
                eNames.push(eventName);
                fNames.push([]);
                eventStore.push([]);
                count.push(-1);
                index=eNames.length-1;
            }
            e=index;
            eventStore[index].push(func);
            if(typeof (funcName)==="string"){
                fNames[index].push(funcName);
            }else{
                fNames[index].push(null);
            }
            
            allow=true;
        }else{allow=false;};
        return o;
    };
    //Use to emit/trigger events
    this.emit=function(eventName,arg,ev){
            let index=eNames.indexOf(eventName);
            if(0<=index&&count[index]!==0){
                var i;
                if(typeof (arg)==="undefined"){
                    for(i in eventStore[index]){
                        eventStore[index][i]();
                    }
                }else if(typeof (arg.target)==="undefined"&&Array.isArray(arg)){
                    for(i in eventStore[index]){
                        arg.each = Each;
                        eventStore[index][i](arg);
                    }
                }else{
                    for(i in eventStore[index]){
                        eventStore[index][i]=eventStore[index][i].bind(ev.target);
                        arg = arg.target[1];
                        arg.each = Each;
                        eventStore[index][i](ev,arg);
                    }
                }
                if(count[index]>0){
                    count[index]-=1;
                }
            }
            return this;
    };
    function Each(listener){
        if(typeof (listener)==="function"){
            var i,list=[],l=0;
            while(l<this.length){
                list.push(listener);
                l++;
            }
            for(i in list){
                list[i] = list[i].bind(this[i]);
                list[i]();
            }
        };
    };
    //Use to remove all event listeners/handlers of the event name specified.
    this.removeAllListeners=function(eventName){
        if(typeof (eventName)==="string"){
            let index=eNames.indexOf(eventName);
            if(0<=index){
                eventStore.splice(index,1);
                eNames.splice(index,1);
                count.splice(index,1);
                fNames.splice(index,1);
            }
        }
    };
    //Use to remove an event listener/handler of the specified event name.
    this.removeListener=function(eventName,funcORfuncName){
        var id=0;
        if(typeof (funcORfuncName)==="function"){id=1;}else if(typeof (funcORfuncName)==="string"){id=2;}
        if(typeof (eventName)==="string"&&0<id){
            let index=eNames.indexOf(eventName);
            if(0<=index){
                if(1===id){
                    let index1 = eventStore[index].indexOf(funcORfuncName);
                    if(0<=index1){
                        eventStore[index].splice(index1,1);
                        fNames[index].splice(index1,1);
                    }
                }else{
                    let index1 = fNames[index].indexOf(funcORfuncName);
                    if(0<=index1){
                        eventStore[index].splice(index1,1);
                        fNames[index].splice(index1,1);
                    }
                }
            }
        }
    }

};
