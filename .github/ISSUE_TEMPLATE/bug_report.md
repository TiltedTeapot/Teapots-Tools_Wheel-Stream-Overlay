---
name: Bug report
about: Create a report to help us improve
title: ''
labels: ''
assignees: TiltedTeapot

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Desktop (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Streaming software [e.g. OBS, Streamlabs Desktop, Streamlabs OBS]
 - Overlay Version [e.g. 22]
 - Input Device(s) [e.g. Xbox Controller, Logitech G920]
 - config JSON (found at the top of the overlay HTML file)
    example:
    ```JSON
   {
        "test-mode": true,

        "input-device-ids":
            ["Xbox 360 Controller (XInput STANDARD GAMEPAD)"],

        "wheel-input":
        {
            "input-device-index": 0,
            "input-number": 0,
            "min-value": -1,
            "max-value": 1,
            "max-rotation": 180
        },

        "gear-input":
        {
            "input-device-index": 0,
            "input-numbers": [5, 6, 7, 8],
            "identification-characters": ["R", "1", "2", "3"],
            "neutral-identification-character": "N"
        },

        "clutch-input":
        {
            "input-device-index": 0,
            "input-number": null,
            "min-value": 0,
            "max-value": 1
        },

        "brake-input":
        {
            "input-device-index": 0,
            "input-number": 11,
            "min-value": 0,
            "max-value": 1
        },

        "gas-input":
        {
            "input-device-index": 0,
            "input-number": 12,
            "min-value": 0,
            "max-value": 1
        },

        "handbrake-input":
        {
            "input-device-index": 0,
            "input-number": null,
            "min-value": 0,
            "max-value": 1
        }
    }
    ```

**Additional context**
Add any other context about the problem here.
