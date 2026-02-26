// Questionnaire multi-step functionality
let currentStep = 0;
const formData = {};
let currentCurrency = 'MAD';

// Currency mappings
const currencyRanges = {
    'MAD': {
        range1: 'Moins de 5 000 MAD',
        range2: '5 000 – 10 000 MAD',
        range3: '10 000 – 20 000 MAD',
        range4: 'Plus de 20 000 MAD'
    },
    'EUR': {
        range1: 'Moins de 500 €',
        range2: '500 – 1 000 €',
        range3: '1 000 – 2 000 €',
        range4: 'Plus de 2 000 €'
    },
    'USD': {
        range1: 'Moins de 500 $',
        range2: '500 – 1 000 $',
        range3: '1 000 – 2 000 $',
        range4: 'Plus de 2 000 $'
    }
};

// Country code to currency mapping
const countryCurrencyMap = {
    // Euro countries
    '+33': 'EUR',   // France
    '+32': 'EUR',   // Belgium
    '+352': 'EUR',  // Luxembourg
    '+34': 'EUR',   // Spain
    '+39': 'EUR',   // Italy
    '+49': 'EUR',   // Germany
    '+31': 'EUR',   // Netherlands
    '+351': 'EUR',  // Portugal
    '+43': 'EUR',   // Austria
    '+358': 'EUR',  // Finland
    '+30': 'EUR',   // Greece
    // USD countries
    '+1': 'USD',    // USA/Canada
    // MAD (default)
    '+212': 'MAD',  // Morocco
    // All other countries default to USD
};

document.addEventListener('DOMContentLoaded', function() {
    initializeStep(currentStep);
    updateProgressBar();
    detectUserCurrency(); // Detect currency based on IP/location
    setupCurrencyListener();
});

function initializeStep(stepNumber) {
    const steps = document.querySelectorAll('.form-step');
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    
    // Hide all steps
    steps.forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Show current step
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStepElement.style.display = 'block';
    }
    
    // Setup event listeners for current step
    setupStepListeners(currentStepElement);
}

