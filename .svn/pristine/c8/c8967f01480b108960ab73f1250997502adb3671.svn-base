var chatbox = angular.module('chatbox', []);

chatbox.directive('chatbox', function(DirFactory, VarFactory, BotTriggerFactory, ConfigFactory) {
    return {
        restrict: 'EA',

        scope: {
            //Name of organization
            ngOrganization: '@',

            //Define applications scope here
            ngVarZero: '@'

        },

        template: //'<div class="circle_chatbox"></div>' +
        '<div class="chat-block visible-in" ng-show="showChat">' +
            '   <div class="msg_head"><span><img src="chatbot/images/chat-icon.png" ng-show="state ==2? true:false"><img src="chatbot/images/chat-icon-robot.png" ng-show="state == 2? false:true"></span><span class="chat-title"> Chat with {{ngOrganization}} Support</span><span ng-click="click()" class="chat-min"></span></div>' +
            '   <div class="msg_wrap" scroll-glue>' +
            '    <div class="msg_body" scroll-glue>' +
            '    <div><div class="msg_a" hidden="true">tr</div></div>' +
            '     <div><div class="msg_b" hidden="true">trtr</div></div>' +
            '   <div class="msg_push"><p class="enter-msg">{{response}}</p></div>' +
            '     </div>' +
            '    </div>' +
            '   <input type="text" ng-keyup="$event.keyCode==13?sayChat():null" ng-model="Userinput.text" class="chattext" />' +
            '    <button ng-click="sayChat()" class="send" type="submit">Send</button>' +
            '</div>' +
            '<div class="chatbox_arrow" ng-show="showChat"></div>' +
            '<div id="chat_button" class="circle_menu" ng-click="click()"><img src="chatbot/images/brain.png" ng-show="!showChat" class ="btn_img"><img src="chatbot/images/brain.png" ng-show="showChat" class ="btn_img"></i></div>',
        /*close.png*/
        controller: ['$rootScope', '$scope', '$http',
            function($rootScope, $scope, $http) {


                /*STATES
                  1. BOT - 0
                  2. AI - 1
                  3. OPERATOR - 2
                */

                $scope.config; //accsess config.json file data
                $scope.state = 0;
                $scope.operator_status = null;
                $scope.usermessage = '';
                //set conversation-id to conutinute the conversation
                $scope.con_ID = "";

                //Create the client subscribe to topic
                var path = '';
                var client;
                var scrolled = 0;
                var fixDestination = '';

                /*Variable for the histroty */
                var history = [];
                var startstr = '"VARHISTORY":';
                var isSend = false;
                var train = true;
                var isReconnected = false;
        

                //Fix for $scope.Userinput.text undefined error
                $scope.Userinput = {};
                $scope.Userinput.text = "";
                //End of fix

                //Loading configurations here
                ConfigFactory.fetch().then(function(data) {
                    console.log("[BOTConsole] ConfigFactory.fetch: Loading configurations");
                    $scope.config = data;

                });

                //Animate the chat button here
                var bounce = new Bounce();
                bounce
                    .translate({
                        from: {
                            x: 0,
                            y: 0
                        },
                        to: {
                            x: 0,
                            y: -50
                        },
                        easing: "hardsway",
                        duration: 2000,
                        delay: 800,
                        stiffness: 2
                    })
                bounce.rotate({
                    from: 0,
                    to: 360,
                    duration: 1000,
                    delay: 2000,
                });

                bounce.applyTo($("#chat_button")).then(function() {
                    console.log("Animation complete");
                });

                /*Define your custom functions here
                  All custom functions should accept GroupID and should call callback function
                */

                //HTTP GET function
                function doGET(varGroupID, url) {
                    $http.get(url)
                        .then(function(response) {
                            var temp = response.data;
                            callback(varGroupID, temp);
                        });
                };

                //For setting the scope
                function setChildScope(varGroupID, scope) {
                    var data = eval("$scope." + scope);
                    callback(varGroupID, data);
                };
                //End of custom function definitions

                //Call this to set the variables from your custom function
                function callback(varGroupID, data) {
                    ($scope.variableGroups).forEach(function(obj) {
                        if (obj.ID == varGroupID) {
                            (obj.varGroup).forEach(function(obj) {
                                console.log("[BOTConsole] callback: Updating this ID with new value");
                                console.log(obj.ID);
                                console.log(eval(obj.assign));
                                pushVar(obj.ID, eval(obj.assign));
                            });
                        }
                    });
                    console.log("[BOTConsole] callback: Variables after the update");
                    console.log($scope.variables)
                };

                function updateVarGroup(varGroupID) {
                    console.log("[BOTConsole] updateVarGroup: Updating Var Group " + varGroupID);
                    console.log($scope.variableGroups);
                    ($scope.variableGroups).forEach(function(obj) {
                        if (obj.ID == varGroupID) {
                            console.log("[BOTConsole] updateVarGroup: Found a match for " + varGroupID);
                            var ID = varGroupID;
                            eval(obj.setter);
                        }
                    });
                };

                /*DIRECTIVES
                  1. DIRDEVELOPERSTART
                  2. DIRROUTETOBOT
                  3. DIRROUTETOAI
                  4. DIRROUTETOOPERATOR
                */

                //Fetch your directives here at compile time here
                DirFactory.fetch().then(function(data) {
                    $scope.directives = data.dirs;
                    console.log("[BOTConsole] DirFactory.fetch: Loading directories");
                    console.log(data);
                });

                /*VARIABLES
                 Replace them inside constructResponse(msg) function
                */

                $scope.variables = [];

                //Variable operations
                function pushVar(id, value) {
                    for (i = 0; i < (($scope.variables).length); i++) {
                        var varExists = false;
                        if (($scope.variables)[i].id == id) {
                            console.log("[BOTConsole] pushVar: Var exists");
                            console.log("[BOTConsole] pushVar: Var ID and new value");
                            console.log(id);
                            console.log(value);
                            ($scope.variables)[i].value = value;
                            varExists = true
                            break;
                        }
                    }
                    if (!varExists) {
                        console.log("[BOTConsole] pushVar: Var does not exist");
                        ($scope.variables).push({
                            id: id,
                            value: value
                        });
                    }
                };

                function getVar(id) {
                    for (i = 0; i < (($scope.variables).length); i++) {
                        var returnVal = null;
                        if (($scope.variables)[i].id == id) {
                            console.log("[BOTConsole] getVar: Var exists");
                            returnVal = ($scope.variables)[i].value;
                            break;
                        }
                    }
                    return returnVal;
                };

                function askVar(arr, successDirective) {
                    console.log("[BOTConsole] askVar: Inside askVar");

                    var BreakException = {};

                    try {
                        arr.forEach(function(obj) {
                            var tmp = getVar(obj.ID);
                            if ((tmp == null) || (tmp == "")) {
                                console.log("[BOTConsole] askVar: Empty var found for");
                                console.log(obj.ID);
                                sendDirectivetoBot(obj.action);
                                throw BreakException;
                            }
                        });

                        //Check for the user defined directive
                        ($scope.directives).forEach(function(obj) {
                            console.log("[BOTConsole] askVar: Evaluating custom directive " + obj.ID);
                            var dir = obj.ID + "";
                            if (successDirective.indexOf(dir) > -1) {
                                console.log("[BOTConsole] askVar: Found the custom directive and now evaluating");
                                eval(obj.action);
                            }
                        });

                    } catch (e) {
                        if (e !== BreakException) throw e;
                    }
                };

                //Fetch your vars here
                VarFactory.fetch().then(function(data) {
                    $scope.variableGroups = data.varGroups;
                    console.log("[BOTConsole] VarFactory.fetch: Loading variables");
                    console.log("[BOTConsole] VarFactory.fetch: Data");
                    console.log(data);

                    //Push variabless
                    ($scope.variableGroups).forEach(function(obj) {
                        (obj.varGroup).forEach(function(obj) {
                            console.log("[BOTConsole] VarFactory.fetch: Object to be pushed");
                            console.log(obj);
                            pushVar(obj.ID, obj.value);
                        });
                    });
                    console.log("[BOTConsole] VarFactory.fetch: Variables");
                    console.log($scope.variables);
                    console.log("[BOTConsole] VarFactory.fetch: Variable Groups");
                    console.log($scope.variableGroups);
                });

                /*BOTTRIGGERS
                  Bot trigger events to trigger the bot from the main app
                */

                //Fetch your bot triggers  here
                BotTriggerFactory.fetch().then(function(data) {
                    console.log("[BOTConsole] BotTriggerFactory.fetch: Loading bot triggers");
                    console.log("[BOTConsole] BotTriggerFactory.fetch: Data");
                    console.log(data);
                    $scope.botTriggers = data.botTriggers;
                });

                //Bot triggers are handled here
                $rootScope.$on('botTrigger', function(event, e) {
                    console.log("[BOTConsole] AppTriggerFactory.fetch: Bot trigger detected");
                    ($scope.botTriggers).forEach(function(obj) {
                        if (e == obj.ID) {
                            console.log("[BOTConsole] $rootScope.$on: Executing bot trigger action for " + obj.ID);
                            eval(obj.action);
                        }
                    });
                });

                //Just to check the button click and change button look and feel
                $scope.clicked = 0;
                $scope.showChat = false;
                $scope.click = function() {

                    //Initialize the bot state at the startup to BOT
                    $scope.state = 0;

                    //Test askVar function using this
                    //askVar([{"ID":"VARUSERNAME", "action":"DIRASKUSERNAME"},{"ID":"VARCITY", "action":"DIRASKCITY"}]);

                    //Test the triggers using this
                    //$rootScope.$broadcast('appTrigger', 'triggerone');

                    //Send init directive

                    if (!$scope.showChat) {
                        if ($scope.clicked == 0) {
                            console.log("[BOTConsole] Sending directive to bot.");

                            //sendDirectivetoBot("DIRINIT");
                            //sendDirectivetoBot("DIRINIT");
                            //sendDirectivetoBot("DIRDEVELOPERSTART");
                            setTimeout(function() {
                                sendDirectivetoBot("DIRCITYINIT");
                            }, 500);
                            
                            speechSynthesis.cancel(); //Fix for synthesising error
                        }
                    }

                    $scope.clicked++;
                    $scope.showChat = !$scope.showChat;
                    console.log("[BOTConsole] $scope.click: " + $scope.clicked);

                };

                //Serialize data before sending
                function serializeData(data) {
                    // If this is not an object, defer to native stringification.
                    if (!angular.isObject(data)) {
                        return ((data == null) ? "" : data.toString());
                    }

                    var buffer = [];

                    // Serialize each key in the object.
                    for (var name in data) {
                        if (!data.hasOwnProperty(name)) {
                            continue;
                        }
                        var value = data[name];
                        buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
                    }

                    // Serialize the buffer and clean it up for transportation.
                    var source = buffer.join("&").replace(/%20/g, "+");
                    return (source);
                }

                //Replace varibles in the message and construct the response
                function constructResponse(msg) {
                    for (i = 0; i < (($scope.variables).length); i++) {
                        msg = msg.replace(($scope.variables)[i].id, ($scope.variables)[i].value);
                    }
                    console.log("[BOTConsole] constructResponse: Final message is " + msg);
                    return msg;
                }

                //Checks directives for state changes,then changes the state and removes the directives
                function evaluateResponse(msgRec) {
                    
                    var msg = readJSON(msgRec);

                    var returnVal = msg;

                    if (msg.indexOf("DIRDONOTTRAIN") > -1) {
                        console.log("[BOTConsole] evaluateResponse: Do not train the question & answer");

                        train = false;
                        returnVal = returnVal.replace("DIRDONOTTRAIN", "");
                    }

                    //Default directives
                    if (msg.indexOf("DIRROUTETOBOT") > -1) {
                        console.log("[BOTConsole] evaluateResponse: State change to 0(BOT)");
                        if ($scope.state == 2) {
                      
                            $scope.state = 0;
                            //destination = '/topic/chat.';
                            endChat();
    
                        }
                        //Change state
                       // $scope.state = 0;
                        history = [];
                        //Remove directive
                        returnVal = returnVal.replace("DIRROUTETOBOT", "Operator Disconnected");
                     
                      /* <div class="msg_head"><span> <img src="chatbot/images/chat-icon.png"*/
                    }

                    if (msg.indexOf("DIRROUTETOAI") > -1) {
                        console.log("[BOTConsole] evaluateResponse: State change to 1(AI)");

                        //Change state
                        $scope.state = 1;

                        //Remove directive
                        returnVal = returnVal.replace("DIRROUTETOAI", "");
                    }


                    if (msg.indexOf("DIRROUTETOOPERATOR") > -1) {

                        var replace = "";
                        var temp = $scope.usermessage;
                        $('<div class="connectionVerify">I do not know how to answer the question <br/> shall i connect with the operator?                </div>').insertBefore('.enter-msg');

                        $('<div class="connectionVery"><button class="yesBT">Yes</button><button class="noBT">NO</button></div>').insertBefore('.enter-msg');

                        //console.log("before   ***************************  "+ $scope.usermessage);
                        $(".yesBT").click(function () {

                            textSpeech("Operator Connected");
                            console.log("[BOTConsole] evaluateResponse: State change to 2(OPERATOR)");

                            $(".connectionVerify").hide();
                            $(".yesBT").hide();
                            $(".noBT").hide();
                          

                            $('<div class="connectionAlert">' + "Operator has joined the conversation " + '</div>').
                            insertBefore('.enter-msg');
                            replace = "";
                            //Change state
                            //Initiate websocket connection
                            replace = "";
                            $scope.usermessage = temp;

                            initChat();
                            /*route to operator==> add icon changing event*/
                             $scope.$apply(function(){
                             $scope.state =2;
                             '<div class="msg_head"><span><img src="chatbot/images/chat-icon.png" ></span></div>'
                         
                             });
                          

                        });

                        $(".noBT").click(function () {

                            $scope.state = 0;
                            $(".connectionVerify").hide();
                            $(".yesBT").hide();
                            $(".noBT").hide();
                            replace = "DIRROUTETOBOT";

                        });
                        returnVal = returnVal.replace("DIRROUTETOOPERATOR",replace);
                        return msg.replace("DIRROUTETOOPERATOR", replace); //.replace("DIRROUTETOOPERATOR", "");
                        
                       /* $('<div class="connectionAlert">'+"Operator has joined the conversation" + '</div>').insertBefore('.enter-msg');
                        textSpeech("Operator Connected");
                        console.log("[BOTConsole] evaluateResponse: State change to 2(OPERATOR)");

                        //Change state
                        $scope.state = 2;
                      
                        //Initiate websocket connection
                        initChat();
                        

                        //Remove directive
                        returnVal = returnVal.replace("DIRROUTETOOPERATOR", "");*/
                    }

                    if (msg.indexOf("DIRDONOTHING") > -1) {

                        //Do nothing
                        returnVal = returnVal.replace("DIRDONOTHING", "");

                    }


                    //Evaluate DIRSTORE directive
                    if ((msg.indexOf("DIRSTORE") > -1) && (msg.indexOf("ENDDIRSTORE") > -1)) {
                        var tmp = msg.substring(msg.indexOf("DIRSTORE"), msg.indexOf("ENDDIRSTORE") + "ENDDIRSTORE".length);
                        returnVal = returnVal.replace(tmp, "");
                        var split = tmp.split(" ");

                        //Get name of var
                        var varID = split[1];

                        var varValue = msg.substring((msg.indexOf(varID) + varID.length + 1), msg.indexOf("ENDDIRSTORE") - 1);
                        console.log("[BOTConsole] evaluateResponse: Evaluating DIRSTORE. ID and Value");
                        console.log(varID);
                        console.log(varValue);

                        //Store your var here
                        pushVar(varID, varValue);

                        console.log("[BOTConsole] evaluateResponse: Variables");
                        console.log($scope.variables);

                    }
                    //usernmade ,#defect
                    //Evaluate DIRUPDATEVARGROUPS directive
                    if ((msg.indexOf("DIRUPDATEVARGROUPS") > -1) && (msg.indexOf("ENDDIRUPDATEVARGROUPS") > -1)) {
                        var tmp = msg.substring(msg.indexOf("DIRUPDATEVARGROUPS"), msg.indexOf("ENDDIRUPDATEVARGROUPS") + "ENDDIRUPDATEVARGROUPS".length);
                        returnVal = returnVal.replace(tmp, "");
                        var split = (msg.substring((msg.indexOf("DIRUPDATEVARGROUPS") + "DIRUPDATEVARGROUPS".length + 1), (msg.indexOf("ENDDIRUPDATEVARGROUPS") - 1))).split(" ");
                        console.log("[BOTConsole] evaluateResponse: Updating var groups");
                        split.forEach(function(obj) {
                            console.log("[BOTConsole] evaluateResponse: Updating var group " + obj);
                            updateVarGroup(obj);
                        });
                    }

                    //Check for user defined directives
                    ($scope.directives).forEach(function(obj) {
                        console.log("[BOTConsole] evaluateResponse: Evaluating custom directive " + obj.ID);
                        var dir = obj.ID + "";
                        if (msg.indexOf(dir) > -1) {
                            console.log("[BOTConsole] evaluateResponse: Found a custom directive and now evaluating");
                            returnVal = returnVal.replace(dir, "");
                            eval(obj.action);
                        }
                    });

                    return returnVal;
                }

                //Sending Directive to BOT ========================================================================
                //Use this to send init messages to the bot
                function sendDirectivetoBot(directive) {
                    //console.log("Hi sdasdsadasdasdas");
                    console.log("[BOTConsole] sendDirectivetoBot: @ Now conversation handle by  AIML @");
                    var msg;

                    if ($scope.con_ID == "") {
                        //console.log("Hi if");
                        msg = {
                            say: directive
                        };

                    } else {
                        console.log("else if");
                        msg = {
                            say: directive,
                            convo_id: $scope.con_ID
                        };
                    }

                    $http({
                        method: 'POST',
                        url: $scope.config.botUrl,
                        //url: 'http://localhost/Program-O/chatbot/conversation_start.php',
                        //url: 'http://cmterainsight/aiml/conversation_start.php',
                        dataType: "json",
                        data: serializeData(msg), //Pass in data as strings
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        } //Set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {

                        $scope.con_ID = data.convo_id;

                        //If succeeds evaluate and construct response
                        console.log("[BOTConsole] sendDirectivetoBot: SUCCESS response from bot");
                        console.log("[BOTConsole] sendDirectivetoBot: Data");
                        console.log(data);

                        var res = constructResponse(evaluateResponse(data.botsay));
                        console.log("[BOTConsole] sendDirectivetoBot: Response and state");
                        console.log(res);
                        console.log($scope.state);

                        if ($scope.state == 1) {
                            messageAI();
                            // return;
                        } else if ($scope.state == 2) {
                            //There is not state change from 0 to 2 
                            console.log("[BOTConsole] sendDirectivetoBot: ERROR state change from 0 to 2");
                        }

                        if (!(res == "")) {
                            console.log("[BOTConsole] sendDirectivetoBot: Writing the output to the div");
                            //Add chat bubbles

                            $('<div class="msg_a">' + res + '</div>').insertBefore('.enter-msg');
                            textSpeech(res);
                        }

                    }).error(function(data, status) {
                        console.log("[BOTConsole] sendDirectivetoBot: ERROR in bot response. Routing to AI");
                        $scope.state = 1;
                        messageAI();
                    });

                }

                //Sending Message to BOT ========================================================================
                function messageBot() {
                    console.log("[BOTConsole] messageBot: @ Now conversation handle by  AIML @");
                    var msg;

                    if ($scope.con_ID == "") {
                        msg = {
                            say: $scope.usermessage
                        };
                    } else {
                        msg = {
                            say: $scope.usermessage,
                            convo_id: $scope.con_ID
                        };
                    }

                    if ($scope.usermessage == "") {
                        console.log("[BOTConsole] messageBot: ERROR nothing to send");
                        return;
                    }
                    $http({
                        method: 'POST',
                        url: $scope.config.botUrl,
                        //url: 'http://localhost/Program-O/chatbot/conversation_start.php',
                        //url: 'http://cmterainsight/aiml/conversation_start.php',
                        dataType: "json",
                        data: serializeData(msg), //Pass in data as strings
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        } //Set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {
                        //Capture conversation ID
                        $scope.con_ID = data.convo_id;
                        //If succeeds evaluate and construct response
                        console.log("[BOTConsole] messageBot: SUCCESS response from bot");
                        console.log("[BOTConsole] messageBot: Data");
                        console.log(data);
                        //console.log("[BOTConsole]:"+data.botsay);

                        var res = constructResponse(evaluateResponse(data.botsay));
                        console.log("[BOTConsole] messageBot: Response and state");
                        console.log(res);
                        console.log($scope.state);

                        if ($scope.state == 1) {
                            messageAI();
                            return;
                        } else if ($scope.state == 2) {
                            //There is not state change from 0 to 2
                            console.log("[BOTConsole] messageBot: ERROR state change from 0 to 2");
                        }

                        $scope.usermessage = "";

                        if (!(res == "")) {
                            console.log("[BOTConsole] messageBot: Writing the output to the div");
                            $('<div class="msg_a">' + res + '</div>').insertBefore('.enter-msg');
                            textSpeech(res);
                        }
                    }).error(function(data, status) {
                        console.log("[BOTConsole] messageBot: ERROR in bot response. Routing to AI");
                        $scope.state = 1;
                        messageAI();
                    });

                }

                //Sending Message to AI ========================================================================
                function messageAI() {

                    console.log("[BOTConsole] messageAI: @ Now conversation handle by  AI @");
                    if ($scope.usermessage == "") {
                        console.log("[BOTConsole] messageAI: ERROR nothing to send");
                        return;
                    }

                    $http({
                        method: 'POST',
                        // url: 'http://cmterainsight/ask',
                        /*url: 'http://cmterainsight/aibot1',*/

                        url: $scope.config.aiUrl,
                        dataType: "json",
                        data: serializeData({
                            user_question: $scope.usermessage
                        }), //Pass in data as strings
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        } //Set the headers so angular passing info as form data (not request payload)
                    }).success(function(data) {

                        //If succeeds evaluate and construct response
                        console.log("[BOTConsole] messageAI: SUCCESS response from AI");
                        console.log("[BOTConsole] messageAI: " + data);
                        //console.log("[BOTConsole] messageAI: " + data[0]);

                        //var res = constructResponse(evaluateResponse(data[0].toString()));
                        var res = constructResponse(evaluateResponse(data.toString()));
                    
                 
                        console.log("[BOTConsole] messageAI: Response and state");
                        console.log("[BOTConsole] messageAI: " + res);
                        console.log("[BOTConsole] messageAI: " + $scope.state);

                        if ($scope.state == 2) {
                            console.log("[BOTConsole] messageAI: State change to 2");
                            //sendChat()
                            return;

                        } else if ($scope.state == 0) {
                            console.log("[BOTConsole] messageAI: ERROR State change to 0");
                            messageBot();
                        }
                        $scope.usermessage = "";
                        console.log("[BOTConsole] messageAI: Writing the output to the div");
                        //Add chat bubbles
                        
                        if (res != "")
                            $('<div class="msg_a">' + res + '</div>').insertBefore('.enter-msg');
                      
                        textSpeech(res);
                        $scope.state = 0;/*Change the state into 0 ==> after given an answer from python API*/

                    }).error(function(data, status) {
                        console.log("[BOTConsole] messageBot: ERROR in bot response. Do nothing");
                    });

                }
                //Remove the session-ID regex/characters
                function constructSessionID(id) {

                    return id.replace(/:|-/g, '');
                }
                //Init chat connection
                function initChat() {
            
                    console.log("[BOTConsole] initChat: URL      - " + $scope.config.activemqUrl);
                    console.log("[BOTConsole] initChat: LOGIN    - " + $scope.config.activemqLogin);
                    console.log("[BOTConsole] initChat: PASSCODE - " + $scope.config.activemqPw);
                    console.log("[BOTConsole] initChat: DESTINATION - " + $scope.config.activemqDestination);
                    
                     $('<div class ="disconnetclass">' + 'To disconnet from the operator press <button class = "disconnectZ" >Disconnet</button>' + '</div>').insertBefore('.enter-msg');
                    $(".disconnectZ").click(function () {

                        $('<div class="diconnectionAlert">' + "Operator left the conversation " + '</div>').insertBefore('.enter-msg');
                        $(".connectionAlert").hide();
                        $scope.usermessage = "DIRDISCONNECT";
                        sendChat();
                        endChat();
                        $(".disconnetclass").hide();

                        $(".disconnectZ").hide();
                        textSpeech("Operator Disconnected");
                    

                    });

                    client = Stomp.client($scope.config.activemqUrl);
                    client.connect($scope.config.activemqLogin, $scope.config.activemqPw, function(frame) {
                        path = constructSessionID(frame.headers.session + "");
                        //Append session id with exist destination
                        /*$scope.config.activemqDestination = $scope.config.activemqDestination + "" + path;*/
                        $scope.config.activemqDestination = $scope.config.activemqDestination + "" + $scope.con_ID;

                        if (fixDestination == "") {
                            fixDestination = $scope.config.activemqDestination;
                        }


                        console.log("[BOTConsole]initChat: " + $scope.config.activemqDestination);
                        //Invoke sendChat function
                        sendChat();

                        client.subscribe($scope.config.activemqDestination, function(message) {

                            console.log("[BOTConsole] initChat: MESSAGE is ");
                            console.log(message);
                            var msgID = constructSessionID(message.headers["message-id"] + "");
                            var msg = constructResponse(evaluateResponse(message.body));
                            
                            if (msg.indexOf(startstr) > -1)
                                return;
                            
                            console.log("[BOTConsole] initChat: subscribe: MSG - " + msg);

                            if (msgID.indexOf(path) > -1) {
                                console.log("[BOTConsole] initChat: subscribe: Message from user");
                                $('<div class="msg_b">' + msg + '</div>').insertBefore('.enter-msg');
                            } else {
                                console.log("[BOTConsole] initChat: subscribe: Message from operator");
                                if (msg == "Operator Disconnected") 
                                {
                                   $('<div class="connectionAlert">' + "Operator left the conversation" + '</div>').
                                    insertBefore('.enter-msg');
                                   
                                } else {
                                    $('<div class="msg_a">' + msg + '</div>').insertBefore('.enter-msg');
                                }
                                
                                textSpeech(msg);

                            }

                            glueScroll(); //Add glueScroll function
                        });
                        /*Try to connect with  activeMQ*/
                    }, function(message) {
                        console.log("Trying To Connect With  Chat Server : " + message);
                        alert("Trying To Connect With Chat Server :" + message);
                     
                        initChat();
                        isReconnected = true;
                    });

                } //End of initChat 

                //Sending the chat to operator
                function sendChat() {
                    glueScroll(); //Add glueScroll function
                    if ($scope.usermessage == "") {
                        console.log("[BOTConsole] messageBot: ERROR nothing to send");
                        return;
                    }

                    /*function that send chat history to  operator*/
                    /*@history block */
                    /*@Training conversation  block*/
               
                    if (train == true) {
                        client.send($scope.config.activemqDestination, {}, createToJson($scope.usermessage));
                    } else {
                        client.send($scope.config.activemqDestination, {}, "DIRDONOTTRAIN " + createToJson($scope.usermessage));
                        train = true;
                    }

                    if (!isReconnected) { //if true
                        if (!isSend) { //if true

                            var obj = JSON.stringify(history);
                            client.send(fixDestination, {}, startstr + obj);
                            isSend = true;
                            isReconnected = false;
                            console.log("********************************" + startstr + obj);
                        }
                    } else {
                        console.log("Do not sent the history chats...... ");
                    }



                    glueScroll(); //Add glueScroll function

                } //End  of sendChat

                //Disconnect code goes here
                function endChat() {
                    //Disconnect code here
                    client.disconnect(function() {
                        console.log("[BOTConsole] endChat: Ending chat");

                    });
                    
                     $scope.$apply(function(){
                      
                        $scope.state =0;
                      '<div class="msg_head"><span><img src="chatbot/images/chat-icon-robot.png" ></span></div>'
                         
                    });
                }
                
                
                //@Function that use for convert "User Messages" in to Json Format.
                /*
                @param textMeesage ==>user message
                @param textMeesage ==>user received message
                @return JSON Text{'name':'SAM','msg':'Hello World'}
                */

                function createToJson(textMessage) {
                    //var str="{\"owner\":\"Mursith\",\"text\":\""+text+"\"}";

                    if ($scope.state == 2) {
                        var obj   = new Object();
                        obj.text  = textMessage;
                        obj.owner = $scope.ngUsername;

                        var jsonString = JSON.stringify(obj);

                        return jsonString;
                    } else {
                        return textMessage;
                    }
                }

                function readJSON(textReceived) {

                    if ($scope.state == 2) {
                        //    var str = JSON.stringify(textReceived);
                        try {
                            var obj = JSON.parse(textReceived);
                            return obj.text;
                        } catch (e) {
                            return textReceived;
                        }

                    } else {
                        return textReceived;
                    }

                }


                //Implement text To speech method
                function textSpeech(reply) {
                    //Temp  call to speech to text
                    console.log("[BOTConsole] textSpeech: voice : " + reply);
                    var u1 = new SpeechSynthesisUtterance(reply);
                    u1.lang = 'en-US';
                    u1.pitch = 1;
                    u1.rate = 1;
                    //u1.voice = voices[10];
                    u1.voiceURI = 'native';
                    u1.volume = 1;
                    speechSynthesis.speak(u1);

                    /* history messages [answer for user question]*/
                    chatHistory("BOT", reply, messageTime());

                }


                //Add Scroll Glue to chatbot div
                function glueScroll() {
                    scrolled = scrolled + 200;
                    $(".msg_body").animate({
                        scrollTop: scrolled
                    });
                    $(".msg_wrap").animate({
                        scrollTop: scrolled
                    });
                }
                /*set caht history details */
                function chatHistory(key, value, time) {

                    history.push({
                        from: key,
                        msg: value,
                        time: time
                    });
                }
                /*System date Time*/
                function messageTime() {
                    var weekday = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat ");

                    var nowDate = weekday[new Date().getDay()] + " " + new Date().toLocaleString();
                    return nowDate;

                };
              
                /*====================================================================================================================*/
                $scope.sayChat = function() {
           
                    /* history messages [user input]*/
                    chatHistory("USER", $scope.Userinput.text, messageTime());
                    
                    $scope.usermessage = $scope.Userinput.text;
                    if ($scope.usermessage == "") {
                        console.log("[BOTConsole] sayChat: ERROR nothing to send");
                    } else {
                        if ($scope.state == 0) {
                            //Add send chat bubble, send the request and clear text box
                            $('<div class="msg_b">' + $scope.usermessage + '</div>').insertBefore('.enter-msg');
                            messageBot();
                        } else if ($scope.state == 1) {
                            //Add send chat bubble, send the request and clear text box
                            $('<div class="msg_b">' + $scope.usermessage + '</div>').insertBefore('.enter-msg');
                            messageAI();
                            
                        } else if ($scope.state == 2) {
                          
                            sendChat();
                        }
                        //Moved this line to messaging functions
                        $scope.Userinput.text = "";
                    }
                }//End saychat

                //End of controller
            }
        ],

        link: function(scope, iElement, iAttrs, ctrl) {
            console.log("iAttrs");
            console.log(iAttrs.$attr);
            console.log(scope);

        }
    }
});

//Test directive
chatbox.directive('ngCity', function() {
    return {
        controller: function($scope) {}
    }
});