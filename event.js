"use strict"

//An event engine
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
        if(typeof (eventName)==="string"){
            let index=eNames.indexOf(eventName);
            if(0<=index&&count[index]!==0){
                var i;
                for(i in eventStore[index]){
                    if(arg.target){
                        eventStore[index][i]=eventStore[index][i].bind(ev.target/*arg.target[0]*/);
                        arg = arg.target[1];
                        arg.each = Each;
                    }
                    eventStore[index][i](ev,arg);
                }
                if(count[index]>0){
                    count[index]-=1;
                }
            }
            
        }
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


//Front end event listerner
function EventListener(){
    
    if(!new.target){
        return new EventListener();
    }
    let Objects=[],eventStore=[],EEstore=[],OBJ=null,curEvent=null;
    function callback(){};
    function stop(){
        if(this.preventDefault){
          this.preventDefault();
          this.stopPropagation();
        }else{
          this.returnValue = false;
          this.cancelBubble = true;
        }
    };
    let o={
        //Use to add event listeners
        on:function(eventName,func,funcName){
            if(typeof (eventName)==="string"&&typeof (func)==="function"){
                curEvent=eventName;
                var i;
                for(i in OBJ){
                    let index = Objects.indexOf(OBJ[i]);
                    if(0>index){
                        Objects.push(OBJ[i]);
                        eventStore.push([]);
                        EEstore.push(new EventEmitter());
                        index = Objects.length-1;
                        
                    }
                    EEstore[index].on(eventName,func,funcName);
                    let index1 = eventStore[index].indexOf(eventName);
                    if(0>index1){
                        eventStore[index].push(eventName);
                        let O = {
                            target: [OBJ[i],OBJ]
                        };
                        OBJ[i]["on"+eventName]=function(e){
                            e.stopDefault = stop;
                            EEstore[index].emit(eventName,O,e);
                        };
                    }
                    
                }

            };
            return this;
        },
        //Use to remove all event listeners/handlers of the event name specified.
        removeAllListeners: function(eventName){
            var i;
            for(i in OBJ){
                let index = Objects.indexOf(OBJ[i]);
                if(0<=index){
                    EEstore[index].removeAllListeners(eventName);
                }
            };
            return this;
        },
        //Use to set how many times an event should be triggered.
        eventCount: function(eventName,count){
            let allow=false;
            if(typeof (eventName)==="number"){count=eventName;eventName=curEvent;allow=true;}
            if(allow||(typeof (count)==="number"&&typeof (eventName)==="string")){
                var i;
                for(i in OBJ){
                    let index = Objects.indexOf(OBJ[i]);
                    if(0<=index){
                        EEstore[index].on(eventName,callback).count(count);
                        EEstore[index].removeListener(eventName,callback);
                    }
                };
            };
            return this;
        },
        //Use to remove an event listener/handler of the specified event name.
        removeListener: function(eventName,funcORfuncName){
            var i;
            for(i in OBJ){
                let index = Objects.indexOf(OBJ[i]);
                if(0<=index){
                    EEstore[index].removeListener(eventName,funcORfuncName);
                }
            };
            return this;
        },
        //Use to remove all listening events of the object(s) specified.
        removeTarget: function(obj){
            if(typeof (obj)==="undefined"){
                obj=OBJ;
            }
            if(null!==obj&&typeof (obj)==="object"){
                if(!Array.isArray(obj)){
                    if(!obj.length){
                        obj=[obj];
                    }else{
                        obj=Object.values(obj);
                    }
                }
                var i;
                for(i in obj){
                    let index = Objects.indexOf(obj[i]);
                    if(0<=index){
                        Objects.splice(index,1);
                        EEstore.splice(index,1);
                        eventStore.splice(index,1);
                    }
                }
                
            };
            return this;
        },
        //manual predefined events
        manualEvent: function(eventName,func,funcName){
            return this;
        }
    
    };
    //Use to set the current object(s) for event manipulations. 
    this.targ=function(obj){
        OBJ=null,curEvent=null;
        if(null!==obj&&typeof (obj)==="object"){
            if(!Array.isArray(obj)){
                if(!obj.length){
                    obj=[obj];
                }else{
                    obj=Object.values(obj);
                }
            }
            OBJ=obj;
            return o;
        }
    };
    this.$=this.targ;
};
