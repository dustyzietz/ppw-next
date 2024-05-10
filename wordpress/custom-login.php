<?php
/* Template Name: Custom Login Page */
get_header();
?>
<div id="login-register-password">
  <?php global $user_ID, $user_identity;
  if (!$user_ID) { ?>

    <!DOCTYPE html>

    <style>
      .form {
        margin-bottom: 20px;
        max-width: 500px;
        margin: 0 auto;
        min-height: 60vh;
      }

      .tab {
        overflow: hidden;
        border-bottom: 1px solid #ccc;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .tab button {
        background-color: inherit;
        float: left;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 14px 16px;
        transition: background-color 0.3s;
      }

      .tab button:hover {
        background-color: #ddd;
      }

      .tab button.active {
        background-color: #ccc;
      }

      .tabcontent {
        display: none;
        padding: 20px;
      }

      input[type="text"],
      input[type="password"],
      input[type="email"] {
        display: block;
        min-width: 200px;
        padding: 10px;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
      }

      button {
        padding: 12px 24px;
        margin-bottom: 20px;
      }

      .tablinks {
        width: 100%;
        margin-bottom: 0;
      }

      button[type="submit"] {
        background-color: #007bff;
        color: #fff;
        border: none;
        cursor: pointer;
      }

      button[type="submit"]:hover {
        background-color: #0056b3;
      }

      h3 {
        margin-top: 0;
      }

      .rememberme {
        margin-bottom: 20px;
      }
    </style>
    <!-- form with 3 tabs: login, register, forgot password
  Login has 3 fields username password and remember me
  Registration has 2 fields: username and email
  Forgot password has 1 field: email
  -->
    <div class="form">
      <div class="tab">
        <button class="tablinks active" onclick="openTab(event, 'Login')">Login</button>
        <button class="tablinks" onclick="openTab(event, 'Register')">Register</button>
        <button class="tablinks" onclick="openTab(event, 'Forgot Password')">Forgot Password</button>
      </div>

      <div id="Login" class="tabcontent" style="display: block">
        <h3>Login</h3>
        <p>Login to your account</p>
        <form id="custom-login-form" method="post" action="<?php bloginfo('url') ?>/wp-login.php" class="wp-user-form">
          <div class="username">
            <label for="user_login">Username: </label>
            <input type="text" name="log" value="<?php echo esc_attr(stripslashes($user_login)); ?>" size="20" id="user_login" tabindex="11" />
          </div>
          <div class="password">
            <label for="user_pass">Password: </label>
            <input type="password" name="pwd" value="" size="20" id="user_pass" tabindex="12" />
          </div>
          <div class="login_fields">
            <div class="rememberme">
              <label for="rememberme">
                <input type="checkbox" name="rememberme" value="forever" checked="checked" id="rememberme" tabindex="13" /> Remember me
              </label>
            </div>
            <?php do_action('login_form'); ?>
            <input type="submit" name="user-submit" value="Login" tabindex="14" class="user-submit" onclick="customLogin(event)" />
            <input type="hidden" name="task" value="login" />
            <input type="hidden" name="redirect_to" value="<?php echo esc_attr($_SERVER['REQUEST_URI']); ?>" />
            <input type="hidden" name="user-cookie" value="1" />
          </div>
        </form>
      </div>
      <div id="Register" class="tabcontent">
        <h3>Register</h3>
        <p>Register a new account</p>
        <div id="register-message" style="display: none;">
          <p>Please check your email for verification.</p>
        </div>
        <form id="custom-register-form" method="post" action="<?php echo esc_url(wp_registration_url()); ?>" class="wp-user-form">
          <div class="username">
            <label for="user_register">Username: </label>
            <input type="text" name="user_login" id="user_register" placeholder="Username" />
          </div>
          <div class="email">
            <label for="email_register">Email: </label>
            <input type="email" name="user_email" id="email_register" placeholder="Email" />
          </div>
          <!-- Add additional fields for registration if needed -->
          <button type="submit">Register</button>
          <?php wp_nonce_field('ajax-register-nonce', 'register-security'); ?>
          <input type="hidden" name="task" value="register" />
        </form>
      </div>
      <div id="Forgot Password" class="tabcontent">
        <h3>Forgot Password</h3>
        <p>Forgot your password?</p>
        <form action="forgot-password">
          <input type="email" name="email" id="email" placeholder="Email" />
          <button type="submit">Forgot Password</button>
        </form>
      </div>
    </div>

    <script>
      function openTab(event, tabName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";
      }
    </script>

  <?php } else { // is logged in 
    wp_redirect(home_url('/my-account'));
  } ?>
</div>

<script>
  function customLogin(event) {
    event.preventDefault(); // Prevent the default form submission

    // Extract username and password from the form
    var username = document.getElementById("user_login").value;
    var password = document.getElementById("user_pass").value;

    // Make an AJAX request to the WordPress JWT authentication endpoint
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '<?php echo esc_url_raw(rest_url("jwt-auth/v1/token")); ?>', true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        var response = JSON.parse(xhr.responseText);
        if (response.token) {
          // Send token to WordPress endpoint
          var xhr2 = new XMLHttpRequest();
          xhr2.open("POST", "https://pricepointwholesale.com/wp-json/custom/v1/encrypt-token", true);
          xhr2.setRequestHeader("Content-Type", "application/json");
          xhr2.onreadystatechange = function() {
            if (xhr2.readyState === XMLHttpRequest.DONE) {
              if (xhr2.status === 200) {
                console.log("Token encrypted and set as cookie successfully");
              } else {
                console.error("Error encrypting token and setting cookie");
              }
            }
          };
          xhr2.send(JSON.stringify({
            token: response.token
          }));
        } else {
          alert("Error: Unable to obtain token");
        }
      } else {
        alert("Error: Unable to connect to the server");
      }
    };
    xhr.onerror = function() {
      alert("Error: Unable to connect to the server");
    };
    xhr.send(
      JSON.stringify({
        username: username,
        password: password,
      })
    );

    // Manually submit the form after executing the custom function
    document.getElementById("custom-login-form").submit();
  }

  document.addEventListener("DOMContentLoaded", function() {
    // Check if the URL contains the parameter 'checkemail' with value 'registered'
    const urlParams = new URLSearchParams(window.location.search);
    const checkEmailParam = urlParams.get('checkemail');
    if (checkEmailParam === 'registered') {
      // Programmatically click on the "Register" tab
      document.querySelector('.tablinks[data-target="#Register"]').click();
      // Display the message to check email
      document.getElementById('register-message').style.display = 'block';
    }

    // Add event listeners for tab switching
    const tabs = document.querySelectorAll('.tablinks');
    const tabContents = document.querySelectorAll('.tabcontent');
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        tabs.forEach(tab => tab.classList.remove('active'));
        tabContents.forEach(tabContent => tabContent.style.display = 'none');
        this.classList.add('active');
        document.querySelector(target).style.display = 'block';
      });
    });
  });
</script>
<?php
get_footer();
?>