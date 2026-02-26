// AOS.init(); // Removed duplicate initialization
// AOS.init({ duration: 1000, // animation duration in ms 
// easing: 'ease-in-out', // animation easing 
// // once: true, // whether animation should happen only once 
// });

// Prevent auto-scroll on page load
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Ensure page starts at top
window.addEventListener('beforeunload', function() {
  window.scrollTo(0, 0);
});

window.addEventListener('load', function() {
  window.scrollTo(0, 0);
});

function onDomReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }
  callback();
}

let aosInitialized = false;

function revealAOSFallback() {
  document.querySelectorAll('[data-aos]').forEach(function (element) {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
}

function initAOSWhenReady() {
  if (aosInitialized || typeof window.AOS === 'undefined') {
    return aosInitialized;
  }

  window.AOS.init({
    offset: 120,
    duration: 800,
    easing: 'ease-in-out-sine',
    delay: 100,
    once: true,
    mirror: false,
    anchorPlacement: 'top-bottom'
  });

  if (typeof window.AOS.refreshHard === 'function') {
    window.AOS.refreshHard();
  }

  aosInitialized = true;
  return true;
}

onDomReady(function () {
  if (initAOSWhenReady()) return;

  let attempts = 0;
  const maxAttempts = 50;
  const intervalId = window.setInterval(function () {
    attempts += 1;

    if (initAOSWhenReady() || attempts >= maxAttempts) {
      window.clearInterval(intervalId);
      if (!aosInitialized) {
        revealAOSFallback();
      }
    }
  }, 120);
});

window.addEventListener('load', function () {
  if (!aosInitialized && !initAOSWhenReady()) {
    window.setTimeout(function () {
      if (!aosInitialized) {
        revealAOSFallback();
      }
    }, 1200);
  }
}, { once: true });

// Highlight the active navbar link based on scroll position
(function () {
  const navLinks = Array.from(document.querySelectorAll('.navbar-link'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const navbar = document.querySelector('.navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 80;

  function setActiveHash(hash) {
    navLinks.forEach(a => {
      if (a.getAttribute('href') === hash) a.classList.add('active');
      else a.classList.remove('active');
    });
  }

  function updateActiveOnScroll() {
    if (!sections.length) return;
    let closestSection = sections[0];
    let closestDistance = Infinity;

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      // distance from the section top to the navbar bottom area
      const distance = Math.abs(rect.top - navbarHeight);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestSection = sec;
      }
    });

    // If near the top (hero/home) make sure the `#` link becomes active
    if (window.scrollY < 120) {
      setActiveHash('#');
      return;
    }

    if (closestSection && closestSection.id) {
      setActiveHash('#' + closestSection.id);
    }
  }

  // set active on click immediately
  navLinks.forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href') || '#';
      // small timeout to let the browser start the scroll; set active immediately
      setTimeout(() => setActiveHash(href), 10);
    });
  });

  // Update on load, scroll and resize
  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  window.addEventListener('resize', updateActiveOnScroll);
  onDomReady(updateActiveOnScroll);
  // also run after AOS has initialized to account for offsets
  window.addEventListener('load', () => setTimeout(updateActiveOnScroll, 100));
})();

