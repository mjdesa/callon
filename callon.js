var fs = require('fs');
var data = require('./students');

//CallOn Object constructor
function CallOn(obj, opts) {
  this.data = obj
  this.data.timesCalled = this.data.timesCalled;
  this.students = Object.keys(this.data);
  this.options = opts;
}

CallOn.prototype.run = function() {
  // TODO: MONITOR STATISTICS RELATED ON WHO'S BEEN CALLED
  //       OR GROUPED TOGETHER.
  console.log(this.options);
  if (!!this.options) {
    return this.runOpt(this.options[0]);
  } else {
    return this.runOpt();
  }
};

CallOn.prototype.runOpt = function(opt) {
  //TODO: ADD STATS OPTION THAT OUTPUTS STATS RELATED TO
  //      THE NUMBER OF TIMES SOMEONE WAS CALLED

  switch (opt) {
    case '-groups':
      return this.groupsOf(3);
    case '-g':
      return this.runOpt('-groups');
    case '-pairs':
      return this.groupsOf(2);
    case '-p':
      return this.runOpt('-pairs');
    default:
      return this.callon();
  }
};

//takes a variable that specifies group size and outputs random groups of that size
CallOn.prototype.groupsOf = function(groupSize) {
  var numberOfGroups = Math.ceil(this.students.length / groupSize);
  var groups = {};

  //helper function that assigns a person to a group randomly
  var assign = function(person) {
    var groupNum = Math.floor(numberOfGroups * Math.random());
    var group = groups[groupNum] || [];
    switch (true) {
      case group.length === 0:
        return groupNum;
      case (group.length === groupSize):
        return assign(person);
      case  (person in group):
        return assign(person);
      default:
        return groupNum;
    }
  };

  this.students.forEach(function(student) {
    var assignedNum = assign(student);
    var assignedGroup = groups[assignedNum] || [];
    assignedGroup.push(student);
    groups[assignedNum] = assignedGroup;
  });

  return groups;
};

//Method to determine whether someone should be called on or not
CallOn.prototype.shouldCallon = function(student) {
  var studentTimesCalled =this.data[student].called; 
  var totalTimesCalled = 0;
  for (var i in this.data) {
    totalTimesCalled += this.data[student].called;
  }
  var average = totalTimesCalled/this.students.length;
  console.log(this.students.length-1);
  console.log("AVERAGE:", average);
  console.log("STUDENT:", studentTimesCalled);
  console.log("\n\n\n\n\n");
  return studentTimesCalled > average;
};

//returns person as a string
CallOn.prototype.callon = function() {
  var index = Math.floor(Math.random() * this.students.length);
  var person = this.students[index];
  if (!this.shouldCallon(person)) {
    //Increment the number of times someone has been called on
    this.data.timesCalled += 1;
    this.data[person].called += 1;
    this.write();
    return person;
  } else {
    return this.callon();
  }
};

// Class method that saves the file 
CallOn.prototype.write = function() {
  var file = JSON.stringify(this.data);
  console.log(file)
  fs.writeFile('students.json', file, function(err) {
    if (err) console.log(err);
    console.log('DONE');
  });
};

module.exports = CallOn;
