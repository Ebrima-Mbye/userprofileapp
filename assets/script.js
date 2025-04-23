document.addEventListener("DOMContentLoaded", function () {
  const mainContainer = document.getElementById("main-container");
  const usersContainer = document.getElementById("users-container");
  const profileDetail = document.getElementById("profile-detail");
  const backButton = document.getElementById("back-button");
  let currentActiveUser = null;

  // Check if we're on mobile
  const isMobile = () => window.innerWidth <= 768;

  // Back button event
  backButton.addEventListener("click", function () {
    if (isMobile()) {
      mainContainer.classList.remove("show-profile");
    }
  });

  // Fetch users from API
  fetchUsers();

  async function fetchUsers() {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const users = await response.json();
      displayUsers(users);
    } catch (error) {
      showError(error.message);
    }
  }

  function displayUsers(users) {
    usersContainer.innerHTML = "";

    if (users.length === 0) {
      usersContainer.innerHTML =
        '<div class="error-message">No users found</div>';
      return;
    }

    users.forEach((user) => {
      const userItem = document.createElement("div");
      userItem.classList.add("user-item");
      userItem.setAttribute("data-id", user.id);

      const initials = getInitials(user.name);

      userItem.innerHTML = `
                        <div class="user-avatar">${initials}</div>
                        <div class="user-info">
                            <h3>${user.name}</h3>
                            <p>${user.email}</p>
                        </div>
                    `;

      userItem.addEventListener("click", () => {
        // Remove active class from current active user
        if (currentActiveUser) {
          currentActiveUser.classList.remove("active");
        }

        // Add active class to clicked user
        userItem.classList.add("active");
        currentActiveUser = userItem;

        // Show detailed profile
        showUserProfile(user);

        // If on mobile, show profile view and hide list
        if (isMobile()) {
          mainContainer.classList.add("show-profile");
        }
      });

      usersContainer.appendChild(userItem);
    });
  }

  function showUserProfile(user) {
    // Get the card content element
    const cardContent = profileDetail.querySelector(".card-content");

    // Clear the content
    cardContent.innerHTML = "";

    // Create profile content
    const profileContent = document.createElement("div");
    profileContent.className = "profile-content";

    // Create profile detail HTML
    profileContent.innerHTML = `
                    <div class="profile-header">
                        <div class="profile-avatar">${getInitials(
                          user.name
                        )}</div>
                        <div class="profile-name">
                            <h3>${user.name}</h3>
                            <p>${user.username}</p>
                        </div>
                    </div>
                    <div class="profile-info">
                        <div>
                            <div class="info-group">
                                <div class="info-label">Email</div>
                                <div class="info-value">${user.email}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Phone</div>
                                <div class="info-value">${user.phone}</div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Website</div>
                                <div class="info-value">${user.website}</div>
                            </div>
                        </div>
                        <div>
                            <div class="info-group">
                                <div class="info-label">Address</div>
                                <div class="info-value">
                                    ${user.address.street}, ${
      user.address.suite
    }<br>
                                    ${user.address.city}, ${
      user.address.zipcode
    }
                                </div>
                            </div>
                            <div class="info-group">
                                <div class="info-label">Company</div>
                                <div class="info-value">
                                    ${user.company.name}<br>
                                    <small>${user.company.catchPhrase}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

    cardContent.appendChild(profileContent);

    // Set the profile title in header
    const profileHeader = document.querySelector(
      "#profile-detail .card-header h2"
    );
    profileHeader.textContent = `${user.name}'s Profile`;
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }

  function showError(message) {
    usersContainer.innerHTML = `
                    <div class="error-message">
                        <p>${message}</p>
                        <button onclick="fetchUsers()" class="retry-button">Retry</button>
                    </div>
                `;
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    if (!isMobile()) {
      mainContainer.classList.remove("show-profile");
    }
  });
});
