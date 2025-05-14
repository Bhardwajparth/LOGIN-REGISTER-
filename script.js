// Local storage keys
const USERS_KEY = 'admin_panel_users';

// Tabs functionality
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const formTitle = document.getElementById('formTitle');
const tabSlider = document.querySelector('.tab-slider');

// Adjust form container height based on content
function adjustFormHeight() {
    // Get heights of both forms
    const loginHeight = loginForm.scrollHeight;
    const registerHeight = registerForm.scrollHeight;
    // Use the taller one
    const maxHeight = Math.max(loginHeight, registerHeight);
    document.querySelector('.form-container').style.height = `${maxHeight + 20}px`;
}

// Call on window resize for responsive behavior
window.addEventListener('resize', adjustFormHeight);

// Apply initial tab slider position and adjust form height on page load
window.addEventListener('load', () => {
    loginTab.classList.contains('active') ? tabSlider.style.left = '0' : tabSlider.style.left = '50%';
    adjustFormHeight();
});

// Switch between login and register forms with animation
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    
    // Animate tab slider
    tabSlider.style.left = '0';
    
    // Animate forms with staggered timing
    loginForm.style.transform = 'translateX(0)';
    loginForm.style.opacity = '1';
    
    registerForm.style.transform = 'translateX(100%)';
    registerForm.style.opacity = '0';
    
    // Animate form title
    formTitle.textContent = 'Login to Dashboard';
    formTitle.classList.add('fade-in');
    setTimeout(() => formTitle.classList.remove('fade-in'), 500);
    
    clearAlerts();
    setTimeout(adjustFormHeight, 10);
    
    // Add entrance animation to form fields
    animateFormFields(loginForm);
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    
    // Animate tab slider
    tabSlider.style.left = '50%';
    
    // Animate forms with staggered timing
    loginForm.style.transform = 'translateX(-100%)';
    loginForm.style.opacity = '0';
    
    registerForm.style.transform = 'translateX(0)';
    registerForm.style.opacity = '1';
    
    // Animate form title
    formTitle.textContent = 'Create Account';
    formTitle.classList.add('fade-in');
    setTimeout(() => formTitle.classList.remove('fade-in'), 500);
    
    clearAlerts();
    setTimeout(adjustFormHeight, 10);
    
    // Add entrance animation to form fields
    animateFormFields(registerForm);
});

// Animate form fields entrance
function animateFormFields(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animation = `fadeInRight ${0.3 + index * 0.1}s ease forwards`;
        setTimeout(() => {
            group.style.animation = '';
        }, 1000);
    });
}

// Toggle password visibility
function togglePasswordVisibility(inputId, toggleElement) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        toggleElement.textContent = '🔒';
    } else {
        input.type = 'password';
        toggleElement.textContent = '👁️';
    }
}

// Helper functions
function showAlert(message, type) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    
    // Remove existing animation and add new one
    alertBox.style.animation = 'none';
    alertBox.offsetHeight; // Trigger reflow
    alertBox.style.animation = 'slideDown 0.4s ease';
    
    adjustFormHeight();
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertBox.style.animation = 'none';
        alertBox.offsetHeight; // Trigger reflow
        alertBox.style.animation = 'fadeIn 0.4s ease reverse';
        setTimeout(() => {
            alertBox.style.display = 'none';
            adjustFormHeight();
        }, 400);
    }, 5000);
}

function clearAlerts() {
    const alertBox = document.getElementById('alertBox');
    alertBox.style.display = 'none';
    adjustFormHeight();
}

function showLoader(buttonId, loaderId, textId) {
    document.getElementById(buttonId).disabled = true;
    document.getElementById(loaderId).style.display = 'inline-block';
    document.getElementById(textId).style.display = 'none';
}

function hideLoader(buttonId, loaderId, textId) {
    document.getElementById(buttonId).disabled = false;
    document.getElementById(loaderId).style.display = 'none';
    document.getElementById(textId).style.display = 'inline-block';
}

// Show success animation
function showSuccessAnimation(formId) {
    const form = document.getElementById(formId);
    const successElement = formId === 'loginForm' ? document.getElementById('loginSuccess') : document.getElementById('registerSuccess');
    
    // Hide form fields
    Array.from(form.querySelectorAll('.form-group, .form-footer')).forEach(el => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease';
    });
    
    // Show checkmark animation
    successElement.style.display = 'block';
    
    // Reset form after animation
    setTimeout(() => {
        successElement.style.display = 'none';
        Array.from(form.querySelectorAll('.form-group, .form-footer')).forEach(el => {
            el.style.opacity = '1';
        });
    }, 3000);
}

// Get users from local storage
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users to local storage
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Find user by username or email
function findUser(usernameOrEmail) {
    const users = getUsers();
    return users.find(user => 
        user.username === usernameOrEmail || user.email === usernameOrEmail
    );
}

// Handle login
document.getElementById('loginButton').addEventListener('click', () => {
    const usernameOrEmail = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Add button click effect
    document.getElementById('loginButton').classList.add('animate-success');
    setTimeout(() => {
        document.getElementById('loginButton').classList.remove('animate-success');
    }, 300);
    
    // Form validation
    if (!usernameOrEmail || !password) {
        showAlert('Please enter both username/email and password', 'error');
        return;
    }
    
    // Show loader during "authentication"
    showLoader('loginButton', 'loginLoader', 'loginButtonText');
    
    // Simulate API request with timeout
    setTimeout(() => {
        const user = findUser(usernameOrEmail);
        
        if (!user || user.password !== password) {
            hideLoader('loginButton', 'loginLoader', 'loginButtonText');
            showAlert('Invalid username/email or password', 'error');
            return;
        }
        
        // Login successful
        hideLoader('loginButton', 'loginLoader', 'loginButtonText');
        showAlert('Login successful! Redirecting...', 'success');
        showSuccessAnimation('loginForm');
        
        // Redirect after success animation
        setTimeout(() => {
            // In a real app, redirect to dashboard
            // window.location.href = 'dashboard.html';
            alert('Login successful! Would redirect to dashboard in production.');
        }, 3000);
    }, 1500);
});

// Handle registration
document.getElementById('registerButton').addEventListener('click', () => {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    
    // Add button click effect
    document.getElementById('registerButton').classList.add('animate-success');
    setTimeout(() => {
        document.getElementById('registerButton').classList.remove('animate-success');
    }, 300);
    
    // Form validation
    if (!username || !email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Check if username or email already exists
    const users = getUsers();
    if (users.some(user => user.username === username)) {
        showAlert('Username already exists', 'error');
        return;
    }
    
    if (users.some(user => user.email === email)) {
        showAlert('Email already in use', 'error');
        return;
    }
    
    // Show loader during "registration"
    showLoader('registerButton', 'registerLoader', 'registerButtonText');
    
    // Simulate API request with timeout
    setTimeout(() => {
        // Add new user
        users.push({ username, email, password });
        saveUsers(users);
        
        // Registration successful
        hideLoader('registerButton', 'registerLoader', 'registerButtonText');
        showAlert('Registration successful!', 'success');
        showSuccessAnimation('registerForm');
        
        // Switch to login form after registration
        setTimeout(() => {
            loginTab.click();
            // Clear registration form
            document.getElementById('registerUsername').value = '';
            document.getElementById('registerEmail').value = '';
            document.getElementById('registerPassword').value = '';
        }, 3000);
    }, 1500);
});

// Forgot password handler
document.getElementById('forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    showAlert('Password reset functionality is not implemented in this demo', 'error');
});

// Call adjustFormHeight initially to set correct height
adjustFormHeight();
