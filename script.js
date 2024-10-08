document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const contentContainer = document.getElementById('contentContainer');

  tabs.forEach(tab => {
      tab.addEventListener('click', async () => {
          // Remove active class from all tabs
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');

          const url = tab.getAttribute('data-url');
          if (url) {
              // Fetch content from the selected URL
              try {
                  const response = await fetch(url);
                  if (!response.ok) {
                      throw new Error('Network response was not ok');
                  }
                  const content = await response.text();
                  contentContainer.innerHTML = content; // Load content into the container
              } catch (error) {
                  contentContainer.innerHTML = `<p>Error loading content: ${error.message}</p>`;
              }
          } else {
              contentContainer.innerHTML = `<p>No content available for this tab.</p>`;
          }
      });
  });
});