// Hamburger menu functionality
onDomReady(function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  
  // Only setup hamburger menu if elements exist
  if (hamburger && mobileMenu) {
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      
      if (mobileMenu.classList.contains('active')) {
        // Closing menu - let animation finish before hiding
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 1200); // Match the CSS transition duration
      } else {
        // Opening menu - show first, then animate
        mobileMenu.style.display = 'flex';
        // Force reflow to ensure display change is applied before animation
        mobileMenu.offsetHeight;
        setTimeout(() => {
          mobileMenu.classList.add('active');
        }, 10);
      }
    });
    
    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 1200);
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
        if (mobileMenu.classList.contains('active')) {
          hamburger.classList.remove('active');
          mobileMenu.classList.remove('active');
          setTimeout(() => {
            mobileMenu.style.display = 'none';
          }, 1200);
        }
      }
    });
  }
  
  // Team carousel arrows functionality
  const teamCards = document.querySelector('.team-cards');
  const arrows = document.querySelectorAll('.team-wrapper .arrow');
  
  if (teamCards && arrows.length === 2) {
    const leftArrow = arrows[0];
    const rightArrow = arrows[1];
    
    // Calculate scroll amount based on screen size
    function getScrollAmount() {
      const cardWidth = 280; // Updated to match CSS
      const gap = 20;
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1024) {
        // Desktop: scroll 4 cards
        return (cardWidth + gap) * 4;
      } else if (screenWidth >= 768) {
        // Tablet: scroll 3 cards
        return (cardWidth + gap) * 3;
      } else {
        // Mobile: scroll 1 card
        return cardWidth + gap;
      }
    }
    
    // Check if arrows should be visible
    function updateArrowVisibility() {
      // If content fits without scrolling, hide arrows
      if (teamCards.scrollWidth <= teamCards.clientWidth) {
        leftArrow.style.display = 'none';
        rightArrow.style.display = 'none';
      } else {
        leftArrow.style.display = 'flex';
        rightArrow.style.display = 'flex';
      }
    }
    
    // Check on load and resize
    updateArrowVisibility();
    window.addEventListener('resize', updateArrowVisibility);
    
    leftArrow.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const scrollAmount = getScrollAmount();
      console.log('Left arrow clicked, scrolling by:', -scrollAmount);
      console.log('Current scrollLeft:', teamCards.scrollLeft);
      
      // If at the beginning, jump to the end
      if (teamCards.scrollLeft <= 0) {
        teamCards.scrollLeft = teamCards.scrollWidth - teamCards.clientWidth;
      } else {
        teamCards.scrollLeft -= scrollAmount;
      }
    });
    
    rightArrow.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const scrollAmount = getScrollAmount();
      console.log('Right arrow clicked, scrolling by:', scrollAmount);
      console.log('Current scrollLeft:', teamCards.scrollLeft);
      
      // If at the end, jump to the beginning
      if (teamCards.scrollLeft + teamCards.clientWidth >= teamCards.scrollWidth - 10) {
        teamCards.scrollLeft = 0;
      } else {
        teamCards.scrollLeft += scrollAmount;
      }
    });
  } else {
    console.log('Team carousel not initialized. teamCards:', !!teamCards, 'arrows:', arrows.length);
  }

  // Devis Gratuit Modal functionality
  const modal = document.getElementById('devisModal');
  const navbarButton = document.querySelector('.navbar-button');
  const mobileMenuButton = document.querySelector('.mobile-menu-button');
  const closeButton = document.querySelector('.modal-close');
  const devisForm = document.getElementById('devisForm');
  const devisSuccess = document.getElementById('devisSuccess');
  const modalTitle = document.querySelector('.modal-title');
  const modalSubtitle = document.querySelector('.modal-subtitle');

  // Function to open modal
  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  }

  // Function to close modal
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    if (devisSuccess) devisSuccess.classList.remove('active');
    if (devisForm) {
      devisForm.classList.remove('hidden');
      devisForm.reset();
    }
    if (modalTitle) modalTitle.classList.remove('hidden');
    if (modalSubtitle) modalSubtitle.classList.remove('hidden');
  }

  // Open modal when clicking navbar button
  if (navbarButton) {
    navbarButton.addEventListener('click', openModal);
  }

  // Open modal when clicking mobile menu button
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', function() {
      openModal();
      // Close mobile menu if open
      if (mobileMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        setTimeout(() => {
          mobileMenu.style.display = 'none';
        }, 1200);
      }
    });
  }

  // Close modal when clicking X button
  if (closeButton) {
    closeButton.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside the modal container
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Close modal with Escape key
  if (modal) {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // Prevent numbers in the first name field as the user types
  const firstNameInput = document.getElementById('firstName');
  if (firstNameInput) {
    firstNameInput.addEventListener('input', function() {
      const cleaned = this.value.replace(/[0-9]/g, '');
      if (cleaned !== this.value) {
        this.value = cleaned;
      }
    });
  }

  // Prevent numbers in the last name field as the user types
  const lastNameInput = document.getElementById('lastName');
  if (lastNameInput) {
    lastNameInput.addEventListener('input', function() {
      const cleaned = this.value.replace(/[0-9]/g, '');
      if (cleaned !== this.value) {
        this.value = cleaned;
      }
    });
  }

  // Handle form submission
  if (devisForm) {
    devisForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Run native validation to respect patterns/required fields
      if (!devisForm.checkValidity()) {
        devisForm.reportValidity();
        return;
      }

      // Get form values
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const company = document.getElementById('company').value;
      const countryCode = document.getElementById('countryCode').value;
      const phone = document.getElementById('phone').value;
      const fullPhone = countryCode + phone;
      const email = document.getElementById('email').value;
      const message = document.getElementById('message').value;

      // Get submit button and disable it
      const submitButton = devisForm.querySelector('.form-submit-btn');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = 'Envoi en cours...';

      // IMPORTANT: Replace this URL with your own Google Apps Script Web App URL
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyn6AHR-CIohy6qU7uSZeYtmJGdaB93A_a5BD_W7JKhq0s88NfCNe6jxGiHgenRhW8a/exec';
      
      // Prepare form data
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('company', company);
      formData.append('phone', fullPhone);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('timestamp', new Date().toISOString());

      // Prepare form data for internal API
      const leadData = {
        firstName,
        lastName,
        company,
        phone: fullPhone,
        email,
        message,
        timestamp: new Date().toISOString()
      };

      // Send data to internal API (simultaneously)
      fetch('https://get-ads.agency/api/public/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      }).catch(error => console.error('Internal API error:', error));


      // Send data to Google Sheets
      fetch(scriptURL, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Success!', response);
        
        // Show full-screen success message in modal
        if (devisSuccess) {
          devisSuccess.classList.add('active');
        }
        if (modalTitle) modalTitle.classList.add('hidden');
        if (modalSubtitle) modalSubtitle.classList.add('hidden');

        // Hide form and reset fields
        devisForm.classList.add('hidden');
        devisForm.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      })
      .catch(error => {
        console.error('Error!', error.message);
        alert('Une erreur est survenue. Veuillez réessayer ou nous contacter directement.');
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
    });
  }
});

