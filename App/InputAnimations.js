class InputData {
    inputDeviceIndex = null;
    gamepadInputNumber = null;

    isMapped = false;
    isAxis = false;

    minValue = 0;
    maxValue = 1;
    inversionAdjustementValue = 1;

    constructor (inputDeviceIndex, configInputNumber, minValue = 0, maxValue = 1) 
    {
        // if (configInputNumber == null || inputDeviceIndex == null) 
        // {
        //     //MAKE THIS RETURN NULL OR SOME SHIT
        // }

        this.inputDeviceIndex = inputDeviceIndex;
        this.gamepadInputNumber = configInputNumber;

        this.minValue = minValue;
        this.maxValue = maxValue;
        this.inversionAdjustementValue = (maxValue + minValue);
    }

    static loadFromJSONObject(inputJSONObject) 
    {
        let inputDeviceIndex = null;
        let jsonInputNumber = null;
        let minValue = 0;
        let maxValue = 1;

        for (const [key, value] of Object.entries(inputJSONObject))
        {
            switch (key) 
            {
                case "input-device-index":
                {
                    inputDeviceIndex = value;
                    break;
                }

                case "input-number":
                {
                    jsonInputNumber = value;
                    break;
                }

                case "min-value":
                {
                    minValue = value;
                    break;
                }

                case "max-value":
                {
                    maxValue = value;
                    break;
                }
            }
        }

        if (inputDeviceIndex == null || jsonInputNumber == null) 
        {
            return null;
        }
        else 
        {
            return new InputData(
                inputDeviceIndex,
                jsonInputNumber,
                minValue,
                maxValue);
        }
    }

    map(gamepads) 
    {
        if (this.isMapped ||
            this.inputDeviceIndex == null || 
            this.gamepadInputNumber == null) 
        {
            return;
        }

        let gamepad = this.inputDeviceIndex < gamepads.length ? 
            gamepads[this.inputDeviceIndex] : 
            null;
            
        if (gamepad == null || gamepad == undefined) 
        {
            return;
        }

        let gamepadAxesLength = gamepad.axes.length;

        this.isAxis = this.gamepadInputNumber < gamepadAxesLength;
        if (!this.isAxis)
        {
            this.gamepadInputNumber -= gamepadAxesLength + 1;
        }

        this.isMapped = true;
    }

    //returns a value between 0 and 1
    getCurrentValue(gamepads) 
    {
        if (this.inputDeviceIndex == null || 
            this.gamepadInputNumber == null || 
            !this.isMapped) 
        {
            return null;
        }

        let gamepad = this.inputDeviceIndex < gamepads.length ? 
            gamepads[this.inputDeviceIndex] : 
            null;

        if (gamepad == null || gamepad == undefined) 
        {
            return null;
        }

        let value = this.isAxis ? 
            gamepad.axes[this.gamepadInputNumber] : 
            gamepad.buttons[this.gamepadInputNumber].value;

        let range = this.maxValue - this.minValue;

        //scales to 0-1 output
        value = (value - this.minValue) * (1 / range);

        // if (this.minValue > this.maxValue) 
        // { 
        //     //inverts value
        //     value = (value * -1) + 1;
        // }

        return value;
    }
}

class GearShifterData {
    inputDeviceIndex = null;

    gearInputData = [];
    identificationCharacters = [];
    neutralIdentificationCharacter = "";

    constructor (inputDeviceIndex, configInputNumbers, identificationCharacters, neutralIdentificationCharacter) 
    {
        // if (inputDeviceIndex == null ||
        //     configInputNumbers == null || 
        //     identificationCharacters == null || 
        //     neutralIdentificationCharacter == null) 
        // {
        //     //MAKE THIS RETURN NULL OR SOME SHIT
        // }

        this.inputDeviceIndex = inputDeviceIndex;
        this.gearInputData = configInputNumbers.map((x) => new InputData(inputDeviceIndex, x));

        this.identificationCharacters = identificationCharacters;
        this.neutralIdentificationCharacter = neutralIdentificationCharacter;
    }

    map(gamepads) 
    {
        this.gearInputData.forEach((x) => x.map(gamepads));
    }


