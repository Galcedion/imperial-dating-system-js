/**
 * Convert modern datetime to the Warhammer 40,000 imperial dating system.
 * 
 * @param tstmp       The timestamp from which the date will be constructed.
 * @param checkNumber The check number for the imperial date to use.
 * 
 * @return The imperial date as a string (or false if an error occours).
 */
function imperialDatingSystem(tstmp = Date.now(), checkNumber = 0) {

	/**
	 * Check if the year is a leap year
	 * 
	 * Using the rules of the gregorian calendar it is checked if a given year is a leap year or not.
	 * 
	 * @param givenYear The 4-digit year to check.
	 * 
	 * @return Is the year a leap year (true or false).
	 */
	function isLeapYear(givenYear) {
		return (givenYear % 4 === 0 && (givenYear % 100 !== 0 || givenYear % 400 === 0)) ? true : false;
	}

	if(typeof(tstmp) != 'number')
		return false;
	var date40k; /** the date that will be constructed and returned */
	var givenDate = new Date(tstmp);
	var givenYear = givenDate.getFullYear();

	var givenM = Math.floor(givenYear / 1000); /** millenium */
	var givenMFraction = givenYear % 1000; /** millenium "fraction" in years (3 digits before the dot) */
	if (givenMFraction != 0)
		++givenM;
	givenMFraction = givenMFraction.toString().padStart(3, 0);

	var tmpYearBeginTstmp = new Date(givenDate.getFullYear(), 0, 1).getTime() / 1000;
	var tmpYearBeginDiff = (givenDate.getTime() / 1000 - tmpYearBeginTstmp) / 60 / 60;
	var tmpYearHours = (isLeapYear(givenYear) ? 366 : 365) * 24; /** year fraction in hours (3 digits after check number) */

	var givenYearFraction = ((Math.floor((tmpYearBeginDiff) / (tmpYearHours / 1000)) + 1) % 1000).toString().padStart(3, 0);

	date40k = `${checkNumber} ${givenYearFraction} ${givenMFraction}.M${givenM}`;

	return date40k;
}