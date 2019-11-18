Month = {
  monInt: {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
  },

  getMonStr: function(mon) {
    let monStr = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    return monStr[mon];
  },
  daysInMonth: function(year, mon) {
    let leapYear = 0;

    switch (mon) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
    case 1:
      if ((year % 100) === 0) {
        if ((year % 400) === 0) {
          leapYear = 1;
        }
      } else {
        if ((year % 4) === 0) {
          leapYear = 1;
        }
      }
      return 28 + leapYear;
    default:
      return 30;
    }
  },
  getDaysInMonth: function(date) {
    return Month.daysInMonth(date.getFullYear(), date.getMonth());
  },

  str2int: function(monStr) {
    return Month.monInt[monStr];
  }
}; // Month
