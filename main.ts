//  the communicator data
let communicator_data = {
    "radio" : {
        "groupID" : 1,
        "receivedSignal" : 0,
    }
    ,
    "mode" : {
        "changeChannelMode" : false,
    }
    ,
}

function displayMessage(signal: number, tone: number = Note.C) {
    /** 
        Display the message based on the signal received. 

        Parameters: 
            signal: (int) the signal received
        Returns: none
    
 */
    //  Display the initial LEDs. 
    led.plot(2, 2)
    if (signal) {
        //  long signal
        //  Display the additional plots. 
        for (let LED_array_x of [1, 3]) {
            led.plot(LED_array_x, 2)
        }
        music.playTone(tone, music.beat(BeatFraction.Whole))
    } else {
        //  short signal
        music.playTone(tone, music.beat(BeatFraction.Quarter))
        led.unplot(2, 2)
    }
    
    //  Unplot after displaying it.
    for (let LED_array_X = 1; LED_array_X < 4; LED_array_X++) {
        led.unplot(LED_array_X, 2)
    }
}

function sendMessage(signal: number) {
    /** 
        Broadcast a message. 

        Parameters: 
            signal: (bool) short or long dot
        Returns: none
    
 */
    if (signal) {
        //  long signal
        radio.sendNumber(1)
    } else {
        //  short signal
        radio.sendNumber(0)
    }
    
    displayMessage(signal, Note.A)
}

function changeChannelMode(adjustIncrement: number = 0) {
    /** 
        changeChannelMode allows the changing of radio channels. 

        Parameters: 
            adjustIncrement: (integer) how much to adjust
        Returns: 
            groupID: (integer) the current channel ID
    
 */
    //  Enable the change channel mode. 
    communicator_data["mode"]["changeChannelMode"] = true
    if (adjustIncrement) {
        if (adjustIncrement >= 1) {
            //  increase the selected channel value
            communicator_data["radio"]["groupID"] += 1
        } else if (adjustIncrement <= -1 && communicator_data["radio"]["groupID"] > 1) {
            //  decrease the selected channel value
            communicator_data["radio"]["groupID"] = communicator_data["radio"]["groupID"] - 1
        }
        
        radio.setGroup(communicator_data["radio"]["groupID"])
    }
    
    basic.showNumber(communicator_data["radio"]["groupID"])
}

input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    //  allow the toggling of channel changing
    if (!communicator_data["mode"]["changeChannelMode"]) {
        changeChannelMode()
    } else {
        communicator_data["mode"]["changeChannelMode"] = false
        basic.clearScreen()
    }
    
})
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    if (communicator_data["mode"]["changeChannelMode"]) {
        changeChannelMode(-1)
    } else {
        //  A button is mapped to short sounds. 
        sendMessage(0)
    }
    
})
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    if (communicator_data["mode"]["changeChannelMode"]) {
        changeChannelMode(1)
    } else {
        //  B button is mapped to the longer sound
        sendMessage(1)
    }
    
})
radio.onReceivedNumber(function on_received_number(receivedNumber: number) {
    displayMessage(receivedNumber)
})
