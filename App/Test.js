if (JSON.parse(document.getElementById("config").textContent)["test-mode"]) 
{
    window.addEventListener("gamepaddisconnected", (e) => {
        document.getElementById(e.gamepad.id).remove();
    });

    let testModeHeading = document.createElement("h1");
    testModeHeading.textContent = "TEST MODE ENABLED";
    document.body.insertBefore(testModeHeading, document.body.firstChild);

    requestAnimationFrame(updateLayout);
}

function setupLayout(gamepad)
{
    var gamepadElement = document.createElement("div");
    gamepadElement.setAttribute("id", gamepad.id);

    var heading = document.createElement("h2");
    heading.appendChild(document.createTextNode(gamepad.id));
    gamepadElement.appendChild(heading);

    var inputNumberHeading = document.createElement("h3");
    inputNumberHeading.appendChild(document.createTextNode("InputNumber:"));
    gamepadElement.appendChild(inputNumberHeading);

    var inputs = document.createElement("ol");
    for (let i = 0; i < gamepad.axes.length; i++) 
    {
        var axis = document.createElement("li");
        axis.setAttribute("class", `axis`);
        axis.appendChild(document.createTextNode(gamepad.axes[i]));
        
        inputs.appendChild(axis);
    }

    for (let i = 0; i < gamepad.buttons.length; i++) 
    {
        var button = document.createElement("li");
        button.setAttribute("class", `button`);
        button.appendChild(document.createTextNode(gamepad.buttons[i].value + gamepad.axes.length));
        
        inputs.appendChild(button);
    }
    
    gamepadElement.appendChild(inputs);
    document.body.appendChild(gamepadElement);

    return gamepadElement;
}

function updateLayout() 
{
    let connectedGamepads = navigator.getGamepads();
    for (let g = 0; g < connectedGamepads.length; g++)
    {

        let gamepad = connectedGamepads[g];
        if (gamepad != null && gamepad.connected) 
        {
            let gamepadElement = document.getElementById(gamepad.id);

            if (gamepadElement == null) 
            {
                gamepadElement = setupLayout(gamepad);
            }

            let axes = gamepadElement.getElementsByClassName("axis");
            let buttons = gamepadElement.getElementsByClassName("button");

            for(let x = 0; x < gamepad.axes.length; x++)
            {
                axes[x].textContent = gamepad.axes[x];
            }

            for(let b = 0; b < gamepad.buttons.length; b++)
            {
                buttons[b].textContent = gamepad.buttons[b].value
            }
        }
    }

    requestAnimationFrame(updateLayout);
}