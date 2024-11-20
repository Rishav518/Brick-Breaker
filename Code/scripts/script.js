usersDB = [
  {
  "username": "dristiBhugun",
  "email": "dristi.bs@gmail.com",
  "password": "dristiBhugun"
},
];

// Function to signup a new user
function signup() {
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  //Check if username and password is null
  if (username === '' || email === '' || password === '' || confirmPassword === '') {
    document.getElementById(
      'warnSignUp'
    ).textContent = `Enter username & password`;
    return;
  }
  // Check if the username already exists
  if (usersDB.find((user) => user.username === username)) {
    document.getElementById(
      'warnSignUp'
    ).textContent = `Username exists.Try again`;
    return;
  }
  //check if the password and confirm password are same
  if (password !== confirmPassword) {
    document.getElementById(
      'warnSignUp'
    ).textContent = `Passwords do not match. Try again.`;
    return;
  }
  //check if username is less than 4 characters
  if (username.length < 4) {
    document.getElementById(
      'warnSignUp'
    ).textContent = `Username must be 4 characters long`;
    return;
  }
  //check if passowrd is less than 4 characters
  if (password.length < 4) {
    document.getElementById(
      'warnSignUp'
    ).textContent = `Password must be 4 characters long`;
    return;
  }
  // Add the new user to the JSON
  usersDB.push({ username: username, email:email, password: password });
  console.log(usersDB);
  document.getElementById('loginWelcome').style.display = 'block';

  showLogin();
}

// Function to login a user
function login() {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;

  // Check if the user exists and the password is correct
  const user = usersDB.find(
    (user) => user.username === username && user.password === password
  );
  //check is username and password is null
  if (username === '' || password === '') {
    document.getElementById(
      'warnLogin'
    ).textContent = `Please enter username & password`;
    return;
  }
  if (user) {
    //hide the login form
    document.getElementById('login').style.display = 'none';
    document.getElementById('navi').style.display = 'none';
    document.getElementById('loginWelcome').style.display = 'none';
    document.getElementById('signupinstructions').style.display = 'none';
    document.getElementById('logininstructions').style.display = 'none';
    //show the welcome message
    document.getElementById('userWelcome').textContent = `${username}`;
    //show gameinterface
    document.getElementById('gameInterface').style.display = 'block';
    document.getElementById('gameFrame').style.display = 'block';
    //hide login button
    document.getElementById('loginBtn').style.display = 'none';
    //show the logout button
    document.getElementById('logoutBtn').style.display = 'block';
  } else {
    document.getElementById(
      'warnLogin'
    ).textContent = `Invalid username or password.`;
  }
}

// Function to show the signup form and hide the login form
function showSignup() {
  document.getElementById('signup').style.display = 'block';
  document.getElementById('signupinstructions').style.display = 'block';
  document.getElementById('logininstructions').style.display = 'none';
  document.getElementById('login').style.display = 'none';
}

// Function to show the login form and hide the signup form
function showLogin() {
  document.getElementById('login').style.display = 'block';
  document.getElementById('signup').style.display = 'none';
  document.getElementById('signupinstructions').style.display = 'none';
  document.getElementById('logininstructions').style.display = 'block';
}

//function to display gameFrame
function showGameFrame() {
  document.getElementById('gameFrame').style.display = 'block';
  document.getElementById('showHelp').style.display = 'none';
  document.getElementById('showLeaderboard').style.display = 'none';
}

//function to show help
function showHelp() {
  document.getElementById('gameFrame').style.display = 'none';
  document.getElementById('showHelp').style.display = 'block';
  document.getElementById('showLeaderboard').style.display = 'none';
}

//function to show leaderboard
function showLeaderboard() {
  document.getElementById('showLeaderboard').style.display = 'block';
  document.getElementById('gameFrame').style.display = 'none';
  document.getElementById('showHelp').style.display = 'none';
  // Call the function to display the leaderboard when the page loads
  displayLeaderboard();
}

//function to show leaderboard
function displayLeaderboard() {
  //get current user from welcome message to highlight
  currentUser = document.getElementById('userWelcome').innerHTML;
  // Get the leaderboard table
  const leaderboardTable = document.getElementById('leaderboard');

  // Clear the existing rows from the table
  while (leaderboardTable.rows.length > 1) {
    leaderboardTable.deleteRow(1);
  }

  // fetch usersDB from local cache
  data = JSON.parse(localStorage.getItem('scoreDB'));

  //add curent user to the data if it does not exist
  if (!data.find((user) => user.username === currentUser)) {
    data.push({ username: currentUser, score: score });
  }

  // print data in console
  console.log(data);
  // Sort the data by score in descending order
  data.sort((a, b) => b.score - a.score);

  // Display only the top 9 scores
  data.slice(0, 9).forEach((entry, index) => {
    const row = leaderboardTable.insertRow(index + 1);
    // +1 to skip the header row
    //add serial number
    const serialCell = row.insertCell(0);
    const usernameCell = row.insertCell(1);
    const scoreCell = row.insertCell(2);

    // Add Tailwind CSS classes to the row and cells
    row.classList.add('hover:shadow-xl', 'duration-300', 'ease-in', 'hover:shadow-red-900');
    //highlight current user
    if (entry.username === currentUser) {
      row.classList.add('text-red-700');
    }
    serialCell.classList.add('p-2', 'text-center');
    usernameCell.classList.add('p-2', 'text-center');
    scoreCell.classList.add('p-2', 'text-center');

    serialCell.textContent = index + 1;
    usernameCell.textContent = entry.username;
    scoreCell.textContent = entry.score;
  });
}

//for using enter key to login
document
  .getElementById('loginPassword')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      login();
    }
  });
//for using enter key to signup
document
  .getElementById('confirmPassword')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      signup();
    }
  });
// Initially show the signup form
showLogin();
