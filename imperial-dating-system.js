/**
 * Convert modern datetime to the Warhammer 40,000 imperial dating system.
 *
 * @param tstmp       The timestamp or date object from which the imperial date will be constructed.
 * @param checkNumber The check number for the imperial date to use.
 * @param simpleYear  If the date should be calculated from common (leap) years or the actual true year.
 * @param compact     Whether the output should be clear of whitespaces or not.
 *
 * @return The imperial date as a string (or false if an error occours).
 */
function idsModernToImperial(tstmp = Date.now(), checkNumber = 0, simpleYear = true, compact = false) {

	/**
	 * Check if the year is a leap year
	 *
	 * Using the rules of the Gregorian calendar it is checked if a given year is a leap year or not.
	 *
	 * @param givenYear The 4-digit year to check.
	 *
	 * @return Is the year a leap year (true or false).
	 */
	function isLeapYear(givenYear) {
		return (givenYear % 4 === 0 && (givenYear % 100 !== 0 || givenYear % 400 === 0)) ? true : false;
	}

	/**
	 * Get the current year fraction.
	 *
	 * Calculates the year fraction based on either the calendrical (adding an additional day for leap years) or sidereal year.
	 *
	 * @param givenDate The Date object containing the display time.
	 * @param givenDate If the fraction is based on a simple year or a sidereal year.
	 *
	 * @return Year fraction as a string.
	 */
	function getYearFraction(givenDate, simpleYear) {
		var tmpYearBeginTstmp = new Date(givenDate.getFullYear(), 0, 1).getTime() / 1000;
		var tmpYearBeginDiff = (givenDate.getTime() / 1000 - tmpYearBeginTstmp) / 60 / 60;
		if(simpleYear)
			var tmpYearHours = (isLeapYear(givenDate.getFullYear()) ? 366 : 365) * 24; /** year fraction in hours */
		else
			var tmpYearHours = (((365 * 24 + 6) * 60 + 9) * 60 + 9.76) / 60 / 60; /** year fraction in hours */ // a sidereal year has 365d 6h 9m 9.76s

		return ((Math.floor((tmpYearBeginDiff) / (tmpYearHours / 1000)) + 1) % 1000).toString().padStart(3, 0);
	}

	/**
	 * Adjusts the given date object to the time passed in sidereal.
	 *
	 * Adjusting the date by the time difference between the Gregorian calendar and the sidereal year, eliminating leap years.
	 * Counting from 0 AD (full year steps).
	 *
	 * The source of the duration of a sidereal year can be found here: https://hpiers.obspm.fr/eop-pc/index.php?index=constants&lang=en
	 * (https://web.archive.org/web/20230927173232/https://hpiers.obspm.fr/eop-pc/index.php?index=constants&lang=en)
	 *
	 * @param givenDate The Date object containing the display time.
	 */
	function adjustDateToSidereal(givenDate) {
		var tmpYearHours = (((365 * 24 + 6) * 60 + 9) * 60 + 9.76) / 60 / 60; /** year fraction in hours */ // a sidereal year has 365d 6h 9m 9.76s
		var tmpYearDiff = 0;
		for(let i = 0; i < givenDate.getFullYear(); i++) {
			var iGregorianYearHours = (365 + (isLeapYear(i) ? 1 : 0)) * 24;
			tmpYearDiff += iGregorianYearHours  - tmpYearHours;
		}
		givenDate.setHours(givenDate.getHours() + tmpYearDiff);
	}

	/* attempt to create the incoming date from different formats and return false if unable */
	if(tstmp instanceof Date)
		var givenDate = tstmp;
	else if(!isNaN(tstmp) && tstmp.toString().length >= 10) {
		if(tstmp.toString().length == 10)
			tstmp = tstmp.toString() + '000';
		var givenDate = new Date(parseInt(tstmp));
	}
	else
		return false;

	/* validating checkNumber */
	if(typeof(checkNumber) != 'number')
		return false;
	else if(checkNumber > 9)
		checkNumber = 9;
	else if(checkNumber < 0)
		checkNumber = 0;

	/* validating simpleYear */
	if(typeof(simpleYear) != 'boolean')
		return false;

	/* validating compact */
	if(typeof(compact) != 'boolean')
		return false;

	/** adjusting date for sidereal calculation **/
	if(!simpleYear)
		adjustDateToSidereal(givenDate);

	var givenYear = givenDate.getFullYear();
	var givenM = Math.floor(givenYear / 1000); /** millenium */
	var givenMFraction = givenYear % 1000; /** millenium "fraction" in years (3 digits before the dot) */
	if (givenMFraction != 0)
		++givenM;
	givenMFraction = givenMFraction.toString().padStart(3, 0);

	/** create year fraction (3 digits after check number) */
	var givenYearFraction = getYearFraction(givenDate, simpleYear);

	/** returning a constructed date */
	if(compact)
		return `${checkNumber}${givenYearFraction}${givenMFraction}.M${givenM}`;
	else
		return `${checkNumber} ${givenYearFraction} ${givenMFraction}.M${givenM}`;
}