function setupStepListeners(stepElement) {
    if (!stepElement) return;
    
    const optionCards = stepElement.querySelectorAll('.option-card');
    const arrowNext = stepElement.querySelector('.nav-next');
    const arrowPrev = stepElement.querySelector('.nav-prev');
    const contactForm = stepElement.querySelector('.devis-form');
    const budgetSlider = stepElement.querySelector('.budget-slider');
    const errorMessage = stepElement.querySelector('.error-message');
    const btnCommence = stepElement.querySelector('.btn-commence');
    
    // Handle Step 0 commence button
    if (btnCommence) {
        btnCommence.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next-step'));
            if (nextStep) {
                currentStep = nextStep;
                initializeStep(currentStep);
                updateProgressBar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // Handle Step 7 contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }
            
            // Collect contact information (these elements only exist in Step 7)
            const firstNameEl = document.getElementById('firstName');
            const lastNameEl = document.getElementById('lastName');
            const emailEl = document.getElementById('email');
            const countryCodeEl = document.getElementById('countryCode');
            const phoneEl = document.getElementById('phone');
            
            // Check if elements exist before accessing values
            if (!firstNameEl || !lastNameEl || !countryCodeEl || !phoneEl) {
                console.error('Required form elements not found');
                return;
            }
            
            formData.firstName = firstNameEl.value;
            formData.lastName = lastNameEl.value;
            formData.email = emailEl ? emailEl.value : '';
            formData.countryCode = countryCodeEl.value;
            formData.phone = phoneEl.value;
            formData.fullPhone = formData.countryCode + formData.phone;
            
            // Prepare complete submission data
            const submissionData = {
                timestamp: new Date().toISOString(),
                sector: formData.step1 || 'Non renseigné',
                challenge: formData.step2 || 'Non renseigné',
                services: formData.step3 || 'Non renseigné',
                budget: formData.step4 || 'Non renseigné',
                priority: formData.step5 || 'Non renseigné',
                timeline: formData.step6 || 'Non renseigné',
                contact: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.fullPhone
                }
            };
            
            // Submit to Google Sheets
            submitToGoogleSheets(submissionData);
        });
    }
    
    // Handle budget slider (Step 4)
    if (budgetSlider) {
        const labels = stepElement.querySelectorAll('.slider-label');
        
        function updateSlider() {
            const value = parseFloat(budgetSlider.value);
            const percentage = ((value - 1) / 3) * 100;
            
            // Update slider background
            budgetSlider.style.background = `linear-gradient(to right, #6A3BE8 0%, #6A3BE8 ${percentage}%, #3a3a3a ${percentage}%, #3a3a3a 100%)`;
            
            // Update active label based on rounded value
            const roundedValue = Math.round(value);
            labels.forEach((label, index) => {
                if (index === roundedValue - 1) {
                    label.classList.add('active');
                } else {
                    label.classList.remove('active');
                }
            });
        }
        
        budgetSlider.addEventListener('input', updateSlider);
        updateSlider(); // Initialize
    }
    
    // Handle option selection
    optionCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards in this step
            optionCards.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked card
            this.classList.add('selected');
            // Hide error message when user selects an option
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
        });
    });
    
    // Handle previous arrow
    if (arrowPrev) {
        arrowPrev.addEventListener('click', function(e) {
            e.preventDefault();
            const prevStep = parseInt(this.getAttribute('data-prev-step'));
            if (prevStep >= 0) {
                currentStep = prevStep;
                initializeStep(currentStep);
                updateProgressBar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    // Handle next arrow
    if (arrowNext) {
        arrowNext.addEventListener('click', function(e) {
            e.preventDefault();
            
            const stepNum = stepElement.getAttribute('data-step');
            const budgetSlider = stepElement.querySelector('.budget-slider');
            
            // Check if this is the slider step (no validation needed)
            if (budgetSlider) {
                const sliderValue = Math.round(parseFloat(budgetSlider.value));
                const rangeKey = `range${sliderValue}`;
                formData[`step${stepNum}`] = currencyRanges[currentCurrency][rangeKey];
            } else {
                // Get selected option for card-based steps
                const selectedCard = stepElement.querySelector('.option-card.selected');
                
                if (!selectedCard) {
                    // Show error message
                    if (errorMessage) {
                        errorMessage.textContent = 'Veuillez sélectionner une option avant de continuer';
                        errorMessage.style.display = 'block';
                    }
                    return;
                }
                
                formData[`step${stepNum}`] = selectedCard.getAttribute('data-value');
            }
            
            // Move to next step
            const nextStep = parseInt(this.getAttribute('data-next-step'));
            if (nextStep) {
                currentStep = nextStep;8
                initializeStep(currentStep);
                updateProgressBar();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

function updateProgressBar() {
    const progressText = document.querySelector('.progress-text');
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressText) {
        progressText.textContent = `${currentStep} sur 7 étapes`;
    }
    
    // Update progress bar indicators
    progressBars.forEach((bar, index) => {
        if (index < currentStep) {
            bar.classList.add('active');
        } else {
            bar.classList.remove('active');
        }
    });
}

// Detect user's currency based on IP geolocation
async function detectUserCurrency() {
    try {
        // Using ipapi.co free API (no API key needed, 1000 requests/day)
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        let detectedCurrency = 'MAD'; // Default to MAD
        
        // Map country codes to currencies
        const countryCode = data.country_code;
        
        if (countryCode) {
            // Euro zone countries
            const euroCountries = ['FR', 'BE', 'LU', 'ES', 'IT', 'DE', 'NL', 'PT', 'AT', 'FI', 'GR', 
                                   'IE', 'EE', 'LV', 'LT', 'SK', 'SI', 'CY', 'MT'];
            // USD countries
            const usdCountries = ['US', 'CA'];
            // MAD countries
            const madCountries = ['MA'];
            
            if (euroCountries.includes(countryCode)) {
                detectedCurrency = 'EUR';
            } else if (usdCountries.includes(countryCode)) {
                detectedCurrency = 'USD';
            } else if (madCountries.includes(countryCode)) {
                detectedCurrency = 'MAD';
            } else {
                // Default to USD for other countries
                detectedCurrency = 'EUR';
            }
        }
        
        // Update currency and also set the country code dropdown if user hasn't reached step 7
        currentCurrency = detectedCurrency;
        updateSliderCurrency(detectedCurrency);
        
        // Store detected info for later use
        localStorage.setItem('detectedCurrency', detectedCurrency);
        localStorage.setItem('detectedCountryCode', countryCode);
        
        console.log(`Currency detected: ${detectedCurrency} from country: ${countryCode}`);
        
    } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to MAD if geolocation fails
        updateSliderCurrency('MAD');
    }
}

// Currency update function
function updateSliderCurrency(currency) {
    currentCurrency = currency;
    const sliderLabels = document.querySelectorAll('.slider-label');
    
    sliderLabels.forEach(label => {
        const key = label.getAttribute('data-currency-key');
        if (key && currencyRanges[currency] && currencyRanges[currency][key]) {
            label.textContent = currencyRanges[currency][key];
        }
    });
}

// Setup currency change listener
function setupCurrencyListener() {
    const countryCodeSelect = document.getElementById('countryCode');
    if (countryCodeSelect) {
        countryCodeSelect.addEventListener('change', function() {
            const selectedCode = this.value;
            // Get currency for selected country, default to USD if not mapped
            const currency = countryCurrencyMap[selectedCode] || 'USD';
            updateSliderCurrency(currency);
        });
        
        // Set initial currency based on default selection (+212 Morocco)
        const initialCurrency = countryCurrencyMap[countryCodeSelect.value] || 'MAD';
        updateSliderCurrency(initialCurrency);
    }
}

// Google Sheets Integration
function submitToGoogleSheets(submissionData) {
    // REPLACE THIS URL WITH YOUR GOOGLE APPS SCRIPT WEB APP URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbzNrvcLOBstHMez04CK_GmEGoH0HlF7539mWL4ELh999B4MvF6ISSxDnKtL1bGtnveq/exec';
    
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    // Hide the submit button loading state (optional)
    const submitButton = document.querySelector('.form-submit-btn');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Prepare data for Google Sheets
    const formDataToSend = new FormData();
    formDataToSend.append('timestamp', submissionData.timestamp);
    formDataToSend.append('sector', submissionData.sector);
    formDataToSend.append('challenge', submissionData.challenge);
    formDataToSend.append('services', submissionData.services);
    formDataToSend.append('budget', submissionData.budget);
    formDataToSend.append('priority', submissionData.priority);
    formDataToSend.append('timeline', submissionData.timeline);
    formDataToSend.append('firstName', submissionData.contact.firstName);
    formDataToSend.append('lastName', submissionData.contact.lastName);
    formDataToSend.append('email', submissionData.contact.email);
    formDataToSend.append('phone', submissionData.contact.phone);
    
    // Store data in localStorage for results page
    localStorage.setItem('userFirstName', submissionData.contact.firstName);
    localStorage.setItem('userLastName', submissionData.contact.lastName);
    localStorage.setItem('estimationData', JSON.stringify(submissionData));
    

    // Prepare data for internal API
    const leadData = {
        timestamp: submissionData.timestamp,
        sector: submissionData.sector,
        challenge: submissionData.challenge,
        services: submissionData.services,
        budget: submissionData.budget,
        priority: submissionData.priority,
        timeline: submissionData.timeline,
        firstName: submissionData.contact.firstName,
        lastName: submissionData.contact.lastName,
        email: submissionData.contact.email,
        phone: submissionData.contact.phone
    };

    // Send to internal API (simultaneously)
    fetch('https://get-ads.agency/api/public/leads/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
    }).catch(error => console.error('Internal API error:', error));

    // Submit to Google Sheets
    fetch(scriptURL, {
        method: 'POST',
        body: formDataToSend
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        
        // Keep loading overlay visible and redirect to results page
        setTimeout(() => {
            window.location.href = 'resultat';
        }, 1000);
    })
    .catch(error => {
        console.error('Error:', error);
        
        // Hide loading overlay on error
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        
        alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}
