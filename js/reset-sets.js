$("#reset").click(function() {
  if(confirm("Are you sure you want to delete all your word sets and your progress?")){
    localStorage.clear;
    localStorage.setItem("count", 0);
    location.reload();
  }
});