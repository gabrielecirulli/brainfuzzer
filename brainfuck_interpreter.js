function Interpreter(sourceCode) {
  this.sourceCode = sourceCode.replace(/[ \n]/g, "").replace(/[^><+-.,\[\]]/g, ""); // Remove spaces and letters
  this.sourceLength = this.sourceCode.length;
  this.bracketPointers = [];

  this.pointer = 0; // Can't be less than 0
  this.memory = [];
};

Interpreter.prototype.run = function(callback) {
  var output = "";

  if(this.sourceLength > 0) {
    if(this.buildBracketPointers()) {
      output = this.execute();

      if(!output.error) {
        return callback(null, output.output);
      } else {
        return callback({
          codeError: false,
          list: [output.errorMessage]
        }, null);
      }

    } else {
      return callback({
        codeError: true,
        list: ["Some of the brackets aren't properly matched."]
      }, null);
    }
  } else {
    return callback({
      codeError: true,
      list: ["You have inserted no code."]
    }, null);
  }
};

Interpreter.prototype.buildBracketPointers = function() {
  var bracketStack = [],
      currentChar,
      position;

  for(var i = 0; i < this.sourceLength; i++) {
    currentChar = this.sourceCode.charAt(i);

    if(currentChar === "[") {
      bracketStack.push(i);
    } else if(currentChar === "]") {
      position = bracketStack.pop();

      if(typeof position !== "undefined") {
        this.bracketPointers[i] = position;
        this.bracketPointers[position] = i;
      } else {
        return false;
      }
    }
  }

  if(bracketStack.length === 0) {
    return true;
  } else {
    return false;
  }
};

Interpreter.prototype.execute = function() {
  var codePointer = 0,
      output      = "",
      currentChar;

  while(true) {
    currentChar = this.sourceCode.charAt(codePointer);


    switch(currentChar) {
      case ">":
        this.pointer++;
        if(this.pointer > 30000)
          return {
            error: true,
            instruction: ">",
            cell: this.pointer,
            errorMessage: "Illegal attempt to access cell " + this.pointer + "."
          }
        break;
      case "<":
        this.pointer--;
        if(this.pointer < 0)
          return {
            error: true,
            instruction: "<",
            cell: this.pointer,
            errorMessage: "Illegal attempt to access cell " + this.pointer + "."
          }
        break;
      case "+":
        this.memory[this.pointer] = (!!this.memory[this.pointer] ? this.memory[this.pointer] + 1 : 1)
        if(this.memory[this.pointer] > 255)
          return {
            error: true,
            instruction: "+",
            cell: this.pointer,
            errorMessage: "Upper cell value bound trespassed on cell " + this.pointer + "."
          }
        break;
      case "-":
        if(this.memory[this.pointer] === 0 || typeof this.memory[this.pointer] === "undefined")
          return {
            error: true,
            instruction: "-",
            cell: this.pointer,
            errorMessage: "Lower cell value bound trespassed on cell " + this.pointer + "."
          }
        else
          this.memory[this.pointer]--;
        break;
      case ".":
        output += String.fromCharCode(this.memory[this.pointer]);
        break;
      case "[":
        if(!this.memory[this.pointer]) {
          codePointer = this.bracketPointers[codePointer];
        }
        break;
      case "]":
        if(!!this.memory[this.pointer]) { // Byte at data pointer is 0, jump to other
          codePointer = this.bracketPointers[codePointer];
        }
        break;
    }


    codePointer++;

    if(codePointer >= this.sourceLength) {
      break;
    }
  }

  return {
    error: false,
    output: output
  }
};
