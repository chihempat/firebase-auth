// add admin cloud functions
const adminForm = document.querySelector('.admin-actions')
adminForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log(document.querySelector('.admin-email'))
  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({
    email: adminEmail,
  }).then(result => {
    console.log(result);
  });
});

// listen for auth changes
auth.onAuthStateChanged((user) => {
  console.log(user)
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
    })
    db.collection('guides').onSnapshot(snapshot => {
      setupGuides(snapshot.docs);
    })
  } else {
      setupUI();
      setupGuides([]);
  }
});

//create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', e => {
  e.preventDefault();

  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value,
  }).then(() => {
      const modal = document.querySelector('#modal-create');
      M.Modal.getInstance(modal).close();
      createForm.reset();
  }).catch(err => {
    console.error(err.message);
  })
})

//sign up
const signupForm = document.querySelector('#signup-form');

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;
  console.log(`${email} ${password}`)

  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    console.log(cred.user.uid)
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value
    });
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = '';
  }).catch((error) => {
    signupForm.querySelector('.error').innerHTML = error.message;
  });
})

const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut()
})

const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  //get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
   // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch((error) => {
    loginForm.querySelector('.error').innerHTML = error.message;
  });
})