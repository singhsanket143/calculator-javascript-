$(function() {
  'use strict';
  var expressionCode = '';
  var expDisplay = '';
  var expElement = $('.top-row');
  var ans;
  var justEvaluated = false;

  var numBtns = {
    "n0": "0",
    "n1": "1",
    "n2": "2",
    "n3": "3",
    "n4": "4",
    "n5": "5",
    "n6": "6",
    "n7": "7",
    "n8": "8",
    "n9": "9",
  };

  var opBtns = {
    "plus": ["+", " + "],
    "divide": ["/", " &divide; "],
    "times": ["*", " &times; "]
  };

  var btns = {
    "minus": ["-", " - "],
    "ans": [ans, "Ans"],
    "dot": [".", "."],
    "open": ["(", " ("],
    "close": [")", ") "],

    "equals": " ",
    "ce": " ",
    "ac": " "
  };

  function CalcBtn(elementId, pressFunc, value, displayVal) {
    this.value = value;
    this.displayVal = displayVal || value;
    this.element = document.getElementById(elementId);
    this.element.addEventListener('click', pressFunc.bind(this));
  }

  
  /* functions for button press actions */

  var press = function() {
    // if just evaluated, clear current expression
    if (justEvaluated) {
      expressionCode = '';
      expDisplay = '';
      justEvaluated = false;
    }
    // add value to expression and update in DOM
    expressionCode += this.value;
    expDisplay += this.displayVal;
    expElement.html(expDisplay);
  };

  var pressMinus = function() {
    // only add if last value is not '-'
    if (!/\-$/.test(expressionCode)) {
      // if expression was just evaluated, add ans value to new expression first
      if (justEvaluated) {
        expressionCode = btns.ans.value;
        expDisplay = btns.ans.displayVal;
        expElement.html(expDisplay);
        justEvaluated = false;
      }
      press.call(this);
    }
  };

  var pressOperator = function() {
    // only add if expression is not blank and previous value is not an operator
    if (!!expressionCode && !/[+\-*\/(]$/.test(expressionCode)) {
      pressMinus.call(this);   // resue function for minus button
    }
  };


  var pressDot = function() {
    // only add if there no decimal in the last number
    if (!/\d*\.\d*$/.test(expressionCode)) {
      press.call(this);
    }
  };

  var pressOpenP = function() {
    // if open paren is pressed after a number, add * in between
    if (/\d$/.test(expressionCode)) {
      expressionCode += '*';
      expDisplay += ' &times; ';
      expElement.html(expDisplay);
    }
    press.call(this);
  };

  var pressCloseP = function() {
    // only add if there is aready an open paren in the expression
    if (/\(/.test(expressionCode)) {
      press.call(this);
    }
  };

  var pressAns = function() {
    // only add if answer has been stored and last value is not a '.'
    if (this.value !== undefined && !/\.$/.test(expressionCode)) {
      // if pressed after a number, add * in between
      pressOpenP.call(this);   // reuse function from open paren button
    }
  };

  var evaluate = function() {
    var evaluated;
    // remove starting '0's
    while (expressionCode[0] === '0') {
      expressionCode = expressionCode.slice(1);
    }
    // if there is only an open paren, add a closed paren at end
    if (/\(/.test(expressionCode) && !/\)/.test(expressionCode)) {
      expressionCode += ')';
      expDisplay += ') ';
      expElement.html(expDisplay);
    }
    // evaluate expression, printing 'error' if error occurs
    try {
      evaluated = eval(expressionCode);
      btns.ans.value = evaluated;
    }
    catch(e) {
      evaluated = 'error';
    }
    finally {
      $('.bottom-row').html(evaluated);
      justEvaluated = true;
    }
  };
  
  function getTanFromDegrees(degrees) {
    return Math.tan(degrees * Math.PI/180);
  }


  var clearEntry = function() {
    // delete last character entered
    // make sure correct length is removed from display string
    if (/Ans$/.test(expDisplay)) {
      expDisplay = expDisplay.slice(0, expDisplay.length - 3);
      expressionCode = expressionCode.slice(0, expressionCode.length -
          btns.ans.value.toString().length);
    }
    else {
      if (/[a\d.]$/.test(expressionCode)) {
        expDisplay = expDisplay.slice(0, expDisplay.length - 1);
      }
      else if (/[+\-]$/.test(expressionCode)) {
        expDisplay = expDisplay.slice(0, expDisplay.length - 3);
      }
      else if (/[*]$/.test(expressionCode)) {
        expDisplay = expDisplay.slice(0, expDisplay.length - 9);
      }
      else if (/[\/]$/.test(expressionCode)) {
        expDisplay = expDisplay.slice(0, expDisplay.length - 10);
      }
      else if (/[()]$/.test(expressionCode)) {
        expDisplay = expDisplay.slice(0, expDisplay.length - 2);
      }
      expressionCode = expressionCode.slice(0, expressionCode.length - 1);
    }
    // update display in DOM
    expElement.html(expDisplay);
    justEvaluated = false;
  };

  var allClear = function() {
    // clear expression code and both display rows
    expressionCode = '';
    expDisplay = '';
    expElement.empty();
    $('.bottom-row').empty();
    justEvaluated = false;
  };

  
  /* create calculator button objects */

  for (var i in numBtns) {
    numBtns[i] = new CalcBtn(i, press, numBtns[i]);
  }

  for (var j in opBtns) {
    opBtns[j] = new CalcBtn(j, pressOperator, opBtns[j][0], opBtns[j][1]);
  }

  btns.minus = new CalcBtn("minus", pressMinus, btns.minus[0], btns.minus[1]);
  btns.dot = new CalcBtn("dot", pressDot, btns.dot[0]);
  btns.equals = new CalcBtn("equals", evaluate, btns.equals);
  btns.ce = new CalcBtn("ce", clearEntry, btns.ce);
  btns.ac = new CalcBtn("ac", allClear, btns.ac);
  btns.ans = new CalcBtn("ans", pressAns, btns.ans[0], btns.ans[1]);
  btns.open = new CalcBtn("open", pressOpenP, btns.open[0], btns.open[1]);
  btns.close = new CalcBtn("close", pressCloseP, btns.close[0], btns.close[1]);

});
