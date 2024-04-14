# imperial-dating-system-js

This is a JavaScript converter for the Warhammer 40,000 Imperial Dating System, allowing for a conversion from the currently used timestamps to the Imperial Dating System and from the Imperial Dating System to currently used timestamps.

It is based on the detailed explanation found on [https://warhammer40k.fandom.com/wiki/Imperial_Dating_System](https://warhammer40k.fandom.com/wiki/Imperial_Dating_System), thanks to the guys over there for the information on the IDS!

(Archive: [https://web.archive.org/web/20240121133546/https://warhammer40k.fandom.com/wiki/Imperial_Dating_System](https://web.archive.org/web/20240121133546/https://warhammer40k.fandom.com/wiki/Imperial_Dating_System))

## Installation

1. Download the JavaScript file from GitHub.
```bash
wget https://raw.githubusercontent.com/Galcedion/imperial-dating-system-js/master/imperial-dating-system.js
```
2. Load the file into your website.
```xml
<script type="text/javascript" src="imperial-dating-system.js"></script>
```

## Usage

To use imperial-dating-system-js, call the required function in your own JavaScript code.
```javascript
idsModernToImperial();    // Convert from modern timestamp formats to Imperial Dating System
idsImperialToModern(ids); // Convert from Imperial Dating System to modern timestamps
```

### Parameters

Parameters for idsModernToImperial:
```
tstmp       - A timestamp or Date object with the modern Gregorian date to convert. Default: NOW
checkNumber - The Check Number for the converted date to display. For an explanation of the Check Number please refer to the section below. Default: 0
simpleYear  - Whether the calculation should be done by the regular calendrical year or on basis of the sidereal year. Default: true (=> calendrical)
compact     - Whether the output date should be formatted without whitespace or not. Added for readability. Default: false (=> with whitespaces)
```

Parameters for idsImperialToModern:
```
ids       - Imperial date to convert. Must be provided!
giveTstmp - Whether the output format should be an integer timestamp (in milliseconds) or a Date object. Default: true (=> timestamp)
```

### Output

Output for idsModernToImperial:

Imperial Dating System date as string OR boolean false if an error occurred


Output for idsImperialToModern:

A timestamp number or Date object OR boolean false if an error occurred

### Check Number

The Check Number measures the accuracy of the given date in relation to a central clock on Terra. The classification is as follows:
```
0 - user is on planet Earth (Terra)
1 - user is within the solar system (Sol System)
2 - user is in direct contact with the solar system
3 - user is in direct contact with a class 2 clock
4 - user is in direct contact with a class 3 clock
5 - user is in direct contact with a class 4 clock
6 - user is not in direct contact with a class 0 - 5 clock and the estimated time variation is +- 1 year
7 - user is not in direct contact with a class 0 - 5 clock and the estimated time variation is +- 10 years
8 - user is not in direct contact with a class 0 - 5 clock and the estimated time variation is greater than +- 10 years
9 - user has only a general approximation (e.g. due to different calendar systems)
```

## License

[The Unlicense](https://unlicense.org/)