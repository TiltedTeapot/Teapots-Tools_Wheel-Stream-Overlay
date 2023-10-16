# Teapots Tools: Wheel Stream Overlay
This stream overlay is a browser source for OBS (Open Broadcast Software) that displays the inputs of your racing wheel/rig to your stream viewers. The app runs using HTML5, CSS, JavaScript, and SVG. The inputs are recorded using Direct Input and will require setup to map the inputs of each unique setup to the display. This overlay supports easy customization of colors and layout without requiring extensive web development knowledge, and advanced graphics customization using the SVG standard.

## Download & Installation 
Follow these steps to get your overlay working

1. Download the latest release of the overlay.
2. Unzip the contents to a safe location.

### Setup Inputs (requires a modern browser and text editor)
> [!IMPORTANT]
> Make sure your wheel and other peripherals are plugged in.
3. Open "InputDisplay.html" in your browser.
4. Open "Index.html" in a text editor. 
5. While moving your desired input you'd like to map take note of:
    1. which input device (header) the changing value falls under.
    2. which input number (left) correlates to the changing value (right).
        > **Gear Shifter:** *In the case of the gear shifter you will likely see multiple input numbers with changing values, note which input number has a value of 1 for each gear. skip to step 6.*
    3. What the minimum value is rounded down to the nearest 10th (*fully released or full left rotation of the wheel*).
    4. What the maximum value is rounded up to the nearest 10th (*fully pressed or full right rotation of the wheel*).
6. If you haven't already added the device found in step 6.4, In the text editor find **`input-device-ids`** on line 7 and add it. see examples below:
    > [!WARNING]
    > Make sure not to delete commas, quotes, or brackets.

    *One device:*
    ```json
        "input-device-ids":
                ["1st device"],
    ```
    *Three devices:*
    ```json
        "input-device-ids":
                ["1st device",
                "2nd device",
                "3rd device"],
    ```
7. In the text editor find the input you are trying to map (it will end with `-input`) and change the following values:
    > [!WARNING]
    > Make sure not to delete commas, quotes, or brackets.
    1. "input-device-index": "*the zero-based index[^1] of device in the list from step 6*"
        > **Gear Shifter:** *For the gear shifter skip to step 7.5.*
    2. `"input-number":` "*the input number found in step 5.2*"
    3. `"min-value":` "*the minimum value found in step 5.3*"
    4. `"max-value":` "*the maximum value found in step 5.4*"
    5. **Gear shifter Only** `"input-numbers":` [*the input number for reverse, input number for 1st, input number for 2nd, etc...*] (*input numbers found in step 5.2*).
    6. **Gear shifter Only** `"identification-characters":` [*"R", "1", "2", etc...*] (*these character is what is displayed when the associated input above is detected*).
8. Repeat steps 5-7 for each input device you'd like to map.
9. **Save "Index.html"** and close the text editor.
10. Open/refresh "Index.html" in your browser and use all your mapped inputs to make sure the overlay responds accordingly. If the overlay does not respond to your inputs correctly, repeat steps 3-10. If that doesn't work please report an Issue via github.


### Integration into OBS
11. Add a "browser source" to your scene in OBS.
12. Open your new browser source's properties.
13. Turn on the local file option and use the file path for the "Index.html" file you saved in step 9.
14. Set your desired width and height.
15. Close properties.
16. You should now have a functioning stream overlay for your racing inputs.

## Modifications

### Colors

### Layout

### Advanced

[^1]: Zero-based indexing means start counting from zero, therefore the 1st entry in a list is index 0 and the second is index 1 and so on... .