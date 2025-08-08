// home.js
document.addEventListener('DOMContentLoaded', function () {
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// home.js
window.addEventListener('scroll', function () {
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
});

document.querySelector('.subscribe button').addEventListener('click', function () {
  const email = document.querySelector('.subscribe input').value;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    alert('Please enter a valid email address.');
  } else {
    alert('Subscribed!');
  }
});


// MAIN