    getCurrentValue(gamepads) 
    {
        if (this.inputDeviceIndex == null)
        {
            return null;
        }

        let gamepad = this.inputDeviceIndex < gamepads.length ? 
            gamepads[this.inputDeviceIndex] : 
            null;

        if (gamepad == null || gamepad == undefined) 
        {
            return null;
        }

        let value = this.neutralIdentificationCharacter;

        let activeGearIndex = this.gearInputData.findIndex(gearInput => gearInput?.getCurrentValue(gamepads) > 0);

        if (activeGearIndex >= 0 && activeGearIndex < this.identificationCharacters.length)
        {
            value = this.identificationCharacters[activeGearIndex];
        }

        return value;
    }
}

//html elements
const config = JSON.parse(document.getElementById("config").textContent);

const root = document.querySelector(":root");

const gearTextElement = document.querySelector("#gear > text");

const clutchGradientFill = document.querySelector("#clutch-svg .petal-fill");
const brakeGradientFill = document.querySelector("#brake-svg .petal-fill");
const gasGradientFill = document.querySelector("#gas-svg .petal-fill");
const handbrakeGradientFill = document.querySelector("#handbrake-svg .petal-fill");


//config data
const trackedGamepadIDs = config["input-device-ids"];
const wheelMaxRotation = config["wheel-input"]["max-rotation"];

//input maps
var wheelInputData = InputData.loadFromJSONObject(config["wheel-input"]);

var gearShifterInputData = new GearShifterData(
    config["gear-input"]["input-device-index"],
    config["gear-input"]["input-numbers"],
    config["gear-input"]["identification-characters"],
    config["gear-input"]["neutral-identification-character"]
);

var clutchInputData = InputData.loadFromJSONObject(config["clutch-input"]);
var brakeInputData = InputData.loadFromJSONObject(config["brake-input"]);
var gasInputData = InputData.loadFromJSONObject(config["gas-input"]);
var handbrakeInputData = InputData.loadFromJSONObject(config["handbrake-input"]);

window.addEventListener("gamepadconnected", (e) => {
    let trackedGamepadIndex = trackedGamepadIDs.findIndex(id => id == e.gamepad.id);
    if (trackedGamepadIndex >= 0)
    {
        gamepads = new Array(trackedGamepadIDs.length);
        gamepads[trackedGamepadIndex] = e.gamepad;

        //TODO: get rid of mapping when there is an Input mapping tool
        wheelInputData?.map(gamepads);
        gearShifterInputData?.map(gamepads);
        clutchInputData?.map(gamepads);
        brakeInputData?.map(gamepads);
        gasInputData?.map(gamepads);
        handbrakeInputData?.map(gamepads);
    }
});

//establishes update loop
requestAnimationFrame(updateOverlay);

function updateOverlay() 
{
    let navigatorGamepads = navigator.getGamepads();

    let trackedGamepads = trackedGamepadIDs.map(trackedID => navigatorGamepads.find(gp => gp?.id == trackedID));


    let wheelValue = wheelInputData?.getCurrentValue(trackedGamepads);
    if (wheelValue != null)
    {
        wheelValue = (wheelValue - 0.5) * 2;
        root.style.setProperty("--wheel-rotation", `${wheelValue * wheelMaxRotation}deg`);
    }

    let gearValue = gearShifterInputData?.getCurrentValue(trackedGamepads);
    if (gearValue != null) 
    {
        gearTextElement.textContent = gearValue;
    }

    let clutchValue = clutchInputData?.getCurrentValue(trackedGamepads);
    if (clutchValue != null)
    {
        clutchGradientFill.setAttribute("offset", clutchValue);
    }

    let brakeValue = brakeInputData?.getCurrentValue(trackedGamepads);
    if (brakeValue != null)
    {
        brakeGradientFill.setAttribute("offset", brakeValue);
    }

    let gasValue = gasInputData?.getCurrentValue(trackedGamepads);
    if (gasValue != null)
    {
        gasGradientFill.setAttribute("offset", gasValue);
    }

    let handbrakeValue = handbrakeInputData?.getCurrentValue(trackedGamepads);
    if (handbrakeValue != null)
    {
        handbrakeGradientFill.setAttribute("offset", handbrakeValue);
    }

    requestAnimationFrame(updateOverlay);
}