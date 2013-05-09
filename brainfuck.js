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
      errorContainer.style.display = "none";
      codeError.style.display = "none";
      executionError.style.display = "none";
      noticeContainer.style.display = "none";

      outputField.value = "";

      if(!error) {
        infoNotice.innerText = "Execution completed successfully.";
        noticeContainer.style.display = "block";
        outputField.value = output;
      } else {
        if(error.codeError) {
          codeError.style.display = "block";
          executionError.style.display = "none";
        } else {
          codeError.style.display = "none";
          executionError.style.display = "block";
        }

        errorList.innerHTML = "";

        for(var i = 0; i < error.list.length; i++) {
          var errorItem = document.createElement("li");
          errorItem.innerText = error.list[i];
          errorList.appendChild(errorItem);
        }

        errorContainer.style.display = "block";
      }
    });
  });
});


