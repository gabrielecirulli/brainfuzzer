document.addEventListener("DOMContentLoaded", function() {
  var runButton       = document.getElementById("startButton"),
      sourceField     = document.getElementById("source"),
      outputField     = document.getElementById("output"),
      errorList       = document.getElementById("errorList"),
      errorContainer  = errorList.parentNode,
      codeError       = document.getElementsByClassName("codeError")[0],
      executionError  = document.getElementsByClassName("executionError")[0],
      infoNotice      = document.getElementById("infoNotice"),
      noticeContainer = infoNotice.parentNode;

  runButton.addEventListener("click", function() {
    var interpreter = new Interpreter(sourceField.value);

    interpreter.run(function(error, output) {
      errorContainer.hide();
      codeError.hide();
      executionError.hide();
      noticeContainer.hide();

      outputField.value = "";

      if(!error) {
        infoNotice.innerText = "Execution completed successfully.";
        noticeContainer.show();
        outputField.value = output;
      } else {
        if(error.codeError) {
          codeError.show();
          executionError.hide();
        } else {
          codeError.hide();
          executionError.show();
        }

        errorList.innerHTML = "";

        for(var i = 0; i < error.list.length; i++) {
          var errorItem = document.createElement("li");
          errorItem.innerText = error.list[i];
          errorList.appendChild(errorItem);
        }

        errorContainer.show();
      }
    });
  });
});

// Utility stuff
HTMLElement.prototype.hide = function() {
  this.style.display = "none";
}

HTMLElement.prototype.show = function() {
  this.style.display = "block";
}
