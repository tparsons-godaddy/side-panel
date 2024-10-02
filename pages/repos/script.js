// Sample repository data
const repos = [
  'Repo 1',
  'Repo 2',
  'Repo 3',
  'Repo 4',
];

// Get the container div
const reposList = document.getElementById('repos-list');

// Create a list element
const ul = document.createElement('ul');

// Loop through the repository data and create list items
repos.forEach(repo => {
  const li = document.createElement('li');
  li.textContent = repo;
  li.style.padding = '10px';
  li.style.color = 'red';
  ul.appendChild(li);
});

// Append the list to the div
reposList.appendChild(ul);
