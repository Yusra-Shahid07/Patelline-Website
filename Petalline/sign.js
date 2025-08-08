// Global user storage
window.petallineUsers = window.petallineUsers || {};
window.currentUser = window.currentUser || null;

// Show/Hide forms
function toggleToSignIn() {
    document.getElementById('signUpForm').classList.add('hidden');
    document.getElementById('signInForm').classList.remove('hidden');
    updateUserStatus();
}

function toggleToSignUp() {
    document.getElementById('signInForm').classList.add('hidden');
    document.getElementById('signUpForm').classList.remove('hidden');
    updateUserStatus();
}

// Show alert message
function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.textContent = message;
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        alert.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(alert)) {
                document.body.removeChild(alert);
            }
        }, 300);
    }, 3000);
}

// Update user status display (hidden but functional)
function updateUserStatus() {
    const userCount = Object.keys(window.petallineUsers).length;
    const userStatus = document.getElementById('userStatus');
    const userCountEl = document.getElementById('userCount');
    const currentUserEl = document.getElementById('currentUser');
    
    userCountEl.textContent = `${userCount} user(s) registered`;
    currentUserEl.textContent = window.currentUser ? 
        `Logged in as: ${window.currentUser.fullName} (${window.currentUser.username})` : 
        'Not logged in';
    
    // Keep it hidden but functional for backend tracking
    // userStatus.classList.remove('hidden');
}

// Handle sign up form submission
document.getElementById('signUpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Validation
    if (!fullName || !username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('Please agree to the terms and conditions!', 'error');
        return;
    }
    
    // Check if username or email already exists
    if (window.petallineUsers[username]) {
        showAlert('Username already exists!', 'error');
        return;
    }
    
    for (let user in window.petallineUsers) {
        if (window.petallineUsers[user].email === email) {
            showAlert('Email already registered!', 'error');
            return;
        }
    }
    
    // Create new user
    window.petallineUsers[username] = {
        fullName: fullName,
        email: email,
        password: password,
        registeredAt: new Date().toISOString()
    };
    
    showAlert('Account created successfully! You can now sign in.', 'success');
    
    // Clear form
    document.getElementById('signUpForm').reset();
    
    // Update status and switch to sign in
    updateUserStatus();
    
    // Auto switch to sign in form after 2 seconds
    setTimeout(() => {
        toggleToSignIn();
        showAlert('Please sign in with your new credentials!', 'info');
    }, 2000);
});
// Handle sign in form submission
document.getElementById('signInForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!username || !password) {
        showAlert('Please enter both username and password!', 'error');
        return;
    }

    if (!window.petallineUsers[username]) {
        showAlert('Username not found! Please sign up first.', 'error');
        return;
    }

    if (window.petallineUsers[username].password !== password) {
        showAlert('Incorrect password! Please try again.', 'error');
        return;
    }

    const userData = window.petallineUsers[username];
    window.currentUser = {
        username: username,
        fullName: userData.fullName,
        email: userData.email,
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
    };

    showAlert(`Welcome back, ${userData.fullName}! Login successful.`, 'success');
    document.getElementById('signInForm').reset();
    updateUserStatus();

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// Logout function
function logout() {
    if (window.currentUser) {
        const userName = window.currentUser.fullName;
        window.currentUser = null;
        showAlert(`Goodbye ${userName}! You have been logged out.`, 'info');
        updateUserStatus();
    } else {
        showAlert('You are not currently logged in.', 'info');
    }
}

// Initialize page
window.addEventListener('load', function() {
    updateUserStatus();
    
    // Show initial message
    setTimeout(() => {
        const userCount = Object.keys(window.petallineUsers).length;
        if (userCount === 0) {
            showAlert('Welcome to Petalline! Please create an account to get started.', 'info');
        } else {
            showAlert(`Welcome back! ${userCount} user(s) registered in the system.`, 'info');
        }
    }, 1000);
});

// Demo users for testing (remove in production)
function addDemoUsers() {
    if (Object.keys(window.petallineUsers).length === 0) {
        window.petallineUsers['demo'] = {
            fullName: 'Demo User',
            email: 'demo@petalline.com',
            password: 'demo123',
            registeredAt: new Date().toISOString()
        };
        window.petallineUsers['admin'] = {
            fullName: 'Admin User',
            email: 'admin@petalline.com',
            password: 'admin123',
            registeredAt: new Date().toISOString()
        };
        updateUserStatus();
        showAlert('Demo users added! Try login with: demo/demo123 or admin/admin123', 'info');
    }
}

// Add demo users button (for testing)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        addDemoUsers();
    }
});