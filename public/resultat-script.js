// Results page functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Display user's name
    displayUserName();
    
    // Smooth scroll for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // CTA Button Actions
    const primaryBtn = document.querySelector('.cta-btn-primary');
    const secondaryBtn = document.querySelector('.cta-btn-secondary');

    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            // Redirect to booking page or open modal
            console.log('WhatsApp clicked');
            // window.location.href = 'booking.html';
            window.open(`https://api.whatsapp.com/message/TM6GNBIGFXI6G1`, '_blank');
        });
    }

    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            // Open WhatsApp
            console.log('WhatsApp clicked');
            window.open(`https://api.whatsapp.com/message/TM6GNBIGFXI6G1`, '_blank');
        });
    }

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.estimation-card, .cta-section, .trust-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Retrieve data from localStorage or URL parameters
    function loadEstimationData() {
        // Check if data is stored from questionnaire
        const estimationData = localStorage.getItem('estimationData');
        
        if (estimationData) {
            try {
                const data = JSON.parse(estimationData);
                console.log('📊 Données du questionnaire:', data);
                updatePageWithData(data);
            } catch (e) {
                console.error('Error parsing estimation data:', e);
            }
        } else {
            console.log('⚠️ Aucune donnée trouvée dans localStorage');
        }
    }

    function updatePageWithData(data) {
        // Update sector
        if (data.sector) {
            const sectorEl = document.querySelector('.pack-item:nth-child(2) .pack-value');
            if (sectorEl) {
                sectorEl.textContent = formatSectorName(data.sector);
            }
        }

        // Update objective (from challenge)
        if (data.challenge) {
            const objectiveEl = document.querySelector('.pack-item:nth-child(3) .pack-value');
            if (objectiveEl) {
                objectiveEl.textContent = formatChallengeName(data.challenge);
            }
        }

        // Update pack name (based on priority and services)
        const packName = determinePackName(data);
        const packNameEl = document.querySelector('.pack-item:nth-child(1) .pack-value');
        if (packNameEl) {
            packNameEl.textContent = packName;
        }

        // Update price range based on budget
        if (data.budget) {
            const priceRange = calculatePriceRange(data.budget, data.services);
            const priceRangeEl = document.querySelector('.price-range');
            if (priceRangeEl) {
                priceRangeEl.textContent = priceRange;
            }
        }

        // Update pack description based on sector and challenge
        const packDescription = generatePackDescription(data);
        const packDescEl = document.querySelector('.pack-description');
        if (packDescEl) {
            packDescEl.textContent = packDescription;
        }

        // Update recommendations based on priority
        if (data.priority) {
            updateRecommendations(data.priority);
        }
    }

    // Helper function to format sector names
    function formatSectorName(sector) {
        const sectorMap = {
            'restauration': 'Restauration',
            'sante': 'Santé (cliniques, cabinets, etc.)',
            'immobilier': 'Immobilier',
            'ecommerce': 'E-commerce',
            'coaching': 'Coaching & Formation',
            'beaute': 'Beauté & Bien-être',
            'btob': 'B2B / Services aux entreprises',
            'services-locaux': 'Services locaux',
            'autre': 'Autre secteur'
        };
        return sectorMap[sector] || sector;
    }

    // Helper function to format challenge names
    function formatChallengeName(challenge) {
        const challengeMap = {
            'pas-de-présence': 'Aucune présence en ligne',
            'pas-assez-de-clients': 'A une présence mais pas assez de clients',
            'vendre-en-ligne': 'Vendre en ligne',
            'faire-croître-le-business': 'Scaler et dominer le marché'
        };
        return challengeMap[challenge] || challenge;
    }

    // Determine pack name based on user responses
    function determinePackName(data) {
        const { priority, challenge, services } = data;
        
        // Based on priority (Step 5)
        if (priority === 'en-ligne-rapidement') {
            return 'Pack Présence Rapide';
        } else if (priority === 'générer-des-leads') {
            return 'Pack Génération de Leads';
        } else if (priority === 'système-automatisé') {
            return 'Croissance Automatisée';
        } else if (priority === 'optimiser-le-marché') {
            return 'Pack Domination Marché';
        }
        
        // Fallback based on challenge (Step 2)
        if (challenge === 'pas-de-présence') {
            return 'Pack Lancement Digital';
        } else if (challenge === 'pas-assez-de-clients') {
            return 'Pack Acquisition Client';
        } else if (challenge === 'vendre-en-ligne') {
            return 'Pack E-commerce';
        } else if (challenge === 'faire-croître-le-business') {
            return 'Pack Croissance';
        }
        
        return 'Pack Marketing Personnalisé';
    }

    // Calculate price range based on budget and services
    function calculatePriceRange(budget, services) {
        const budgetRanges = {
            'Moins de 5 000 MAD': '3 000 - 5 000 MAD',
            '5 000 – 10 000 MAD': '7 000 - 10 000 MAD',
            '10 000 – 20 000 MAD': '13 000 - 17 000 MAD',
            'Plus de 20 000 MAD': '20 000 - 30 000 MAD'
        };
        
        return budgetRanges[budget] || '10 000 - 15 000 MAD';
    }

    // Generate pack description based on data
    function generatePackDescription(data) {
        const { sector, challenge, priority } = data;
        
        // Based on priority
        if (priority === 'générer-des-leads') {
            return 'Un pack orienté performance pour capter, convertir et générer des leads qualifiés automatiquement.';
        } else if (priority === 'en-ligne-rapidement') {
            return 'Un pack complet pour établir rapidement votre présence digitale et commencer à attirer des clients.';
        } else if (priority === 'système-automatisé') {
            return 'Un pack orienté performance pour capter, réserver et convertir automatiquement plus que vos concurrents locaux.';
        } else if (priority === 'optimiser-le-marché') {
            return 'Un pack stratégique pour optimiser votre marketing et dominer votre secteur d\'activité.';
        }
        
        // Based on challenge
        if (challenge === 'pas-de-présence') {
            return 'Un pack idéal pour créer votre présence en ligne et commencer à générer des opportunités.';
        } else if (challenge === 'pas-assez-de-clients') {
            return 'Un pack axé sur l\'acquisition pour transformer votre visibilité en clients réels.';
        } else if (challenge === 'vendre-en-ligne') {
            return 'Un pack e-commerce pour vendre efficacement vos produits ou services en ligne.';
        } else if (challenge === 'faire-croître-le-business') {
            return 'Un pack croissance pour automatiser et scaler votre business au niveau supérieur.';
        }
        
        return 'Un pack sur mesure adapté à vos besoins spécifiques et à votre secteur d\'activité.';
    }

    // Update recommendations based on priority
    function updateRecommendations(priority) {
        const recommendationText = document.querySelector('.recommendation-text');
        
        if (recommendationText) {
            const recommendations = {
                'en-ligne-rapidement': 'Établir une présence digitale professionnelle',
                'générer-des-leads': 'Générer des leads qualifiés immédiatement',
                'système-automatisé': 'Automatiser votre génération de clients',
                'optimiser-le-marché': 'Dominer votre marché avec une stratégie optimisée'
            };
            
            recommendationText.textContent = recommendations[priority] || 'Générer des leads qualifiés immédiatement';
        }
    }

    // Load data on page load
    loadEstimationData();

    // Print functionality
    function printResults() {
        window.print();
    }

    // Email sharing functionality
    function shareByEmail() {
        const subject = encodeURIComponent('Mon estimation marketing Oddysee');
        const body = encodeURIComponent('Voici les résultats de mon estimation marketing. Consultez le lien: ' + window.location.href);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }

    // Make functions available globally if needed
    window.printResults = printResults;
    window.shareByEmail = shareByEmail;
});

// Function to display user's name
function displayUserName() {
    const firstName = localStorage.getItem('userFirstName');
    const lastName = localStorage.getItem('userLastName');
    
    if (firstName) {
        const introSubtitle = document.querySelector('.intro-subtitle');
        if (introSubtitle) {
            introSubtitle.innerHTML = `<strong>${firstName}</strong>, votre estimation est prête`;
        }
    }
}
