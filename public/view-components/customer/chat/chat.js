const openButton = document.getElementById('openButton');
const closeButton = document.getElementById('closeButton');

openButton.addEventListener('click', openForm);
closeButton.addEventListener('click', closeForm);


function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
  function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }