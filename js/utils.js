(function (dependents) {
  var { Thirteen } = dependents;
  
  var getDom = (selector) => {
    return document.querySelector(selector);
  };

  Thirteen.utils = {
    getDom
  };

})({
  Thirteen
})