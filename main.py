
# the communicator data
communicator_data = {
    'radio': {
        'groupID': 1,
        'receivedSignal': 0
    },
    'mode': {
        'changeChannelMode': False
    }
}

def displayMessage(signal, tone = Note.C): 
    """
        Display the message based on the signal received. 

        Parameters: 
            signal: (int) the signal received
        Returns: none
    """

    # Display the initial LEDs. 
    led.plot(2, 2)

    if (signal): 
        # long signal
        # Display the additional plots. 
        for LED_array_x in [1,3]: 
            led.plot(LED_array_x, 2)
        
        music.play_tone(tone, music.beat(BeatFraction.WHOLE))
        
    else: 
        # short signal
        music.play_tone(tone, music.beat(BeatFraction.QUARTER))
        led.unplot(2, 2)
    
    # Unplot after displaying it.
    for LED_array_X in range(1,4):
        led.unplot(LED_array_X, 2)

def on_received_number(receivedNumber):
    displayMessage(receivedNumber)

def sendMessage(signal): 
    """
        Broadcast a message. 

        Parameters: 
            signal: (bool) short or long dot
        Returns: none
    """

    if (signal): 
        # long signal
        radio.send_number(1)
    else: 
        # short signal
        radio.send_number(0)

    displayMessage(signal, Note.A)

def changeChannelMode(adjustIncrement = 0): 
    """
        changeChannelMode allows the changing of radio channels. 

        Parameters: 
            adjustIncrement: (integer) how much to adjust
        Returns: 
            groupID: (integer) the current channel ID
    """

    # Enable the change channel mode. 
    communicator_data['mode']['changeChannelMode'] = True

    if (adjustIncrement):
        if (adjustIncrement >= 1): 
            # increase the selected channel value
            communicator_data['radio']['groupID'] += 1
        elif (adjustIncrement <= -1) and (communicator_data['radio']['groupID'] > 1): 
            # decrease the selected channel value
            communicator_data['radio']['groupID'] = communicator_data['radio']['groupID'] - 1
        
        radio.set_group(communicator_data['radio']['groupID'])
    
    basic.show_number(communicator_data['radio']['groupID'])

def on_button_pressed_ab():
    # allow the toggling of channel changing
    if not(communicator_data['mode']['changeChannelMode']): 
        changeChannelMode()
    
    else: 
        communicator_data['mode']['changeChannelMode'] = False
        basic.clear_screen()

def on_button_pressed_a():
    if (communicator_data['mode']['changeChannelMode']): 
        changeChannelMode(-1)
    else: 
        # A button is mapped to short sounds. 
        sendMessage(0)

def on_button_pressed_b():
    if (communicator_data['mode']['changeChannelMode']):
        changeChannelMode(1)
    else: 
        # B button is mapped to the longer sound
        sendMessage(1)

input.on_button_pressed(Button.AB, on_button_pressed_ab)
input.on_button_pressed(Button.A, on_button_pressed_a)
input.on_button_pressed(Button.B, on_button_pressed_b)

radio.on_received_number(on_received_number)

