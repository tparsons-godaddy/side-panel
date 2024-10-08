// Sample repository data
const repos = [
  { name: 'Repo 1', url: 'https://example.com/repo1' },
  { name: 'Repo 2', url: 'https://example.com/repo2' },
  { name: 'Repo 3', url: 'https://example.com/repo3' },
  { name: 'Repo 4', url: 'https://example.com/repo4' },
];

// Get the container div
const reposList = document.getElementById('repos-list');

// Create a list element
const ul = document.createElement('ul');

// Loop through the repository data and create list items
repos.forEach(repo => {
  const li = document.createElement('li');
  const card = document.createElement('div');
  
  card.className = 'repo-card'; // Add the card class
  card.innerHTML = `<a href="${repo.url}" target="_blank">${repo.name}</a>`; // Link to the repo
  
  li.appendChild(card); // Append the card to the list item
  ul.appendChild(li); // Append the list item to the unordered list
});

// Append the list to the div
reposList.appendChild(ul);
