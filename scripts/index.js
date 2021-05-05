let guideList = document.querySelector('.guides');
let loggedOutLinks = document.querySelectorAll('.logged-out');
let loggedInLinks = document.querySelectorAll('.logged-in');
let accountDetails = document.querySelector('.account-details');
let adminItems = document.querySelectorAll('.admin');


const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block')
    }
    db.collection('users').doc(user.uid).get().then(doc => {
      console.log(doc)
       const html = `
      <div>Looged in as ${user.email}</div>
      <div class="pink-text">${user.admin ? 'Admin':''}</div>
        `;
          accountDetails.innerHTML = html;
    }).catch(err => {console.log(err.message)})


    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    adminItems.forEach(item=> item.style.display = 'none')
    //hide aacount info
    accountDetails.innerHTML = '';
    // toggle user elements
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
}

//setup guides
const setupGuides = (data) => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();

      const li = `
      <li>
          <div class="collapsible-header grey lighten-4">${guide.title}</div>
          <div class="collapsible-body white"><span>${guide.content}</span></div>
      </li>
      `;

      html += li;
    });

    guideList.innerHTML = html;
  } else {
    guideList.innerHTML = `<h5>Login to View Guides</h5>`;
  }

}


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);
});