/**
 * Convert a Warhammer 40,000 date from imperial dating system to a modern datetime.
 *
 * @param ids           The imperial date from which the datetime will be constructed.
 * @param giveTstmp     If true, the return value is an integer timestamp (in ms), otherwise a Date object is returned.
 * @param siderealGiven If true, the input date is sidereal. (output is still a calendric date)
 *
 * @return The timestamp or Date object of the date (or false if an error occours).
 */
function idsImperialToModern(ids, giveTstmp = true, siderealGiven = false) {

	/**
	 * Check if the year is a leap year
	 *
	 * Using the rules of the Gregorian calendar it is checked if a given year is a leap year or not.
	 *
	 * @param givenYear The 4-digit year to check.
	 *
	 * @return Is the year a leap year (true or false).
	 */
	function isLeapYear(givenYear) {
		return (givenYear % 4 === 0 && (givenYear % 100 !== 0 || givenYear % 400 === 0)) ? true : false;
	}

	/**
	 * Get the difference from the sidereal to calendar time.
	 *
	 * Gets the time difference between the sidereal year and the Gregorian calendar, adjusting for leap years.
	 * Counting from 0 AD (full year steps).
	 *
	 * The source of the duration of a sidereal year can be found here: https://hpiers.obspm.fr/eop-pc/index.php?index=constants&lang=en
	 * (https://web.archive.org/web/20230927173232/https://hpiers.obspm.fr/eop-pc/index.php?index=constants&lang=en)
	 *
	 * @param givenYear The Imperial year.
	 *
	 * @return The difference between sidereal and Gregorian in hours.
	 */
	function getSiderealCalendaricalDifference(givenYear) {
		var tmpYearHours = (((365 * 24 + 6) * 60 + 9) * 60 + 9.76) / 60 / 60; /** year fraction in hours */ // a sidereal year has 365d 6h 9m 9.76s
		var tmpYearDiff = 0;
		for(let i = 0; i < givenYear; i++) {
			var iGregorianYearHours = (365 + (isLeapYear(i) ? 1 : 0)) * 24;
			tmpYearDiff += tmpYearHours - iGregorianYearHours;
		}
		return tmpYearDiff;
	}

	/* validating Imperial date */
	ids = ids.toString().trim().replace(/ /g, '').replace(/\./g, '');
	if(!ids.match(/^\d{7}M\d+$/))
		return false;

	/* validating giveTstmp */
	if(typeof(giveTstmp) != 'boolean')
		return false;

	/* validating siderealGiven */
	if(typeof(siderealGiven) != 'boolean')
		return false;

	var givenYearFraction = parseInt(ids.slice(1, 4));
	var givenMFraction = parseInt(ids.slice(4, 7));
	var givenM = parseInt(ids.slice(8)) - 1;
	if (givenMFraction == 0)
		++givenM;
	var givenYear = givenM * 1000 + givenMFraction; /** year */

	/** calculate the seconds passed since the year began */
	if(siderealGiven)
		var tmpYearSeconds = ((365 * 24 + 6) * 60 + 9) * 60 + 9.76;
	else
		var tmpYearSeconds = (isLeapYear(givenYear) ? 366 : 365) * 24 * 60 * 60;
	var tmpElapsedSeconds = (givenYearFraction == 0) ? tmpYearSeconds : tmpYearSeconds / 1000 * givenYearFraction;

	var modernDate = new Date(0); /** the date that will be constructed and returned */
	modernDate.setFullYear(givenYear);
	modernDate.setSeconds(tmpElapsedSeconds); /** there is no need to calculate the exact date, JS does that for us */
	if(siderealGiven)
		modernDate.setHours(modernDate.getHours() + getSiderealCalendaricalDifference(givenYear));

	return giveTstmp ? modernDate.valueOf() : modernDate;
}