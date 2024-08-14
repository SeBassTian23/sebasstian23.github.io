document.addEventListener('DOMContentLoaded', function () {

  // Button Element
  const button = document.createElement('button');

  // Button classes
  button.classList.add('btn', 'btn-sm', 'btn-secondary', 'scroll-up-btn', 'border', 'border-light');

  // Button styles
  button.style.position = 'fixed';
  button.style.bottom = '30px';
  button.style.right = '50px';
  button.style.display = 'none';

  // Create the icon element
  const icon = document.createElement('i');
  icon.classList.add('bi-chevron-up');

  // Append the icon to the button
  button.appendChild(icon);

  // Append the button to the body
  document.body.appendChild(button);

  // Set the role attribute
  button.setAttribute('role', 'scroll');

  button.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', function() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
  
    if(scrolled > 20 || winScroll > window.innerHeight * 1.5){
      //- , transition: background 5s ease
      button.style.display = 'block'
      button.style.animation = 'fade_in_show 0.35s'
    }
    else {
      button.style.display = 'none'
      button.style.animation = 'fade_out_show 0.35s'
    }
  });

});
