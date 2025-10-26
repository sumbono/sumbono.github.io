/**
* GardaMatika Enhanced JavaScript
* Custom functionality for GardaMatika mathematics learning platform
* Enhanced for hackathon judges, VCs, and investors
*/

!(function($) {
  "use strict";

  // GardaMatika specific initialization
  $(document).ready(function() {
    
    // Initialize all interactive components
    initHeroAnimations();
    initCounters();
    initCharts();
    initDemoInterface();
    initContactForm();
    initScrollAnimations();
    initLanguageToggle();
    initDifficultySelector();
    initProblemSolver();
    initNavigationEnhancements();
    
    // Initialize MathJax configuration
    configureMathJax();
    
    // Initialize performance tracking
    initAnalytics();
  });

  // Hero section animations
  function initHeroAnimations() {
    // Animate hero metrics on scroll
    $('.metric-number').each(function(index) {
      const $this = $(this);
      const target = parseInt($this.data('target'));
      
      $this.waypoint(function() {
        setTimeout(function() {
          animateValue($this[0], 0, target, 2000);
        }, index * 200);
      }, {
        offset: '80%'
      });
    });
    
    // Animate hero content on load
    $('.hero-text').addClass('animated fadeInUp');
    $('.hero-visual').addClass('animated slideInLeft');
  }

  // Animate numeric values
  function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(function() {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = formatNumber(end);
        clearInterval(timer);
      } else {
        element.textContent = formatNumber(Math.floor(current));
      }
    }, 16);
  }

  // Format numbers with commas
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Initialize counter animations
  function initCounters() {
    $('[data-toggle="counter-up"]').counterUp({
      delay: 10,
      time: 1000
    });
  }

  // Initialize data visualization charts
  function initCharts() {
    // PISA Ranking Chart
    const rankingCtx = document.getElementById('rankingChart');
    if (rankingCtx) {
      new Chart(rankingCtx, {
        type: 'bar',
        data: {
          labels: ['Indonesia', 'Singapore', 'Japan', 'South Korea'],
          datasets: [{
            label: 'PISA Math Ranking',
            data: [65, 2, 6, 7],
            backgroundColor: [
              'rgba(255, 107, 107, 0.8)',
              'rgba(40, 167, 69, 0.8)',
              'rgba(23, 162, 184, 0.8)',
              'rgba(255, 193, 7, 0.8)'
            ],
            borderColor: [
              'rgba(255, 107, 107, 1)',
              'rgba(40, 167, 69, 1)',
              'rgba(23, 162, 184, 1)',
              'rgba(255, 193, 7, 1)'
            ],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              reverse: true,
              title: {
                display: true,
                text: 'Rank (Lower is Better)',
                color: 'rgba(255, 255, 255, 0.8)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          }
        }
      });
    }

    // Growth Projection Chart
    const growthCtx = document.getElementById('growthChart');
    if (growthCtx) {
      new Chart(growthCtx, {
        type: 'line',
        data: {
          labels: ['Year 0', 'Year 1', 'Year 2', 'Year 3'],
          datasets: [{
            label: 'Users (thousands)',
            data: [0, 100, 500, 1000],
            borderColor: 'rgba(18, 214, 64, 1)',
            backgroundColor: 'rgba(18, 214, 64, 0.1)',
            tension: 0.4,
            fill: true
          }, {
            label: 'Revenue ($M)',
            data: [0, 0.6, 3, 8],
            borderColor: 'rgba(255, 193, 7, 1)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            tension: 0.4,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Growth Metrics',
                color: 'rgba(255, 255, 255, 0.8)'
              },
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            },
            x: {
              ticks: {
                color: 'rgba(255, 255, 255, 0.8)'
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              labels: {
                color: 'rgba(255, 255, 255, 0.8)'
              }
            }
          }
        }
      });
    }
  }

  // Initialize demo interface
  function initDemoInterface() {
    // Language toggle functionality
    $('.lang-btn').on('click', function() {
      $('.lang-btn').removeClass('active');
      $(this).addClass('active');
      updateDemoLanguage($(this).data('lang'));
    });

    // Difficulty selector functionality
    $('.diff-btn').on('click', function() {
      $('.diff-btn').removeClass('active');
      $(this).addClass('active');
      updateDemoDifficulty($(this).data('diff'));
    });
  }

  // Update demo language
  function updateDemoLanguage(lang) {
    // In a real implementation, this would fetch problems in the selected language
    console.log('Language changed to:', lang);
    
    // Track language preference
    gtag('event', 'language_change', {
      'language': lang
    });
  }

  // Update demo difficulty
  function updateDemoDifficulty(difficulty) {
    const problems = {
      easy: '$$x^2 + 5x + 6 = 0$$',
      medium: '$$\\int_0^{\\pi} \\sin(x) dx$$',
      hard: '$$\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$$'
    };
    
    $('#demo-problem').html(problems[difficulty]);
    
    // Re-render MathJax
    if (window.MathJax) {
      MathJax.typesetPromise([$('#demo-problem')[0]]).then(function() {
        console.log('MathJax re-rendered');
      });
    }
    
    // Track difficulty preference
    gtag('event', 'difficulty_change', {
      'difficulty': difficulty
    });
  }

  // Initialize problem solver
  function initProblemSolver() {
    window.solveDemoProblem = function() {
      const $solutionDisplay = $('#solution-display');
      const $steps = $('.solution-step');
      
      // Show solution display
      $solutionDisplay.slideDown();
      
      // Animate solution steps
      $steps.each(function(index) {
        const $step = $(this);
        setTimeout(function() {
          $step.addClass('animated fadeInUp');
        }, index * 500);
      });
      
      // Track demo interaction
      gtag('event', 'demo_solve', {
        'interaction': 'step_by_step_solution'
      });
    };
  }

  // Initialize contact form
  function initContactForm() {
    window.openContactForm = function(type) {
      const $formContainer = $('#contact-form-container');
      const $formTitle = $('#form-title');
      
      // Update form title based on type
      const titles = {
        investment: 'Investment Inquiry',
        partnership: 'Partnership Inquiry',
        general: 'General Inquiry'
      };
      
      $formTitle.text(titles[type] || 'Contact Us');
      $formContainer.fadeIn();
      
      // Track form opening
      gtag('event', 'contact_form_open', {
        'type': type
      });
    };

    window.closeContactForm = function() {
      $('#contact-form-container').fadeOut();
    };

    // Handle form submission
    $('#contact-form').on('submit', function(e) {
      e.preventDefault();
      
      const formData = {
        name: $('#name').val(),
        email: $('#email').val(),
        organization: $('#organization').val(),
        message: $('#message').val(),
        type: $('#form-title').text()
      };
      
      // In a real implementation, this would send data to a server
      console.log('Form submitted:', formData);
      
      // Show success message
      showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
      
      // Track form submission
      gtag('event', 'contact_form_submit', {
        'type': formData.type
      });
      
      // Close form and reset
      closeContactForm();
      this.reset();
    });
  }

  // Initialize scroll animations
  function initScrollAnimations() {
    // Animate elements on scroll
    $('.stat-card, .feature-card, .impact-card, .story-card').each(function(index) {
      const $this = $(this);
      
      $this.waypoint(function() {
        setTimeout(function() {
          $this.addClass('animated fadeInUp');
        }, index * 100);
      }, {
        offset: '80%'
      });
    });
  }

  // Initialize language toggle
  function initLanguageToggle() {
    // Add smooth scroll behavior for anchor links
    $('a[href^="#"]').on('click', function(e) {
      e.preventDefault();
      const target = $(this.getAttribute('href'));
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 70
        }, 500);
      }
    });
  }

  // Initialize difficulty selector
  function initDifficultySelector() {
    // Already handled in initDemoInterface()
  }

  // Initialize navigation enhancements
  function initNavigationEnhancements() {
    // Add smooth scroll behavior
    window.scrollToSection = function(sectionId) {
      const target = $('#' + sectionId);
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top - 70
        }, 800);
      }
    };

    // Add active section highlighting
    $(window).on('scroll', function() {
      const scrollPosition = $(window).scrollTop();
      
      $('section').each(function() {
        const $section = $(this);
        const sectionTop = $section.offset().top - 100;
        const sectionBottom = sectionTop + $section.height();
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          $('.nav-menu a').removeClass('active');
          $(`.nav-menu a[href="#${$section.attr('id')}"]`).addClass('active');
        }
      });
    });

    // Mobile navigation toggle
    $('.mobile-nav-toggle').on('click', function() {
      const $mobileNav = $('#mobile-nav');
      const isExpanded = $(this).attr('aria-expanded') === 'true';
      
      if (isExpanded) {
        $mobileNav.removeClass('active');
        $(this).attr('aria-expanded', 'false');
        $(this).find('i').removeClass('fa-times').addClass('fa-bars');
      } else {
        $mobileNav.addClass('active');
        $(this).attr('aria-expanded', 'true');
        $(this).find('i').removeClass('fa-bars').addClass('fa-times');
      }
    });

    // Close mobile nav when clicking outside
    $(document).on('click', function(e) {
      const $mobileNav = $('#mobile-nav');
      const $toggle = $('.mobile-nav-toggle');
      
      if (!$mobileNav.is(e.target) && $mobileNav.has(e.target).length === 0 &&
          !$toggle.is(e.target) && $toggle.has(e.target).length === 0) {
        $mobileNav.removeClass('active');
        $toggle.attr('aria-expanded', 'false');
        $toggle.find('i').removeClass('fa-times').addClass('fa-bars');
      }
    });

    // Close mobile nav when clicking on a link
    $('.mobile-nav a').on('click', function() {
      $('#mobile-nav').removeClass('active');
      $('.mobile-nav-toggle').attr('aria-expanded', 'false');
      $('.mobile-nav-toggle').find('i').removeClass('fa-times').addClass('fa-bars');
    });

    // Add scroll effect to header
    $(window).on('scroll', function() {
      const $header = $('.header-tops');
      if ($(window).scrollTop() > 50) {
        $header.addClass('scrolled');
      } else {
        $header.removeClass('scrolled');
      }
    });
  }

  // Configure MathJax
  function configureMathJax() {
    if (window.MathJax) {
      MathJax = {
        tex: {
          inlineMath: [['$', '$'], ['\\(', '\\)']],
          displayMath: [['$$', '$$'], ['\\[', '\\]']],
          processEscapes: true
        },
        options: {
          ignoreHtmlClass: 'tex2jax_ignore',
          processHtmlClass: 'tex2jax_process'
        }
      };
    }
  }

  // Initialize analytics
  function initAnalytics() {
    // Track page view
    gtag('event', 'page_view', {
      'page_title': 'GardaMatika Enhanced',
      'page_location': window.location.href
    });

    // Track time on page
    let timeOnPage = 0;
    setInterval(function() {
      timeOnPage++;
    }, 1000);

    // Track scroll depth
    let maxScroll = 0;
    $(window).on('scroll', function() {
      const scrollPercentage = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
      if (scrollPercentage > maxScroll) {
        maxScroll = scrollPercentage;
      }
    });

    // Send engagement data on page unload
    $(window).on('beforeunload', function() {
      gtag('event', 'page_engagement', {
        'time_on_page': timeOnPage,
        'max_scroll_depth': Math.round(maxScroll)
      });
    });
  }

  // Show notification
  function showNotification(message, type = 'info') {
    const notification = $(`
      <div class="notification notification-${type}">
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `);
    
    $('body').append(notification);
    
    // Animate in
    setTimeout(function() {
      notification.addClass('show');
    }, 100);
    
    // Handle close
    notification.find('.notification-close').on('click', function() {
      notification.removeClass('show');
      setTimeout(function() {
        notification.remove();
      }, 300);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(function() {
      notification.removeClass('show');
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // Add notification styles dynamically
  $('<style>')
    .prop('type', 'text/css')
    .html(`
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gardamatika-dark);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 10px;
        padding: 15px 20px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification-success {
        border-left: 4px solid var(--gardamatika-success);
      }
      
      .notification-info {
        border-left: 4px solid var(--gardamatika-info);
      }
      
      .notification i {
        font-size: 1.2rem;
        color: var(--gardamatika-accent);
      }
      
      .notification span {
        color: rgba(255, 255, 255, 0.9);
        flex: 1;
        line-height: 1.4;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        font-size: 1rem;
        transition: color 0.3s ease;
      }
      
      .notification-close:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    `)
    .appendTo('head');

  // Make functions globally accessible
  window.GardaMatika = {
    animateValue: animateValue,
    formatNumber: formatNumber,
    showNotification: showNotification,
    updateDemoLanguage: updateDemoLanguage,
    updateDemoDifficulty: updateDemoDifficulty
  };

})(jQuery);