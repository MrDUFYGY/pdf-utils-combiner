document.addEventListener('DOMContentLoaded', () => {
    const dropdownToggle = document.getElementById('dropdownNavbarLink');
    const dropdownMenu = document.getElementById('dropdownNavbar');
  
    dropdownToggle.addEventListener('click', () => {
      // Toggle visibility
      dropdownMenu.classList.toggle('hidden');
    });
  
    document.addEventListener('click', (e) => {
      // Close the dropdown if clicking outside
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  });