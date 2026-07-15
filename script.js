const cartCount = document.getElementById('cart-count');
const buttons = document.querySelectorAll('.buy-btn');
const signInTrigger = document.getElementById('sign-in-trigger');
const authModal = document.getElementById('auth-modal');
const modalClose = document.getElementById('modal-close');
const userPill = document.getElementById('user-pill');
const authMessage = document.getElementById('auth-message');
const emailForm = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const socialButtons = document.querySelectorAll('.social-btn');
const storageKey = 'nayco-auth';

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(storageKey));
  } catch (error) {
    return null;
  }
}

function updateAuthUI(auth) {
  if (auth && auth.isSignedIn) {
    userPill.hidden = false;
    userPill.textContent = `Signed in as ${auth.name}`;
    signInTrigger.textContent = 'Sign out';
  } else {
    userPill.hidden = true;
    userPill.textContent = '';
    signInTrigger.textContent = 'Sign in';
  }
}

function openModal(message = 'Choose a provider to continue and unlock checkout.') {
  authMessage.textContent = message;
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
}

function signIn(provider, name) {
  const auth = { isSignedIn: true, provider, name };
  localStorage.setItem(storageKey, JSON.stringify(auth));
  updateAuthUI(auth);
  authMessage.textContent = `Welcome, ${name}! You can now buy items.`;
  closeModal();
}

function signOut() {
  localStorage.removeItem(storageKey);
  updateAuthUI(null);
  authMessage.textContent = 'Signed out. Sign in again to purchase items.';
}

signInTrigger.addEventListener('click', (event) => {
  event.preventDefault();

  const auth = getStoredAuth();
  if (auth && auth.isSignedIn) {
    signOut();
  } else {
    openModal();
  }
});

modalClose.addEventListener('click', closeModal);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) {
    closeModal();
  }
});

socialButtons.forEach((button) => {
  button.addEventListener('click', () => {
    signIn(button.dataset.provider, button.dataset.provider);
  });
});

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = emailInput.value.trim() || 'friend';
  signIn('Email', name);
  emailForm.reset();
});

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const auth = getStoredAuth();

    if (!auth || !auth.isSignedIn) {
      openModal('Please sign in first to buy this item.');
      return;
    }

    const currentCount = Number(cartCount.textContent || 0);
    cartCount.textContent = currentCount + 1;
    button.textContent = 'Added';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = 'Buy now';
      button.disabled = false;
    }, 1100);
  });
});

updateAuthUI(getStoredAuth());
